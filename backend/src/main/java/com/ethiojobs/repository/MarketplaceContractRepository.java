package com.ethiojobs.repository;

import com.ethiojobs.entity.MarketplaceContract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketplaceContractRepository extends JpaRepository<MarketplaceContract, Long> {
    Page<MarketplaceContract> findByClientIdOrFreelancerId(Long clientId, Long freelancerId, Pageable pageable);
    long countByStatus(com.ethiojobs.entity.ContractStatus status);
}
