package com.ethiojobs.controller;

import com.ethiojobs.dto.ApiResponse;
import com.ethiojobs.dto.JobSeekerProfileDto;
import com.ethiojobs.dto.JobSeekerProfileRequest;
import com.ethiojobs.security.CustomUserDetails;
import com.ethiojobs.service.JobSeekerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final JobSeekerProfileService profileService;

    public ProfileController(JobSeekerProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> getMyProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        JobSeekerProfileDto profile = profileService.getProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> getPublicProfile(@PathVariable Long userId) {
        JobSeekerProfileDto profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> updateMyProfile(@RequestBody JobSeekerProfileRequest request,
                                                                             @AuthenticationPrincipal CustomUserDetails userDetails) {
        JobSeekerProfileDto profile = profileService.updateProfile(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile updated", profile));
    }
}
