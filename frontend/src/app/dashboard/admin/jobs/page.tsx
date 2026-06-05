'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useFeaturedJob } from '@/hooks/useJobs';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { toast } from 'sonner';
import {
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle,
  XCircle,
  Star,
  StarOff,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { JobStatus, type Job } from '@/types';

const statusFilters: { label: string; value: JobStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: JobStatus.ACTIVE },
  { label: 'Expired', value: JobStatus.EXPIRED },
  { label: 'Draft', value: JobStatus.DRAFT },
];

async function fetchAdminJobs(): Promise<Job[]> {
  const { data } = await axiosInstance.get<{ data: Job[] }>('/api/admin/jobs');
  return data.data;
}

export default function JobModerationPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<JobStatus | 'ALL'>('ALL');

  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: fetchAdminJobs,
  });

  const featuredJob = useFeaturedJob();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) =>
      axiosInstance.patch(`/api/jobs/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Job status updated');
    },
    onError: () => {
      toast.error('Failed to update job status');
    },
  });

  const filtered = useMemo(() => {
    if (!jobs) return [];
    if (filter === 'ALL') return jobs;
    return jobs.filter((j) => j.status === filter);
  }, [jobs, filter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Moderation</h2>
          <p className="text-sm text-muted-foreground">
            Review and manage all job listings.
          </p>
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load jobs</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Job Moderation</h2>
        <p className="text-sm text-muted-foreground">
          Review and manage all job listings.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setFilter(s.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === s.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {s.label}
            {s.value !== 'ALL' && jobs && (
              <span className="ml-1.5 text-xs opacity-70">
                ({jobs.filter((j) => j.status === s.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {!jobs || jobs.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No jobs found"
          description="There are no job listings on the platform yet."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={`No ${filter.toLowerCase()} jobs`}
          description={`There are no ${filter.toLowerCase()} jobs to review.`}
          actionLabel="View All Jobs"
          onAction={() => setFilter('ALL')}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => {
                const isFeaturedPending = featuredJob.isPending;
                const isStatusPending = updateStatusMutation.isPending;
                return (
                  <TableRow key={job.id}>
                    <TableCell>
                      <p className="truncate text-sm font-medium max-w-[200px]">
                        {job.title}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {job.companyName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(job.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === JobStatus.ACTIVE
                            ? 'default'
                            : job.status === JobStatus.EXPIRED
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.isFeatured ? (
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <StarOff className="size-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {job.status !== JobStatus.ACTIVE && (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: job.id,
                                status: JobStatus.ACTIVE,
                              })
                            }
                            disabled={isStatusPending}
                          >
                            {isStatusPending ? (
                              <Loader2 className="mr-1 size-3 animate-spin" />
                            ) : (
                              <CheckCircle className="mr-1 size-3" />
                            )}
                            Approve
                          </Button>
                        )}
                        {job.status !== JobStatus.EXPIRED && (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: job.id,
                                status: JobStatus.EXPIRED,
                              })
                            }
                            disabled={isStatusPending}
                          >
                            {isStatusPending ? (
                              <Loader2 className="mr-1 size-3 animate-spin" />
                            ) : (
                              <XCircle className="mr-1 size-3" />
                            )}
                            Reject
                          </Button>
                        )}
                        <Button
                          variant={job.isFeatured ? 'default' : 'outline'}
                          size="xs"
                          onClick={() => featuredJob.mutate(job.id)}
                          disabled={isFeaturedPending}
                        >
                          {isFeaturedPending ? (
                            <Loader2 className="mr-1 size-3 animate-spin" />
                          ) : job.isFeatured ? (
                            <StarOff className="mr-1 size-3" />
                          ) : (
                            <Star className="mr-1 size-3" />
                          )}
                          {job.isFeatured ? 'Unfeature' : 'Feature'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {jobs?.length ?? 0} job{jobs?.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
