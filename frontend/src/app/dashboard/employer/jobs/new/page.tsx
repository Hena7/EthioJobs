'use client';

import { ClientOnly } from '@/components/shared/client-only';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertTriangle, Building2 } from 'lucide-react';
import { jobSchema, type JobFormData } from '@/schemas';
import { JobStatus } from '@/types';
import { useCreateJob } from '@/hooks/useJobs';
import { useMyCompany } from '@/hooks/useCompanies';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  CATEGORIES,
  JOB_TYPE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
} from '@/lib/constants';
import { toast } from 'sonner';

function isProfileComplete(company: { name?: string | null; description?: string | null; industry?: string | null; location?: string | null } | null | undefined): boolean {
  return !!(company?.name && company?.description && company?.industry && company?.location);
}

export default function PostNewJobPage() {
  const router = useRouter();
  const { mutate: createJob, isPending } = useCreateJob();
  const { data: company, isLoading: companyLoading } = useMyCompany();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema) as never,
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      salaryMin: undefined,
      salaryMax: undefined,
      type: undefined as unknown as JobFormData['type'],
      location: '',
      category: '',
      experienceLevel: undefined as unknown as JobFormData['experienceLevel'],
      deadline: '',
    },
  });

  const onSubmit = (formData: JobFormData, status?: JobStatus) => {
    createJob(
      { ...formData, status: status ?? JobStatus.ACTIVE },
      {
        onSuccess: () => {
          toast.success(status === JobStatus.DRAFT ? 'Job saved as draft' : 'Job posted successfully');
          router.push('/dashboard/employer/jobs');
        },
        onError: () => {
          toast.error('Failed to post job');
        },
      },
    );
  };

  return (
    <ClientOnly>
      {companyLoading ? (
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : !isProfileComplete(company) ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Building2 className="size-10" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight">Complete your company profile first</h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Before you can post jobs, you need to fill in your{' '}
            <strong>Company Name</strong>, <strong>Description</strong>, <strong>Industry</strong>, and{' '}
            <strong>Location</strong>. This helps job seekers find and trust your listings.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/dashboard/employer/profile"
              className={buttonVariants({ size: 'lg' })}
            >
              <Building2 className="mr-2 size-4" />
              Set Up Company Profile
            </Link>
          </div>
        </div>
      ) : (
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Post New Job</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new job listing.
          </p>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide the basic information about the position.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  {...register('title')}
                  placeholder="e.g. Senior Software Engineer"
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  {...register('description')}
                  placeholder="Describe the role, responsibilities, and your company..."
                  rows={5}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Requirements (optional)</Label>
                <Textarea
                  {...register('requirements')}
                  placeholder="List the required qualifications and skills..."
                  rows={4}
                />
                {errors.requirements && (
                  <p className="text-xs text-destructive">{errors.requirements.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum Salary (optional)</Label>
                  <Input
                    {...register('salaryMin')}
                    type="number"
                    placeholder="e.g. 50000"
                  />
                  {errors.salaryMin && (
                    <p className="text-xs text-destructive">{errors.salaryMin.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Maximum Salary (optional)</Label>
                  <Input
                    {...register('salaryMax')}
                    type="number"
                    placeholder="e.g. 120000"
                  />
                  {errors.salaryMax && (
                    <p className="text-xs text-destructive">{errors.salaryMax.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          {JOB_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <p className="text-xs text-destructive">{errors.type.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Controller
                    control={control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.experienceLevel && (
                    <p className="text-xs text-destructive">
                      {errors.experienceLevel.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-xs text-destructive">{errors.category.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    {...register('location')}
                    placeholder="e.g. Addis Ababa"
                  />
                  {errors.location && (
                    <p className="text-xs text-destructive">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Input
                  {...register('deadline')}
                  type="date"
                />
                {errors.deadline && (
                  <p className="text-xs text-destructive">{errors.deadline.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Link href="/dashboard/employer/jobs" className={buttonVariants({ variant: 'outline' })}>
              Cancel
            </Link>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                onClick={handleSubmit((data) => onSubmit(data, JobStatus.DRAFT))}
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Save as Draft
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Post Job
              </Button>
            </div>
          </div>
        </form>
      </div>
      )}
    </ClientOnly>
  );
}
