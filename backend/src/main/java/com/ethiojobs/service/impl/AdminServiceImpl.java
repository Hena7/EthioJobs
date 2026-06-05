package com.ethiojobs.service.impl;

import com.ethiojobs.dto.UserDto;
import com.ethiojobs.entity.ApplicationStatus;
import com.ethiojobs.entity.JobStatus;
import com.ethiojobs.entity.Role;
import com.ethiojobs.entity.User;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.*;
import com.ethiojobs.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            JobRepository jobRepository,
                            ApplicationRepository applicationRepository,
                            CompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserDto)
                .toList();
    }

    @Override
    @Transactional
    public void updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(active);
        userRepository.save(user);
    }

    @Override
    public Map<String, Object> getOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalUsers", userRepository.count());
        overview.put("totalEmployers", userRepository.countByRole(Role.EMPLOYER));
        overview.put("totalJobSeekers", userRepository.countByRole(Role.JOB_SEEKER));
        overview.put("totalJobs", jobRepository.count());
        overview.put("activeJobs", jobRepository.countByStatus(JobStatus.ACTIVE));
        overview.put("totalApplications", applicationRepository.count());
        overview.put("totalCompanies", companyRepository.count());
        return overview;
    }

    @Override
    public Map<String, Object> getUserAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", userRepository.count());
        analytics.put("employers", userRepository.countByRole(Role.EMPLOYER));
        analytics.put("jobSeekers", userRepository.countByRole(Role.JOB_SEEKER));
        analytics.put("admins", userRepository.countByRole(Role.ADMIN));
        analytics.put("verifiedUsers", userRepository.countByIsVerifiedTrue());
        analytics.put("activeUsers", userRepository.countByIsActiveTrue());
        return analytics;
    }

    @Override
    public Map<String, Object> getJobAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalJobs", jobRepository.count());
        analytics.put("activeJobs", jobRepository.countByStatus(JobStatus.ACTIVE));
        analytics.put("expiredJobs", jobRepository.countByStatus(JobStatus.EXPIRED));
        analytics.put("draftJobs", jobRepository.countByStatus(JobStatus.DRAFT));
        analytics.put("totalApplications", applicationRepository.count());
        analytics.put("pendingApplications", applicationRepository.countByStatus(ApplicationStatus.PENDING));
        analytics.put("reviewedApplications", applicationRepository.countByStatus(ApplicationStatus.REVIEWED));
        analytics.put("shortlistedApplications", applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED));
        analytics.put("rejectedApplications", applicationRepository.countByStatus(ApplicationStatus.REJECTED));
        analytics.put("hiredApplications", applicationRepository.countByStatus(ApplicationStatus.HIRED));
        return analytics;
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
}
