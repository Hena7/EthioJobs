package com.ethiojobs.repository;

import com.ethiojobs.entity.JobSeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobSeekerProfileRepository extends JpaRepository<JobSeekerProfile, Long> {
    Optional<JobSeekerProfile> findByUserId(Long userId);
    Optional<JobSeekerProfile> findByUserEmail(String email);
}
