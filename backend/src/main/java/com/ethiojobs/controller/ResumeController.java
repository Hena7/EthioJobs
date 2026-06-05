package com.ethiojobs.controller;

import com.ethiojobs.dto.ApiResponse;
import com.ethiojobs.dto.ResumeDto;
import com.ethiojobs.security.CustomUserDetails;
import com.ethiojobs.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApiResponse<ResumeDto>> uploadResume(@RequestParam("file") MultipartFile file,
                                                                @AuthenticationPrincipal CustomUserDetails userDetails) {
        ResumeDto resume = resumeService.uploadResume(file, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded", resume));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getMyResumes(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ResumeDto> resumes = resumeService.getMyResumes(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Resumes retrieved", resumes));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApiResponse<Void>> deleteResume(@PathVariable Long id,
                                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        resumeService.deleteResume(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Resume deleted", null));
    }
}
