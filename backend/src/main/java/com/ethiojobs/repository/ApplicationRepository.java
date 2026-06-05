package com.ethiojobs.repository;

import com.ethiojobs.entity.Application;
import com.ethiojobs.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Page<Application> findByUserId(Long userId, Pageable pageable);
    Page<Application> findByJobId(Long jobId, Pageable pageable);
    boolean existsByJobIdAndUserId(Long jobId, Long userId);
    long countByStatus(ApplicationStatus status);
}
