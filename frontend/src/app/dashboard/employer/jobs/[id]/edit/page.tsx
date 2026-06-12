'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Trash2, AlertCircle } from 'lucide-react';
import { jobSchema, type JobFormData } from '@/schemas';
import { useJob, useUpdateJob, useDeleteJob } from '@/hooks/useJobs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';
import {
  CATEGORIES,
  JOB_TYPE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
} from '@/lib/constants';
import { toast } from 'sonner';

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  ACTIVE: 'default',
  EXPIRED: 'secondary',
  DRAFT: 'outline',
};

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: job, isLoading: jobLoading, isError: jobError } = useJob(id);
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob();
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
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

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        requirements: job.requirements ?? '',
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        type: job.type,
        location: job.location,
        category: job.category,
        experienceLevel: job.experienceLevel,
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
      });
    }
  }, [job, reset]);

  const onSubmit = (formData: JobFormData) => {
    updateJob(
      { id, ...formData },
      {
        onSuccess: () => {
          toast.success('Job updated successfully');
          router.push('/dashboard/employer/jobs');
        },
        onError: () => {
          toast.error('Failed to update job');
        },
      },
    );
  };

  const handleDelete = () => {
    deleteJob(id, {
      onSuccess: () => {
        toast.success('Job deleted');
        setDeleteOpen(false);
        router.push('/dashboard/employer/jobs');
      },
      onError: () => {
        toast.error('Failed to delete job');
      },
    });
  };

  if (jobLoading) {
    return <DetailSkeleton />;
  }

  if (jobError || !job) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Failed to load job details</p>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Edit Job</h2>
            <Badge variant={statusBadgeVariant[job.status]}>{job.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{job.title}</p>
        </div>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger className={buttonVariants({ variant: 'destructive', size: 'sm' })}>
            <Trash2 className="size-4" />
            Delete Job
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Job</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this job? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Update the information for this position.
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
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? <Loader2 className="size-4 animate-spin" /> : null}
            Update Job
          </Button>
        </div>
      </form>
    </div>
  );
}
