import { z } from 'zod';
import { JobType, ExperienceLevel } from '@/types';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  role: z.enum(['EMPLOYER', 'JOB_SEEKER', 'FREELANCER']),
});

const jobSchemaBase = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  salaryMin: z.number().positive('Salary must be positive').optional(),
  salaryMax: z.number().positive('Salary must be positive').optional(),
  fixedBudget: z.coerce.number().positive('Budget must be positive').optional(),
  hourlyRateMin: z.coerce.number().positive('Rate must be positive').optional(),
  hourlyRateMax: z.coerce.number().positive('Rate must be positive').optional(),
  requiredSkills: z.string().optional(),
  projectLength: z.string().optional(),
  hourlyProject: z.boolean().optional(),
  type: z.nativeEnum(JobType),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  deadline: z
    .string()
    .refine((val) => new Date(val) > new Date(), 'Deadline must be a future date'),
});

export const jobSchema = jobSchemaBase;

export const applicationSchema = z.object({
  coverLetter: z.string().max(2000, 'Cover letter must be at most 2000 characters').optional(),
});

export const profileSchema = z.object({
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  skills: z.string().optional(),
  headline: z.string().max(120, 'Headline must be at most 120 characters').optional(),
  hourlyRate: z.coerce.number().positive('Hourly rate must be positive').optional(),
  categories: z.string().optional(),
  portfolioLinks: z.string().optional(),
  availability: z.string().optional(),
  location: z.string().optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
  expectedSalary: z.coerce.number().positive('Salary must be positive').optional(),
});

export const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  logo: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type JobFormData = z.infer<typeof jobSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type CompanyFormData = z.infer<typeof companySchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
