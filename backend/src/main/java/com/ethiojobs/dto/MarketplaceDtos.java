package com.ethiojobs.dto;

import com.ethiojobs.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MarketplaceDtos {
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ProposalRequest {
        private String coverLetter;
        private Double bidAmount;
        private String estimatedDuration;
        private String attachments;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ProposalDto {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private Long freelancerId;
        private String freelancerName;
        private String coverLetter;
        private Double bidAmount;
        private String estimatedDuration;
        private String attachments;
        private ProposalStatus status;
        private LocalDateTime submittedAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class HireRequest {
        private ContractType type;
        private Double budget;
        private Double hourlyRate;
        private List<MilestoneRequest> milestones;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ContractDto {
        private Long id;
        private String title;
        private ContractType type;
        private ContractStatus status;
        private Double budget;
        private Double hourlyRate;
        private Long clientId;
        private String clientName;
        private Long freelancerId;
        private String freelancerName;
        private Long jobId;
        private Long proposalId;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private List<MilestoneDto> milestones;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MilestoneRequest {
        private String title;
        private String description;
        private Double amount;
        private LocalDateTime dueDate;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MilestoneDto {
        private Long id;
        private String title;
        private String description;
        private Double amount;
        private LocalDateTime dueDate;
        private MilestoneStatus status;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TimeEntryRequest {
        private LocalDate workDate;
        private Double hours;
        private String memo;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TimeEntryDto {
        private Long id;
        private LocalDate workDate;
        private Double hours;
        private String memo;
        private TimeEntryStatus status;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ConversationDto {
        private Long id;
        private Long clientId;
        private String clientName;
        private Long freelancerId;
        private String freelancerName;
        private Long proposalId;
        private Long contractId;
        private LocalDateTime lastMessageAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MessageRequest {
        private String body;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MessageDto {
        private Long id;
        private Long conversationId;
        private Long senderId;
        private String senderName;
        private String body;
        private boolean readByRecipient;
        private LocalDateTime createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReviewRequest {
        private Integer rating;
        private String comment;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReviewDto {
        private Long id;
        private Long contractId;
        private Long reviewerId;
        private String reviewerName;
        private Long revieweeId;
        private String revieweeName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ServiceListingRequest {
        private String title;
        private String category;
        private String description;
        private Double price;
        private Integer deliveryDays;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ServiceListingDto {
        private Long id;
        private String title;
        private String category;
        private String description;
        private Double price;
        private Integer deliveryDays;
        private boolean active;
        private Long freelancerId;
        private String freelancerName;
        private LocalDateTime createdAt;
    }
}
