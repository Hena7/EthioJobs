package com.ethiojobs.controller;

import com.ethiojobs.dto.ApiResponse;
import com.ethiojobs.dto.JobDto;
import com.ethiojobs.dto.JobRequest;
import com.ethiojobs.entity.ExperienceLevel;
import com.ethiojobs.entity.JobType;
import com.ethiojobs.security.CustomUserDetails;
import com.ethiojobs.service.JobService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobDto>>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType type,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Double maxSalary,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<JobDto> jobs = jobService.getJobs(search, category, location, type, experienceLevel,
                minSalary, maxSalary, sort, page, size);
        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved", jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(@PathVariable Long id) {
        JobDto job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success("Job retrieved", job));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Page<JobDto>>> getMyJobs(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<JobDto> jobs = jobService.getMyJobs(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved", jobs));
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<JobDto>> createJob(@Valid @RequestBody JobRequest request,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        JobDto job = jobService.createJob(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job created", job));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<JobDto>> updateJob(@PathVariable Long id,
                                                          @Valid @RequestBody JobRequest request,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        JobDto job = jobService.updateJob(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job updated", job));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id,
                                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        jobService.deleteJob(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job deleted", null));
    }

    @PatchMapping("/{id}/feature")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobDto>> toggleFeature(@PathVariable Long id) {
        JobDto job = jobService.toggleFeature(id);
        return ResponseEntity.ok(ApiResponse.success("Feature toggled", job));
    }
}
