'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useJob, useJobs } from '@/hooks/useJobs';
import { useMyBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { useSubmitProposal } from '@/hooks/useMarketplace';
import { JobDetailHeader } from '@/components/jobs/job-detail-header';
import { JobDetailContent } from '@/components/jobs/job-detail-content';
import { JobCard } from '@/components/jobs/job-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';

const applySchema = z.object({
  coverLetter: z
    .string()
    .min(10, 'Cover letter must be at least 10 characters'),
  bidAmount: z.coerce.number().positive('Bid amount must be positive').optional(),
  estimatedDuration: z.string().optional(),
});

type ApplyFormData = z.infer<typeof applySchema>;

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: job, isLoading, isError } = useJob(params.id);
  const { data: bookmarks } = useMyBookmarks();
  const toggleBookmark = useToggleBookmark();
  const submitProposal = useSubmitProposal();

  const [applyOpen, setApplyOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema) as never,
  });

  const { data: similarJobsData } = useJobs(
    job ? { category: job.category, page: 0 } : {},
  );
  const similarJobs = (similarJobsData?.content ?? [])
    .filter((j) => j.id !== job?.id)
    .slice(0, 3);

  const isBookmarked =
    bookmarks?.some((b) => b.job.id === params.id) ?? false;

  const handleBookmark = () => {
    toggleBookmark.mutate(params.id);
  };

  const onSubmitApply = async (formData: ApplyFormData) => {
    try {
      await submitProposal.mutateAsync({ jobId: params.id, ...formData });
      toast.success('Proposal submitted successfully!');
      setApplyOpen(false);
      reset();
    } catch {
      toast.error('Failed to submit proposal. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Briefcase className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">Job not found</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            The job you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to jobs
      </Link>

      <JobDetailHeader
        job={job}
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
        className="mb-6"
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <JobDetailContent job={job} />
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Job Summary
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium">{job.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">
                    {job.type.replace('_', ' ')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Experience</dt>
                  <dd className="font-medium">{job.experienceLevel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="font-medium">{job.location}</dd>
                </div>
                {(job.salaryMin != null || job.salaryMax != null) && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Salary</dt>
                    <dd className="font-medium">
                      {job.salaryMin != null
                        ? `$${(job.salaryMin / 1000).toFixed(0)}k`
                        : ''}
                      {job.salaryMin != null && job.salaryMax != null
                        ? ' - '
                        : ''}
                      {job.salaryMax != null
                        ? `$${(job.salaryMax / 1000).toFixed(0)}k`
                        : ''}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Posted</dt>
                  <dd className="font-medium">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => setApplyOpen(true)}
            >
              Submit Proposal
            </Button>
          </div>
        </aside>
      </div>

      {similarJobs.length > 0 && (
        <section className="mt-12 border-t pt-8">
          <h2 className="mb-6 text-xl font-bold">Similar Jobs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similarJobs.map((sj) => (
              <JobCard key={sj.id} job={sj} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit proposal for {job.title}</DialogTitle>
            <DialogDescription>
              Send your bid and timeline to {job.companyName}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitApply)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Write a brief cover letter explaining why you're a great fit..."
                className="min-h-[160px]"
                {...register('coverLetter')}
              />
              {errors.coverLetter && (
                <p className="text-sm text-destructive">
                  {errors.coverLetter.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bidAmount">Bid Amount</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  placeholder="e.g. 750"
                  {...register('bidAmount')}
                />
                {errors.bidAmount && (
                  <p className="text-sm text-destructive">
                    {errors.bidAmount.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Input
                  id="estimatedDuration"
                  placeholder="e.g. 2 weeks"
                  {...register('estimatedDuration')}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setApplyOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
