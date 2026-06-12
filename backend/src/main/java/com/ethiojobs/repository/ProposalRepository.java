package com.ethiojobs.repository;

import com.ethiojobs.entity.Proposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    boolean existsByJobIdAndFreelancerId(Long jobId, Long freelancerId);
    Page<Proposal> findByFreelancerId(Long freelancerId, Pageable pageable);
    Page<Proposal> findByJobId(Long jobId, Pageable pageable);
    long countByJobId(Long jobId);
}
