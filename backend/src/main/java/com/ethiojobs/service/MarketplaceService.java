package com.ethiojobs.service;

import com.ethiojobs.dto.MarketplaceDtos.*;
import com.ethiojobs.entity.*;
import org.springframework.data.domain.Page;
import java.util.List;

public interface MarketplaceService {
    ProposalDto submitProposal(Long jobId, ProposalRequest request, String email);
    Page<ProposalDto> getMyProposals(String email, int page, int size);
    Page<ProposalDto> getJobProposals(Long jobId, String email, int page, int size);
    ProposalDto updateProposalStatus(Long proposalId, ProposalStatus status, String email);
    ContractDto hireProposal(Long proposalId, HireRequest request, String email);
    Page<ContractDto> getMyContracts(String email, int page, int size);
    ContractDto updateContractStatus(Long contractId, ContractStatus status, String email);
    MilestoneDto addMilestone(Long contractId, MilestoneRequest request, String email);
    MilestoneDto updateMilestoneStatus(Long milestoneId, MilestoneStatus status, String email);
    TimeEntryDto addTimeEntry(Long contractId, TimeEntryRequest request, String email);
    TimeEntryDto updateTimeEntryStatus(Long timeEntryId, TimeEntryStatus status, String email);
    Page<ConversationDto> getMyConversations(String email, int page, int size);
    ConversationDto startConversationForProposal(Long proposalId, String email);
    List<MessageDto> getMessages(Long conversationId, String email);
    MessageDto sendMessage(Long conversationId, MessageRequest request, String email);
    ReviewDto createReview(Long contractId, ReviewRequest request, String email);
    List<ReviewDto> getReviewsForUser(Long userId);
    Page<ServiceListingDto> getCatalog(int page, int size);
    Page<ServiceListingDto> getMyListings(String email, int page, int size);
    ServiceListingDto createListing(ServiceListingRequest request, String email);
    ContractDto orderListing(Long listingId, HireRequest request, String email);
}
