package com.ethiojobs.repository;

import com.ethiojobs.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Page<Conversation> findByClientIdOrFreelancerId(Long clientId, Long freelancerId, Pageable pageable);
    Optional<Conversation> findByProposalId(Long proposalId);
}
