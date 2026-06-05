package com.ethiojobs.service;

import com.ethiojobs.dto.AuthResponse;
import com.ethiojobs.dto.LoginRequest;
import com.ethiojobs.dto.RegisterRequest;
import com.ethiojobs.dto.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String token);
    void logout(Long userId);
    void verifyEmail(String token);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
    UserDto getCurrentUser(String email);
}
