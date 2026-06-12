package com.ethiojobs.controller;

import com.ethiojobs.dto.ApiResponse;
import com.ethiojobs.dto.ApplicationDto;
import com.ethiojobs.dto.ApplicationRequest;
import com.ethiojobs.entity.ApplicationStatus;
import com.ethiojobs.security.CustomUserDetails;
import com.ethiojobs.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/api/jobs/{jobId}/apply")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<ApplicationDto>> apply(@PathVariable Long jobId,
                                                              @Valid @RequestBody ApplicationRequest request,
                                                              @AuthenticationPrincipal CustomUserDetails userDetails) {
        ApplicationDto app = applicationService.apply(jobId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Application submitted", app));
    }

    @GetMapping("/api/applications/mine")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<Page<ApplicationDto>>> getMyApplications(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ApplicationDto> apps = applicationService.getMyApplications(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", apps));
    }

    @GetMapping("/api/jobs/{jobId}/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Page<ApplicationDto>>> getJobApplications(
            @PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ApplicationDto> apps = applicationService.getJobApplications(jobId, userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", apps));
    }

    @PatchMapping("/api/applications/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ApplicationStatus status = ApplicationStatus.valueOf(body.get("status").toUpperCase());
        ApplicationDto app = applicationService.updateStatus(id, status, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Status updated", app));
    }
}
