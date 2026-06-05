package com.ethiojobs.service;

import com.ethiojobs.dto.JobDto;
import com.ethiojobs.dto.JobRequest;
import com.ethiojobs.entity.ExperienceLevel;
import com.ethiojobs.entity.JobType;
import org.springframework.data.domain.Page;

public interface JobService {
    Page<JobDto> getJobs(String search, String category, String location, JobType type,
                         ExperienceLevel expLevel, Double minSalary, Double maxSalary,
                         String sort, int page, int size);
    JobDto getJobById(Long id);
    JobDto createJob(JobRequest request, String employerEmail);
    JobDto updateJob(Long id, JobRequest request, String userEmail);
    void deleteJob(Long id, String userEmail);
    JobDto toggleFeature(Long id);
    Page<JobDto> getMyJobs(String employerEmail, int page, int size);
}
