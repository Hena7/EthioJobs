'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Edit, Eye, ArchiveRestore, Briefcase, AlertCircle } from 'lucide-react';
import { useMyJobs, useUpdateJob } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Job } from '@/types';

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  ACTIVE: 'default',
  EXPIRED: 'secondary',
  DRAFT: 'outline',
};

export default function MyJobsPage() {
  const [tab, setTab] = useState('ACTIVE');
  const { data: jobs = [], isLoading, isError, refetch } = useMyJobs();
  const { mutate: updateJob } = useUpdateJob();

  const filteredJobs = jobs.filter((job) => {
    if (tab === 'ALL') return true;
    return job.status === tab;
  });

  const toggleStatus = (job: Job) => {
    const newStatus = job.status === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE';
    updateJob(
      { id: job.id, status: newStatus } as Parameters<typeof updateJob>[0],
      {
        onSuccess: () => {
          toast.success(`Job ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
        },
        onError: () => {
          toast.error('Failed to update job status');
        },
      },
    );
  };

  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Failed to load jobs</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Jobs</h2>
          <p className="text-sm text-muted-foreground">Manage your job listings</p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button>
            <PlusCircle className="size-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet"
              description="Post your first job to start receiving applications from qualified candidates."
              actionLabel="Post Your First Job"
              onAction={() => window.location.href = '/dashboard/employer/jobs/new'}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="EXPIRED">Expired</TabsTrigger>
            <TabsTrigger value="DRAFT">Draft</TabsTrigger>
          </TabsList>
          <TabsContent value={tab}>
            <Card>
              <CardContent className="p-0">
                {filteredJobs.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No {tab.toLowerCase()} jobs
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>
                            <Badge variant={statusBadgeVariant[job.status]}>
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{job.applicationCount}</TableCell>
                          <TableCell>{job.viewCount}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(job.createdAt)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(job.deadline)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                                <Button variant="ghost" size="icon-xs">
                                  <Edit className="size-3.5" />
                                </Button>
                              </Link>
                              <Link href={`/dashboard/employer/jobs/${job.id}/applicants`}>
                                <Button variant="ghost" size="icon-xs">
                                  <Eye className="size-3.5" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => toggleStatus(job)}
                              >
                                <ArchiveRestore className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
