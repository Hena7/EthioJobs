package com.ethiojobs.service;

import com.ethiojobs.dto.JobSeekerProfileDto;
import com.ethiojobs.dto.JobSeekerProfileRequest;

public interface JobSeekerProfileService {
    JobSeekerProfileDto getProfileByEmail(String email);
    JobSeekerProfileDto getProfileByUserId(Long userId);
    JobSeekerProfileDto updateProfile(JobSeekerProfileRequest request, String email);
}
