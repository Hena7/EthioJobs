package com.ethiojobs.repository;

import com.ethiojobs.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByContractIdAndReviewerId(Long contractId, Long reviewerId);
    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);
}
