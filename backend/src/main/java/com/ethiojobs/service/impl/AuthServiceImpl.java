package com.ethiojobs.service.impl;

import com.ethiojobs.dto.AuthResponse;
import com.ethiojobs.dto.LoginRequest;
import com.ethiojobs.dto.RegisterRequest;
import com.ethiojobs.dto.UserDto;
import com.ethiojobs.entity.EmailVerificationToken;
import com.ethiojobs.entity.RefreshToken;
import com.ethiojobs.entity.User;
import com.ethiojobs.exception.BadRequestException;
import com.ethiojobs.exception.DuplicateResourceException;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.EmailVerificationTokenRepository;
import com.ethiojobs.repository.RefreshTokenRepository;
import com.ethiojobs.repository.UserRepository;
import com.ethiojobs.security.JwtTokenProvider;
import com.ethiojobs.service.AuthService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public AuthServiceImpl(UserRepository userRepository,
                           RefreshTokenRepository refreshTokenRepository,
                           EmailVerificationTokenRepository emailVerificationTokenRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider jwtTokenProvider,
                           JavaMailSender mailSender,
                           TemplateEngine templateEngine) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isVerified(false)
                .isActive(true)
                .build();
        try {
            user = userRepository.save(user);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.error("Data integrity violation during registration: {}", e.getMessage());
            throw new DuplicateResourceException("Registration failed. The email might be in use, or there is a role constraint violation.");
        }

        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(EmailVerificationToken.generateToken())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .used(false)
                .user(user)
                .build();
        emailVerificationTokenRepository.save(verificationToken);

        sendVerificationEmail(user.getEmail(), verificationToken.getToken());

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        saveRefreshToken(user, refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(toUserDto(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        String accessToken = jwtTokenProvider.generateAccessToken(email);
        String refreshToken = jwtTokenProvider.generateRefreshToken(email);

        saveRefreshToken(user, refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(toUserDto(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String token) {
        RefreshToken existing = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (existing.isExpired() || existing.isRevoked()) {
            throw new BadRequestException("Refresh token is expired or revoked");
        }

        existing.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(existing);

        User user = existing.getUser();
        String newToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
        saveRefreshToken(user, newToken);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newToken)
                .user(toUserDto(user))
                .build();
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (verificationToken.isUsed()) {
            throw new BadRequestException("Token already used");
        }
        if (verificationToken.isExpired()) {
            throw new BadRequestException("Token expired");
        }

        verificationToken.setUsed(true);
        emailVerificationTokenRepository.save(verificationToken);

        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        EmailVerificationToken resetToken = EmailVerificationToken.builder()
                .token(EmailVerificationToken.generateToken())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .used(false)
                .user(user)
                .build();
        emailVerificationTokenRepository.save(resetToken);

        sendPasswordResetEmail(user.getEmail(), resetToken.getToken());
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        EmailVerificationToken resetToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (resetToken.isUsed()) {
            throw new BadRequestException("Token already used");
        }
        if (resetToken.isExpired()) {
            throw new BadRequestException("Token expired");
        }

        resetToken.setUsed(true);
        emailVerificationTokenRepository.save(resetToken);

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return toUserDto(user);
    }

    private void saveRefreshToken(User user, String token) {
        try {
            refreshTokenRepository.deleteExpiredOrRevoked(LocalDateTime.now());
            refreshTokenRepository.deleteByUserId(user.getId());
            refreshTokenRepository.flush();
            RefreshToken refreshToken = RefreshToken.builder()
                    .token(token)
                    .expiresAt(LocalDateTime.now().plusDays(7))
                    .user(user)
                    .build();
            refreshTokenRepository.save(refreshToken);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.error("Failed to save refresh token for user {}: {}", user.getEmail(), e.getMessage());
            throw new DuplicateResourceException("Concurrent login detected or stale token constraints. Please try again.");
        }
    }

    private UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isVerified(user.isVerified())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Async
    protected void sendVerificationEmail(String to, String token) {
        try {
            Context context = new Context();
            context.setVariable("token", token);
            String html = templateEngine.process("email/verification", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Verify your email - EthioJobs");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send verification email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    protected void sendPasswordResetEmail(String to, String token) {
        try {
            Context context = new Context();
            context.setVariable("token", token);
            String html = templateEngine.process("email/reset-password", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Reset your password - EthioJobs");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send password reset email to {}: {}", to, e.getMessage());
        }
    }
}
