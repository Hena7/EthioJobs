package com.ethiojobs.service.impl;

import com.ethiojobs.dto.JobDto;
import com.ethiojobs.dto.JobRequest;
import com.ethiojobs.entity.Company;
import com.ethiojobs.entity.ExperienceLevel;
import com.ethiojobs.entity.Job;
import com.ethiojobs.entity.JobStatus;
import com.ethiojobs.entity.JobType;
import com.ethiojobs.entity.User;
import com.ethiojobs.exception.BadRequestException;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.CompanyRepository;
import com.ethiojobs.repository.JobRepository;
import com.ethiojobs.repository.UserRepository;
import com.ethiojobs.service.JobService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public JobServiceImpl(JobRepository jobRepository, UserRepository userRepository,
                          CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    @Cacheable(value = "jobs", key = "#search + '-' + #category + '-' + #location + '-' + #type + '-' + #expLevel + '-' + #minSalary + '-' + #maxSalary + '-' + #sort + '-' + #page + '-' + #size")
    public Page<JobDto> getJobs(String search, String category, String location, JobType type,
                                ExperienceLevel expLevel, Double minSalary, Double maxSalary,
                                String sort, int page, int size) {
        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("status"), JobStatus.ACTIVE));

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (expLevel != null) {
                predicates.add(cb.equal(root.get("experienceLevel"), expLevel));
            }
            if (minSalary != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salaryMax"), minSalary));
            }
            if (maxSalary != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salaryMin"), maxSalary));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sorting;
        if (sort != null) {
            sorting = switch (sort) {
                case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
                case "salary_high" -> Sort.by(Sort.Direction.DESC, "salaryMax");
                case "salary_low" -> Sort.by(Sort.Direction.ASC, "salaryMin");
                default -> Sort.by(Sort.Direction.DESC, "createdAt");
            };
        } else {
            sorting = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, size, sorting);
        return jobRepository.findAll(spec, pageable).map(this::toJobDto);
    }

    @Override
    @Transactional
    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        job.setViewCount(job.getViewCount() + 1);
        job = jobRepository.save(job);
        return toJobDto(job);
    }

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobDto createJob(JobRequest request, String employerEmail) {
        User user = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("You must create a company profile first"));

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .type(request.getType())
                .location(request.getLocation())
                .category(request.getCategory())
                .experienceLevel(request.getExperienceLevel())
                .deadline(request.getDeadline())
                .status(JobStatus.ACTIVE)
                .isFeatured(false)
                .viewCount(0)
                .company(company)
                .build();

        job = jobRepository.save(job);
        return toJobDto(job);
    }

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobDto updateJob(Long id, JobRequest request, String userEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        verifyOwnership(job, userEmail);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setType(request.getType());
        job.setLocation(request.getLocation());
        job.setCategory(request.getCategory());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setDeadline(request.getDeadline());

        job = jobRepository.save(job);
        return toJobDto(job);
    }

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public void deleteJob(Long id, String userEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (!user.getRole().name().equals("ADMIN")) {
            verifyOwnership(job, userEmail);
        }

        jobRepository.delete(job);
    }

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobDto toggleFeature(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        job.setFeatured(!job.isFeatured());
        job = jobRepository.save(job);
        return toJobDto(job);
    }

    @Override
    public Page<JobDto> getMyJobs(String employerEmail, int page, int size) {
        User user = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("No company profile found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return jobRepository.findByCompanyId(company.getId(), pageable).map(this::toJobDto);
    }

    private void verifyOwnership(Job job, String email) {
        if (!job.getCompany().getUser().getEmail().equals(email)) {
            throw new BadRequestException("You do not have permission to modify this job");
        }
    }

    private JobDto toJobDto(Job job) {
        Company c = job.getCompany();
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .type(job.getType())
                .location(job.getLocation())
                .category(job.getCategory())
                .experienceLevel(job.getExperienceLevel())
                .deadline(job.getDeadline())
                .status(job.getStatus())
                .isFeatured(job.isFeatured())
                .viewCount(job.getViewCount())
                .companyId(c.getId())
                .companyName(c.getName())
                .companyLogo(c.getLogo())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
