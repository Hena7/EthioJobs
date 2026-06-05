'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, AlertCircle, Briefcase } from 'lucide-react';
import { useJob } from '@/hooks/useJobs';
import { useJobApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { ApplicantRow } from '@/components/dashboard/applicant-row';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TableSkeleton, DetailSkeleton } from '@/components/shared/loading-skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


const APPLICATION_FILTERS = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Reviewed', value: 'REVIEWED' },
  { label: 'Shortlisted', value: 'SHORTLISTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Hired', value: 'HIRED' },
] as const;

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  ACTIVE: 'default',
  EXPIRED: 'secondary',
  DRAFT: 'outline',
};

export default function JobApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: job, isLoading: jobLoading, isError: jobError } = useJob(id);
  const {
    data: applications = [],
    isLoading: appsLoading,
    isError: appsError,
  } = useJobApplications(id);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();

  const handleStatusChange = (applicationId: string, status: string) => {
    updateStatus({ id: applicationId, status });
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  if (jobLoading) {
    return <DetailSkeleton />;
  }

  if (jobError || !job) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Failed to load job</p>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/employer/jobs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Applicants</h2>
          <p className="text-sm text-muted-foreground">{job.title}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Briefcase className="size-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">{job.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={statusBadgeVariant[job.status]}>{job.status}</Badge>
                  <span className="text-xs text-muted-foreground">
                    <Users className="inline size-3.5 mr-1" />
                    {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap">
          {APPLICATION_FILTERS.map((filter) => (
            <TabsTrigger key={filter.value} value={filter.value}>
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={statusFilter}>
          <Card>
            <CardContent className="p-0">
              {appsLoading ? (
                <div className="p-4">
                  <TableSkeleton rows={4} />
                </div>
              ) : appsError ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <AlertCircle className="size-8 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    Failed to load applications
                  </p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Users className="size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">No applications yet</p>
                  <p className="text-xs text-muted-foreground">
                    {statusFilter === 'ALL'
                      ? 'Candidates haven\'t applied to this job yet.'
                      : `No applications with status "${statusFilter.toLowerCase()}".`}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredApplications.map((app) => (
                    <ApplicantRow
                      key={app.id}
                      application={app}
                      onStatusChange={handleStatusChange}
                      isUpdating={isUpdating}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
