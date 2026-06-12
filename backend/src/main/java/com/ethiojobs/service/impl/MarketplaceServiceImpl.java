package com.ethiojobs.service.impl;

import com.ethiojobs.dto.MarketplaceDtos.*;
import com.ethiojobs.entity.*;
import com.ethiojobs.exception.BadRequestException;
import com.ethiojobs.exception.ResourceNotFoundException;
import com.ethiojobs.repository.*;
import com.ethiojobs.service.MarketplaceService;
import com.ethiojobs.service.NotificationService;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MarketplaceServiceImpl implements MarketplaceService {
    private final ProposalRepository proposalRepository;
    private final MarketplaceContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final TimeEntryRepository timeEntryRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ReviewRepository reviewRepository;
    private final ServiceListingRepository serviceListingRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public MarketplaceServiceImpl(
            ProposalRepository proposalRepository,
            MarketplaceContractRepository contractRepository,
            MilestoneRepository milestoneRepository,
            TimeEntryRepository timeEntryRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            ReviewRepository reviewRepository,
            ServiceListingRepository serviceListingRepository,
            LedgerEntryRepository ledgerEntryRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.proposalRepository = proposalRepository;
        this.contractRepository = contractRepository;
        this.milestoneRepository = milestoneRepository;
        this.timeEntryRepository = timeEntryRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.reviewRepository = reviewRepository;
        this.serviceListingRepository = serviceListingRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public ProposalDto submitProposal(Long jobId, ProposalRequest request, String email) {
        User freelancer = user(email);
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job is not accepting proposals");
        }
        if (proposalRepository.existsByJobIdAndFreelancerId(jobId, freelancer.getId())) {
            throw new BadRequestException("You have already submitted a proposal for this job");
        }
        Proposal proposal = Proposal.builder()
                .job(job)
                .freelancer(freelancer)
                .coverLetter(request.getCoverLetter())
                .bidAmount(request.getBidAmount())
                .estimatedDuration(request.getEstimatedDuration())
                .attachments(request.getAttachments())
                .status(ProposalStatus.SUBMITTED)
                .build();
        proposal = proposalRepository.save(proposal);
        notificationService.createNotification(job.getCompany().getUser().getId(), "New proposal",
                freelancer.getName() + " submitted a proposal for " + job.getTitle(), "PROPOSAL");
        return proposalDto(proposal);
    }

    @Override
    public Page<ProposalDto> getMyProposals(String email, int page, int size) {
        User freelancer = user(email);
        return proposalRepository.findByFreelancerId(freelancer.getId(), pageable(page, size, "submittedAt")).map(this::proposalDto);
    }

    @Override
    public Page<ProposalDto> getJobProposals(Long jobId, String email, int page, int size) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        verifyClientOwnsJob(job, email);
        return proposalRepository.findByJobId(jobId, pageable(page, size, "submittedAt")).map(this::proposalDto);
    }

    @Override
    @Transactional
    public ProposalDto updateProposalStatus(Long proposalId, ProposalStatus status, String email) {
        Proposal proposal = proposal(proposalId);
        verifyClientOwnsJob(proposal.getJob(), email);
        proposal.setStatus(status);
        proposal = proposalRepository.save(proposal);
        notificationService.createNotification(proposal.getFreelancer().getId(), "Proposal " + status.name().toLowerCase(),
                "Your proposal for " + proposal.getJob().getTitle() + " is now " + status.name().toLowerCase(), "PROPOSAL");
        return proposalDto(proposal);
    }

    @Override
    @Transactional
    public ContractDto hireProposal(Long proposalId, HireRequest request, String email) {
        Proposal proposal = proposal(proposalId);
        verifyClientOwnsJob(proposal.getJob(), email);
        ContractType type = request.getType() == null ? ContractType.FIXED_PRICE : request.getType();
        MarketplaceContract contract = MarketplaceContract.builder()
                .title(proposal.getJob().getTitle())
                .type(type)
                .status(ContractStatus.ACTIVE)
                .budget(request.getBudget() != null ? request.getBudget() : proposal.getBidAmount())
                .hourlyRate(request.getHourlyRate())
                .client(proposal.getJob().getCompany().getUser())
                .freelancer(proposal.getFreelancer())
                .job(proposal.getJob())
                .proposal(proposal)
                .build();
        contract = contractRepository.save(contract);
        proposal.setStatus(ProposalStatus.HIRED);
        proposalRepository.save(proposal);
        if (request.getMilestones() != null) {
            for (MilestoneRequest milestoneRequest : request.getMilestones()) {
                milestoneRepository.save(toMilestone(contract, milestoneRequest));
            }
        }
        notificationService.createNotification(proposal.getFreelancer().getId(), "Contract started",
                "You were hired for " + proposal.getJob().getTitle(), "CONTRACT");
        return contractDto(contractRepository.findById(contract.getId()).orElse(contract));
    }

    @Override
    public Page<ContractDto> getMyContracts(String email, int page, int size) {
        User current = user(email);
        return contractRepository.findByClientIdOrFreelancerId(current.getId(), current.getId(), pageable(page, size, "createdAt"))
                .map(this::contractDto);
    }

    @Override
    @Transactional
    public ContractDto updateContractStatus(Long contractId, ContractStatus status, String email) {
        MarketplaceContract contract = contract(contractId);
        verifyContractParticipant(contract, email);
        contract.setStatus(status);
        if (status == ContractStatus.COMPLETED) {
            contract.setEndDate(LocalDateTime.now());
        }
        return contractDto(contractRepository.save(contract));
    }

    @Override
    @Transactional
    public MilestoneDto addMilestone(Long contractId, MilestoneRequest request, String email) {
        MarketplaceContract contract = contract(contractId);
        if (!contract.getClient().getEmail().equals(email)) {
            throw new BadRequestException("Only the client can add milestones");
        }
        return milestoneDto(milestoneRepository.save(toMilestone(contract, request)));
    }

    @Override
    @Transactional
    public MilestoneDto updateMilestoneStatus(Long milestoneId, MilestoneStatus status, String email) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone", "id", milestoneId));
        verifyContractParticipant(milestone.getContract(), email);
        milestone.setStatus(status);
        milestone = milestoneRepository.save(milestone);
        if (status == MilestoneStatus.FUNDED || status == MilestoneStatus.RELEASED) {
            ledgerEntryRepository.save(LedgerEntry.builder()
                    .type(status == MilestoneStatus.FUNDED ? LedgerEntryType.MILESTONE_FUNDED : LedgerEntryType.MILESTONE_RELEASED)
                    .amount(milestone.getAmount())
                    .contract(milestone.getContract())
                    .milestone(milestone)
                    .build());
        }
        return milestoneDto(milestone);
    }

    @Override
    @Transactional
    public TimeEntryDto addTimeEntry(Long contractId, TimeEntryRequest request, String email) {
        MarketplaceContract contract = contract(contractId);
        if (!contract.getFreelancer().getEmail().equals(email)) {
            throw new BadRequestException("Only the freelancer can add time");
        }
        TimeEntry entry = TimeEntry.builder()
                .contract(contract)
                .workDate(request.getWorkDate())
                .hours(request.getHours())
                .memo(request.getMemo())
                .status(TimeEntryStatus.SUBMITTED)
                .build();
        return timeEntryDto(timeEntryRepository.save(entry));
    }

    @Override
    @Transactional
    public TimeEntryDto updateTimeEntryStatus(Long timeEntryId, TimeEntryStatus status, String email) {
        TimeEntry entry = timeEntryRepository.findById(timeEntryId)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry", "id", timeEntryId));
        if (!entry.getContract().getClient().getEmail().equals(email)) {
            throw new BadRequestException("Only the client can approve or reject time");
        }
        entry.setStatus(status);
        entry = timeEntryRepository.save(entry);
        if (status == TimeEntryStatus.APPROVED) {
            double amount = (entry.getHours() == null ? 0 : entry.getHours()) *
                    (entry.getContract().getHourlyRate() == null ? 0 : entry.getContract().getHourlyRate());
            ledgerEntryRepository.save(LedgerEntry.builder()
                    .type(LedgerEntryType.HOURLY_APPROVED)
                    .amount(amount)
                    .contract(entry.getContract())
                    .build());
        }
        return timeEntryDto(entry);
    }

    @Override
    public Page<ConversationDto> getMyConversations(String email, int page, int size) {
        User current = user(email);
        return conversationRepository.findByClientIdOrFreelancerId(current.getId(), current.getId(), pageable(page, size, "lastMessageAt"))
                .map(this::conversationDto);
    }

    @Override
    @Transactional
    public ConversationDto startConversationForProposal(Long proposalId, String email) {
        Proposal proposal = proposal(proposalId);
        verifyProposalParticipant(proposal, email);
        Conversation conversation = conversationRepository.findByProposalId(proposalId)
                .orElseGet(() -> conversationRepository.save(Conversation.builder()
                        .client(proposal.getJob().getCompany().getUser())
                        .freelancer(proposal.getFreelancer())
                        .proposal(proposal)
                        .build()));
        return conversationDto(conversation);
    }

    @Override
    public List<MessageDto> getMessages(Long conversationId, String email) {
        Conversation conversation = conversation(conversationId);
        verifyConversationParticipant(conversation, email);
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).stream().map(this::messageDto).toList();
    }

    @Override
    @Transactional
    public MessageDto sendMessage(Long conversationId, MessageRequest request, String email) {
        Conversation conversation = conversation(conversationId);
        verifyConversationParticipant(conversation, email);
        User sender = user(email);
        Message message = messageRepository.save(Message.builder()
                .conversation(conversation)
                .sender(sender)
                .body(request.getBody())
                .readByRecipient(false)
                .build());
        conversation.setLastMessageAt(message.getCreatedAt());
        conversationRepository.save(conversation);
        Long recipientId = conversation.getClient().getId().equals(sender.getId())
                ? conversation.getFreelancer().getId()
                : conversation.getClient().getId();
        notificationService.createNotification(recipientId, "New message", sender.getName() + " sent you a message", "MESSAGE");
        return messageDto(message);
    }

    @Override
    @Transactional
    public ReviewDto createReview(Long contractId, ReviewRequest request, String email) {
        MarketplaceContract contract = contract(contractId);
        verifyContractParticipant(contract, email);
        if (contract.getStatus() != ContractStatus.COMPLETED) {
            throw new BadRequestException("Reviews are only allowed after a completed contract");
        }
        User reviewer = user(email);
        if (reviewRepository.existsByContractIdAndReviewerId(contractId, reviewer.getId())) {
            throw new BadRequestException("You already reviewed this contract");
        }
        User reviewee = contract.getClient().getId().equals(reviewer.getId()) ? contract.getFreelancer() : contract.getClient();
        Review review = reviewRepository.save(Review.builder()
                .contract(contract)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build());
        return reviewDto(review);
    }

    @Override
    public List<ReviewDto> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId).stream().map(this::reviewDto).toList();
    }

    @Override
    public Page<ServiceListingDto> getCatalog(int page, int size) {
        return serviceListingRepository.findByActiveTrue(pageable(page, size, "createdAt")).map(this::listingDto);
    }

    @Override
    public Page<ServiceListingDto> getMyListings(String email, int page, int size) {
        User freelancer = user(email);
        return serviceListingRepository.findByFreelancerId(freelancer.getId(), pageable(page, size, "createdAt")).map(this::listingDto);
    }

    @Override
    @Transactional
    public ServiceListingDto createListing(ServiceListingRequest request, String email) {
        User freelancer = user(email);
        ServiceListing listing = serviceListingRepository.save(ServiceListing.builder()
                .freelancer(freelancer)
                .title(request.getTitle())
                .category(request.getCategory())
                .description(request.getDescription())
                .price(request.getPrice())
                .deliveryDays(request.getDeliveryDays())
                .active(true)
                .build());
        return listingDto(listing);
    }

    @Override
    @Transactional
    public ContractDto orderListing(Long listingId, HireRequest request, String email) {
        User client = user(email);
        ServiceListing listing = serviceListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Service listing", "id", listingId));
        MarketplaceContract contract = contractRepository.save(MarketplaceContract.builder()
                .title(listing.getTitle())
                .type(ContractType.FIXED_PRICE)
                .status(ContractStatus.ACTIVE)
                .budget(request.getBudget() != null ? request.getBudget() : listing.getPrice())
                .client(client)
                .freelancer(listing.getFreelancer())
                .build());
        Milestone milestone = milestoneRepository.save(Milestone.builder()
                .contract(contract)
                .title(listing.getTitle())
                .description("Catalog order")
                .amount(contract.getBudget())
                .status(MilestoneStatus.FUNDED)
                .build());
        ledgerEntryRepository.save(LedgerEntry.builder()
                .type(LedgerEntryType.CATALOG_ORDER)
                .amount(contract.getBudget())
                .contract(contract)
                .milestone(milestone)
                .build());
        notificationService.createNotification(listing.getFreelancer().getId(), "New catalog order",
                client.getName() + " ordered " + listing.getTitle(), "CATALOG");
        return contractDto(contractRepository.findById(contract.getId()).orElse(contract));
    }

    private User user(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Proposal proposal(Long id) {
        return proposalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));
    }

    private MarketplaceContract contract(Long id) {
        return contractRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contract", "id", id));
    }

    private Conversation conversation(Long id) {
        return conversationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", id));
    }

    private Pageable pageable(int page, int size, String sort) {
        return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sort));
    }

    private void verifyClientOwnsJob(Job job, String email) {
        if (!job.getCompany().getUser().getEmail().equals(email)) {
            throw new BadRequestException("You do not own this job");
        }
    }

    private void verifyProposalParticipant(Proposal proposal, String email) {
        if (!proposal.getFreelancer().getEmail().equals(email) && !proposal.getJob().getCompany().getUser().getEmail().equals(email)) {
            throw new BadRequestException("You are not part of this proposal");
        }
    }

    private void verifyContractParticipant(MarketplaceContract contract, String email) {
        if (!contract.getClient().getEmail().equals(email) && !contract.getFreelancer().getEmail().equals(email)) {
            throw new BadRequestException("You are not part of this contract");
        }
    }

    private void verifyConversationParticipant(Conversation conversation, String email) {
        if (!conversation.getClient().getEmail().equals(email) && !conversation.getFreelancer().getEmail().equals(email)) {
            throw new BadRequestException("You are not part of this conversation");
        }
    }

    private Milestone toMilestone(MarketplaceContract contract, MilestoneRequest request) {
        return Milestone.builder()
                .contract(contract)
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .status(MilestoneStatus.DRAFT)
                .build();
    }

    private ProposalDto proposalDto(Proposal proposal) {
        return ProposalDto.builder()
                .id(proposal.getId())
                .jobId(proposal.getJob().getId())
                .jobTitle(proposal.getJob().getTitle())
                .freelancerId(proposal.getFreelancer().getId())
                .freelancerName(proposal.getFreelancer().getName())
                .coverLetter(proposal.getCoverLetter())
                .bidAmount(proposal.getBidAmount())
                .estimatedDuration(proposal.getEstimatedDuration())
                .attachments(proposal.getAttachments())
                .status(proposal.getStatus())
                .submittedAt(proposal.getSubmittedAt())
                .build();
    }

    private ContractDto contractDto(MarketplaceContract contract) {
        return ContractDto.builder()
                .id(contract.getId())
                .title(contract.getTitle())
                .type(contract.getType())
                .status(contract.getStatus())
                .budget(contract.getBudget())
                .hourlyRate(contract.getHourlyRate())
                .clientId(contract.getClient().getId())
                .clientName(contract.getClient().getName())
                .freelancerId(contract.getFreelancer().getId())
                .freelancerName(contract.getFreelancer().getName())
                .jobId(contract.getJob() != null ? contract.getJob().getId() : null)
                .proposalId(contract.getProposal() != null ? contract.getProposal().getId() : null)
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .milestones(milestoneRepository.findByContractIdOrderByCreatedAtAsc(contract.getId()).stream().map(this::milestoneDto).toList())
                .build();
    }

    private MilestoneDto milestoneDto(Milestone milestone) {
        return MilestoneDto.builder()
                .id(milestone.getId())
                .title(milestone.getTitle())
                .description(milestone.getDescription())
                .amount(milestone.getAmount())
                .dueDate(milestone.getDueDate())
                .status(milestone.getStatus())
                .build();
    }

    private TimeEntryDto timeEntryDto(TimeEntry entry) {
        return TimeEntryDto.builder()
                .id(entry.getId())
                .workDate(entry.getWorkDate())
                .hours(entry.getHours())
                .memo(entry.getMemo())
                .status(entry.getStatus())
                .build();
    }

    private ConversationDto conversationDto(Conversation conversation) {
        return ConversationDto.builder()
                .id(conversation.getId())
                .clientId(conversation.getClient().getId())
                .clientName(conversation.getClient().getName())
                .freelancerId(conversation.getFreelancer().getId())
                .freelancerName(conversation.getFreelancer().getName())
                .proposalId(conversation.getProposal() != null ? conversation.getProposal().getId() : null)
                .contractId(conversation.getContract() != null ? conversation.getContract().getId() : null)
                .lastMessageAt(conversation.getLastMessageAt())
                .build();
    }

    private MessageDto messageDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .body(message.getBody())
                .readByRecipient(message.isReadByRecipient())
                .createdAt(message.getCreatedAt())
                .build();
    }

    private ReviewDto reviewDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .contractId(review.getContract().getId())
                .reviewerId(review.getReviewer().getId())
                .reviewerName(review.getReviewer().getName())
                .revieweeId(review.getReviewee().getId())
                .revieweeName(review.getReviewee().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private ServiceListingDto listingDto(ServiceListing listing) {
        return ServiceListingDto.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .category(listing.getCategory())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .deliveryDays(listing.getDeliveryDays())
                .active(listing.isActive())
                .freelancerId(listing.getFreelancer().getId())
                .freelancerName(listing.getFreelancer().getName())
                .createdAt(listing.getCreatedAt())
                .build();
    }
}
