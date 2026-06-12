'use client';

import Link from 'next/link';
import { PlusCircle, Briefcase, Eye, AlertCircle, Building2, FileText, Handshake } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMyJobs } from '@/hooks/useJobs';
import { useMyContracts } from '@/hooks/useMarketplace';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployerDashboardPage() {
  const { user } = useAuthStore();
  const { data: jobs = [], isLoading: jobsLoading, isError: jobsError, refetch } = useMyJobs();
  const { data: contracts = [], isLoading: contractsLoading } = useMyContracts();
  const activeJobs = jobs.filter((job) => job.status === 'ACTIVE').length;
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applicationCount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Employer'}
        </h2>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your job listings.</p>
      </div>

      {jobsLoading || contractsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : jobsError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-8">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">Failed to load dashboard data</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Jobs" value={jobs.length} icon={Briefcase} />
          <StatCard title="Active Jobs" value={activeJobs} icon={Eye} />
          <StatCard title="Applications" value={totalApplications} icon={FileText} />
          <StatCard title="Contracts" value={contracts.length} icon={Handshake} />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/employer/jobs/new">
          <Button>
            <PlusCircle className="size-4" />
            Post New Job
          </Button>
        </Link>
        <Link href="/dashboard/employer/jobs">
          <Button variant="outline">
            <Briefcase className="size-4" />
            View All Jobs
          </Button>
        </Link>
        <Link href="/dashboard/employer/profile">
          <Button variant="outline">
            <Building2 className="size-4" />
            Company Profile
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Briefcase className="size-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No jobs yet</p>
              <p className="text-xs text-muted-foreground">
                Post your first job to start receiving proposals.
              </p>
              <Link href="/dashboard/employer/jobs/new" className="mt-4">
                <Button>
                  <PlusCircle className="size-4" />
                  Post New Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.status} &middot; {job.applicationCount ?? 0} applications &middot; {job.viewCount ?? 0} views
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/employer/jobs/${job.id}/proposals`}>
                      <Button variant="outline" size="sm">Proposals</Button>
                    </Link>
                    <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
