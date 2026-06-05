'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { PlusCircle, Briefcase, Eye, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';
import { EmployerStatsGrid, type EmployerStatsData } from '@/components/dashboard/employer-stats';
import { ApplicantRow } from '@/components/dashboard/applicant-row';
import { DashboardStatsSkeleton, TableSkeleton } from '@/components/shared/loading-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUpdateApplicationStatus } from '@/hooks/useApplications';
import type { Application } from '@/types';

function useEmployerStats() {
  return useQuery<EmployerStatsData>({
    queryKey: ['employer-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: EmployerStatsData }>('/api/employer/stats');
      return data.data;
    },
  });
}

function useRecentApplications() {
  return useQuery<Application[]>({
    queryKey: ['employer-recent-applications'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: Application[] }>('/api/employer/applications/recent');
      return data.data;
    },
  });
}

export default function EmployerDashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useEmployerStats();
  const { data: applications = [], isLoading: appsLoading, isError: appsError } = useRecentApplications();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();

  const handleStatusChange = (id: string, status: string) => {
    updateStatus({ id, status });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Employer'}
        </h2>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your job listings.</p>
      </div>

      {statsLoading ? (
        <DashboardStatsSkeleton />
      ) : statsError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-8">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">Failed to load stats</p>
            <Button variant="outline" size="sm" onClick={() => refetchStats()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : stats ? (
        <EmployerStatsGrid stats={stats} />
      ) : null}

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {appsLoading ? (
            <div className="p-4">
              <TableSkeleton rows={3} />
            </div>
          ) : appsError ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <AlertCircle className="size-8 text-destructive" />
              <p className="text-sm text-muted-foreground">Failed to load recent applications</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Eye className="size-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No applications yet</p>
              <p className="text-xs text-muted-foreground">
                When candidates apply, they&apos;ll appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {applications.slice(0, 5).map((app) => (
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
    </div>
  );
}
