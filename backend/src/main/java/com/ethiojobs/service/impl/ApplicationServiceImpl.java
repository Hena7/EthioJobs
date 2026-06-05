package com.ethiojobs.service.impl;

import com.ethiojobs.dto.ApplicationDto;
import com.ethiojobs.dto.ApplicationRequest;
import com.ethiojobs.entity.*;
import com.ethiojobs.exception.BadRequestException;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.*;
import com.ethiojobs.service.ApplicationService;
import com.ethiojobs.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final NotificationService notificationService;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  JobRepository jobRepository,
                                  UserRepository userRepository,
                                  ResumeRepository resumeRepository,
                                  NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public ApplicationDto apply(Long jobId, ApplicationRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job is no longer accepting applications");
        }

        if (applicationRepository.existsByJobIdAndUserId(jobId, user.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        Resume resume = null;
        if (request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", request.getResumeId()));
            if (!resume.getUser().getId().equals(user.getId())) {
                throw new BadRequestException("Resume does not belong to you");
            }
        }

        Application application = Application.builder()
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.PENDING)
                .job(job)
                .user(user)
                .resume(resume)
                .build();

        application = applicationRepository.save(application);

        notificationService.createNotification(
                job.getCompany().getUser().getId(),
                "New Application",
                user.getName() + " applied for " + job.getTitle(),
                "APPLICATION"
        );

        return toDto(application);
    }

    @Override
    public Page<ApplicationDto> getMyApplications(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return applicationRepository.findByUserId(user.getId(), pageable).map(this::toDto);
    }

    @Override
    public Page<ApplicationDto> getJobApplications(Long jobId, String employerEmail, int page, int size) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getCompany().getUser().getEmail().equals(employerEmail)) {
            throw new BadRequestException("You do not own this job");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        return applicationRepository.findByJobId(jobId, pageable).map(this::toDto);
    }

    @Override
    @Transactional
    public ApplicationDto updateStatus(Long applicationId, ApplicationStatus status, String employerEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        Job job = application.getJob();
        if (!job.getCompany().getUser().getEmail().equals(employerEmail)) {
            throw new BadRequestException("You do not own this job");
        }

        application.setStatus(status);
        application = applicationRepository.save(application);

        notificationService.createNotification(
                application.getUser().getId(),
                "Application " + status.name().toLowerCase(),
                "Your application for " + job.getTitle() + " has been " + status.name().toLowerCase(),
                "APPLICATION_STATUS"
        );

        return toDto(application);
    }

    private ApplicationDto toDto(Application app) {
        return ApplicationDto.builder()
                .id(app.getId())
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .userId(app.getUser().getId())
                .userName(app.getUser().getName())
                .resumeId(app.getResume() != null ? app.getResume().getId() : null)
                .resumeFileName(app.getResume() != null ? app.getResume().getFileName() : null)
                .build();
    }
}
