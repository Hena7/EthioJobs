package com.ethiojobs.repository;

import com.ethiojobs.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByContractIdOrderByCreatedAtAsc(Long contractId);
}
