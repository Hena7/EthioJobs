package com.ethiojobs.repository;

import com.ethiojobs.entity.Job;
import com.ethiojobs.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    Page<Job> findByCompanyId(Long companyId, Pageable pageable);
    long countByStatus(JobStatus status);
}
