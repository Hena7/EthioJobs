export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const JOB_TYPE_OPTIONS = [
  { label: 'Full Time', value: 'FULL_TIME' },
  { label: 'Part Time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Internship', value: 'INTERNSHIP' },
  { label: 'Remote', value: 'REMOTE' },
] as const;

export const EXPERIENCE_LEVEL_OPTIONS = [
  { label: 'Entry Level', value: 'ENTRY' },
  { label: 'Junior', value: 'JUNIOR' },
  { label: 'Mid Level', value: 'MID' },
  { label: 'Senior', value: 'SENIOR' },
  { label: 'Lead', value: 'LEAD' },
] as const;

export const JOB_STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Draft', value: 'DRAFT' },
] as const;

export const APPLICATION_STATUS_OPTIONS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Reviewed', value: 'REVIEWED' },
  { label: 'Shortlisted', value: 'SHORTLISTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Hired', value: 'HIRED' },
] as const;

export const CATEGORIES = [
  'Software Engineering',
  'Product Management',
  'Data Science',
  'UX Design',
  'Marketing',
  'Sales',
  'Finance',
  'Human Resources',
  'Operations',
] as const;

export const LOCATIONS = [
  'Addis Ababa',
  'Adama',
  'Bahir Dar',
  'Dire Dawa',
  'Mekelle',
  'Hawassa',
  'Gondar',
  'Jimma',
  'Remote',
] as const;

export const SALARY_RANGE_OPTIONS = [
  { label: 'Under $10k', value: '0-10000' },
  { label: '$10k - $20k', value: '10000-20000' },
  { label: '$20k - $30k', value: '20000-30000' },
  { label: '$30k - $50k', value: '30000-50000' },
  { label: '$50k - $80k', value: '50000-80000' },
  { label: '$80k - $120k', value: '80000-120000' },
  { label: '$120k+', value: '120000-999999' },
] as const;

export const COMPANY_SIZE_OPTIONS = [
  { label: '1-10 employees', value: '1-10' },
  { label: '11-50 employees', value: '11-50' },
  { label: '51-200 employees', value: '51-200' },
  { label: '201-500 employees', value: '201-500' },
  { label: '501-1000 employees', value: '501-1000' },
  { label: '1000+ employees', value: '1000+' },
] as const;

export const INDUSTRY_OPTIONS = [
  { label: 'Technology & Software', value: 'technology' },
  { label: 'Banking & Finance', value: 'banking-finance' },
  { label: 'Healthcare & Pharmaceuticals', value: 'healthcare' },
  { label: 'Education & Training', value: 'education' },
  { label: 'Agriculture & Agribusiness', value: 'agriculture' },
  { label: 'Manufacturing & Production', value: 'manufacturing' },
  { label: 'Construction & Real Estate', value: 'construction' },
  { label: 'Hospitality & Tourism', value: 'hospitality' },
  { label: 'Telecommunications', value: 'telecommunications' },
  { label: 'Transportation & Logistics', value: 'transportation' },
  { label: 'Retail & E-commerce', value: 'retail' },
  { label: 'Energy & Mining', value: 'energy-mining' },
  { label: 'Media & Communications', value: 'media' },
  { label: 'Nonprofit & NGO', value: 'nonprofit' },
  { label: 'Government & Public Sector', value: 'government' },
] as const;
