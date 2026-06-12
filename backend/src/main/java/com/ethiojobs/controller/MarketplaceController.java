package com.ethiojobs.controller;

import com.ethiojobs.dto.ApiResponse;
import com.ethiojobs.dto.MarketplaceDtos.*;
import com.ethiojobs.entity.*;
import com.ethiojobs.security.CustomUserDetails;
import com.ethiojobs.service.MarketplaceService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/marketplace")
public class MarketplaceController {
    private final MarketplaceService marketplaceService;

    public MarketplaceController(MarketplaceService marketplaceService) {
        this.marketplaceService = marketplaceService;
    }

    @PostMapping("/jobs/{jobId}/proposals")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<ProposalDto>> submitProposal(@PathVariable Long jobId,
                                                                    @RequestBody ProposalRequest request,
                                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Proposal submitted",
                marketplaceService.submitProposal(jobId, request, userDetails.getUsername())));
    }

    @GetMapping("/proposals/mine")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<Page<ProposalDto>>> myProposals(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Proposals retrieved",
                marketplaceService.getMyProposals(userDetails.getUsername(), page, size)));
    }

    @GetMapping("/jobs/{jobId}/proposals")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Page<ProposalDto>>> jobProposals(@PathVariable Long jobId,
                                                                       @AuthenticationPrincipal CustomUserDetails userDetails,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Proposals retrieved",
                marketplaceService.getJobProposals(jobId, userDetails.getUsername(), page, size)));
    }

    @PatchMapping("/proposals/{proposalId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<ProposalDto>> updateProposalStatus(@PathVariable Long proposalId,
                                                                         @RequestBody Map<String, String> body,
                                                                         @AuthenticationPrincipal CustomUserDetails userDetails) {
        ProposalStatus status = ProposalStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Proposal updated",
                marketplaceService.updateProposalStatus(proposalId, status, userDetails.getUsername())));
    }

    @PostMapping("/proposals/{proposalId}/hire")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<ContractDto>> hireProposal(@PathVariable Long proposalId,
                                                                 @RequestBody HireRequest request,
                                                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Contract started",
                marketplaceService.hireProposal(proposalId, request, userDetails.getUsername())));
    }

    @GetMapping("/contracts/mine")
    public ResponseEntity<ApiResponse<Page<ContractDto>>> myContracts(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Contracts retrieved",
                marketplaceService.getMyContracts(userDetails.getUsername(), page, size)));
    }

    @PatchMapping("/contracts/{contractId}/status")
    public ResponseEntity<ApiResponse<ContractDto>> updateContractStatus(@PathVariable Long contractId,
                                                                         @RequestBody Map<String, String> body,
                                                                         @AuthenticationPrincipal CustomUserDetails userDetails) {
        ContractStatus status = ContractStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Contract updated",
                marketplaceService.updateContractStatus(contractId, status, userDetails.getUsername())));
    }

    @PostMapping("/contracts/{contractId}/milestones")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<MilestoneDto>> addMilestone(@PathVariable Long contractId,
                                                                  @RequestBody MilestoneRequest request,
                                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Milestone added",
                marketplaceService.addMilestone(contractId, request, userDetails.getUsername())));
    }

    @PatchMapping("/milestones/{milestoneId}/status")
    public ResponseEntity<ApiResponse<MilestoneDto>> updateMilestoneStatus(@PathVariable Long milestoneId,
                                                                           @RequestBody Map<String, String> body,
                                                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        MilestoneStatus status = MilestoneStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Milestone updated",
                marketplaceService.updateMilestoneStatus(milestoneId, status, userDetails.getUsername())));
    }

    @PostMapping("/contracts/{contractId}/time-entries")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<TimeEntryDto>> addTimeEntry(@PathVariable Long contractId,
                                                                  @RequestBody TimeEntryRequest request,
                                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Time submitted",
                marketplaceService.addTimeEntry(contractId, request, userDetails.getUsername())));
    }

    @PatchMapping("/time-entries/{timeEntryId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<TimeEntryDto>> updateTimeEntryStatus(@PathVariable Long timeEntryId,
                                                                           @RequestBody Map<String, String> body,
                                                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        TimeEntryStatus status = TimeEntryStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Time entry updated",
                marketplaceService.updateTimeEntryStatus(timeEntryId, status, userDetails.getUsername())));
    }

    @GetMapping("/conversations/mine")
    public ResponseEntity<ApiResponse<Page<ConversationDto>>> myConversations(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                              @RequestParam(defaultValue = "0") int page,
                                                                              @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved",
                marketplaceService.getMyConversations(userDetails.getUsername(), page, size)));
    }

    @PostMapping("/proposals/{proposalId}/conversation")
    public ResponseEntity<ApiResponse<ConversationDto>> startConversation(@PathVariable Long proposalId,
                                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Conversation ready",
                marketplaceService.startConversationForProposal(proposalId, userDetails.getUsername())));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<MessageDto>>> messages(@PathVariable Long conversationId,
                                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved",
                marketplaceService.getMessages(conversationId, userDetails.getUsername())));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(@PathVariable Long conversationId,
                                                               @RequestBody MessageRequest request,
                                                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Message sent",
                marketplaceService.sendMessage(conversationId, request, userDetails.getUsername())));
    }

    @PostMapping("/contracts/{contractId}/reviews")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(@PathVariable Long contractId,
                                                               @RequestBody ReviewRequest request,
                                                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Review created",
                marketplaceService.createReview(contractId, request, userDetails.getUsername())));
    }

    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> userReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", marketplaceService.getReviewsForUser(userId)));
    }

    @GetMapping("/catalog")
    public ResponseEntity<ApiResponse<Page<ServiceListingDto>>> catalog(@RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Catalog retrieved", marketplaceService.getCatalog(page, size)));
    }

    @GetMapping("/catalog/mine")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<Page<ServiceListingDto>>> myListings(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                           @RequestParam(defaultValue = "0") int page,
                                                                           @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Listings retrieved",
                marketplaceService.getMyListings(userDetails.getUsername(), page, size)));
    }

    @PostMapping("/catalog")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'FREELANCER')")
    public ResponseEntity<ApiResponse<ServiceListingDto>> createListing(@RequestBody ServiceListingRequest request,
                                                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Listing created",
                marketplaceService.createListing(request, userDetails.getUsername())));
    }

    @PostMapping("/catalog/{listingId}/order")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<ContractDto>> orderListing(@PathVariable Long listingId,
                                                                 @RequestBody HireRequest request,
                                                                 @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Catalog order started",
                marketplaceService.orderListing(listingId, request, userDetails.getUsername())));
    }
}
