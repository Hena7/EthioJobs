package com.ethiojobs.service;

import com.ethiojobs.dto.ApplicationDto;
import com.ethiojobs.dto.ApplicationRequest;
import com.ethiojobs.entity.ApplicationStatus;
import org.springframework.data.domain.Page;

public interface ApplicationService {
    ApplicationDto apply(Long jobId, ApplicationRequest request, String userEmail);
    Page<ApplicationDto> getMyApplications(String userEmail, int page, int size);
    Page<ApplicationDto> getJobApplications(Long jobId, String employerEmail, int page, int size);
    ApplicationDto updateStatus(Long applicationId, ApplicationStatus status, String employerEmail);
}
