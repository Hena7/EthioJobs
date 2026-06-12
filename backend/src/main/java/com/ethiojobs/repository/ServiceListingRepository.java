package com.ethiojobs.repository;

import com.ethiojobs.entity.ServiceListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceListingRepository extends JpaRepository<ServiceListing, Long> {
    Page<ServiceListing> findByActiveTrue(Pageable pageable);
    Page<ServiceListing> findByFreelancerId(Long freelancerId, Pageable pageable);
}
