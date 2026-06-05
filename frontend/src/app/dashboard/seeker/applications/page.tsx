'use client';

import { useState } from 'react';
import { useMyApplications } from '@/hooks/useApplications';
import { ApplicationCard } from '@/components/dashboard/application-card';
import { DashboardStatsSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, AlertTriangle, Send } from 'lucide-react';
import Link from 'next/link';
import { ApplicationStatus } from '@/types';

const statusTabs: { label: string; value: ApplicationStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: ApplicationStatus.PENDING },
  { label: 'Reviewed', value: ApplicationStatus.REVIEWED },
  { label: 'Shortlisted', value: ApplicationStatus.SHORTLISTED },
  { label: 'Rejected', value: ApplicationStatus.REJECTED },
  { label: 'Hired', value: ApplicationStatus.HIRED },
];

export default function MyApplicationsPage() {
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'ALL'>('ALL');
  const { data: applications, isLoading, error, refetch } = useMyApplications();

  const filtered =
    activeTab === 'ALL'
      ? applications
      : applications?.filter((a) => a.status === activeTab);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load applications</h3>
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
        <h2 className="text-2xl font-bold tracking-tight">My Applications</h2>
        <p className="text-sm text-muted-foreground">
          Track and manage your job applications.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.value !== 'ALL' && applications && (
              <span className="ml-1.5 text-xs opacity-70">
                ({applications.filter((a) => a.status === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {!applications || applications.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No applications yet"
          description="Start applying to jobs to track your applications here."
          actionLabel="Browse Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : filtered && filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={`No ${activeTab.toLowerCase()} applications`}
          description={`You don't have any ${activeTab.toLowerCase()} applications at the moment.`}
          actionLabel="View All Applications"
          onAction={() => setActiveTab('ALL')}
        />
      ) : (
        <div className="space-y-4">
          {filtered?.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
