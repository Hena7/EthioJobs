export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  REMOTE = 'REMOTE',
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  DRAFT = 'DRAFT',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
}

export enum ProposalStatus {
  SUBMITTED = 'SUBMITTED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEWING = 'INTERVIEWING',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum ContractType {
  FIXED_PRICE = 'FIXED_PRICE',
  HOURLY = 'HOURLY',
}

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MilestoneStatus {
  DRAFT = 'DRAFT',
  FUNDED = 'FUNDED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  RELEASED = 'RELEASED',
}

export enum TimeEntryStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER' | 'FREELANCER';
  isVerified: boolean;
  isActive: boolean;
  profilePicture?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  salaryMin?: number;
  salaryMax?: number;
  fixedBudget?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  requiredSkills?: string;
  projectLength?: string;
  hourlyProject: boolean;
  type: JobType;
  location: string;
  category: string;
  experienceLevel: ExperienceLevel;
  deadline: string;
  status: JobStatus;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  companyLogo?: string;
  companyId: string;
  applicationCount: number;
}

export interface Application {
  id: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: string;
  job: Job;
  user: User;
  resume?: Resume;
}

export interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Bookmark {
  id: string;
  createdAt: string;
  job: Job;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  isVerified: boolean;
  jobCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface JobSeekerProfile {
  bio?: string;
  skills?: string;
  headline?: string;
  hourlyRate?: number;
  categories?: string;
  portfolioLinks?: string;
  availability?: string;
  ratingAverage?: number;
  completedJobs?: number;
  location?: string;
  experienceLevel?: ExperienceLevel;
  expectedSalary?: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface JobFilters {
  search?: string;
  category?: string;
  location?: string;
  type?: JobType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  sort?: string;
  page?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'EMPLOYER' | 'JOB_SEEKER' | 'FREELANCER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Proposal {
  id: string;
  jobId: string;
  jobTitle: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  bidAmount?: number;
  estimatedDuration?: string;
  attachments?: string;
  status: ProposalStatus;
  submittedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  status: MilestoneStatus;
}

export interface MarketplaceContract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  budget?: number;
  hourlyRate?: number;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  jobId?: string;
  proposalId?: string;
  startDate?: string;
  endDate?: string;
  milestones: Milestone[];
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  proposalId?: string;
  contractId?: string;
  lastMessageAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  body: string;
  readByRecipient: boolean;
  createdAt: string;
}

export interface ServiceListing {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  deliveryDays?: number;
  active: boolean;
  freelancerId: string;
  freelancerName: string;
  createdAt: string;
}
