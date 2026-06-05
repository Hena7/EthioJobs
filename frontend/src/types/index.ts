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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER';
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
  role: 'EMPLOYER' | 'JOB_SEEKER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
