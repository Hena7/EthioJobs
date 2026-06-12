'use client';

import { useAuthStore } from '@/store/authStore';
import { useMyApplications } from '@/hooks/useApplications';
import { SeekerStatsGrid } from '@/components/dashboard/seeker-stats';
import { ApplicationCard } from '@/components/dashboard/application-card';
import { DashboardStatsSkeleton } from '@/components/shared/loading-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Briefcase, FileText, Bookmark, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  {
    label: 'Browse Jobs',
    href: '/jobs',
    icon: Briefcase,
    description: 'Find your next opportunity',
  },
  {
    label: 'My Applications',
    href: '/dashboard/seeker/applications',
    icon: FileText,
    description: 'Track your applications',
  },
  {
    label: 'Saved Jobs',
    href: '/dashboard/seeker/bookmarks',
    icon: Bookmark,
    description: 'View your bookmarked jobs',
  },
];

const freelancerQuickLinks = [
  {
    label: 'Find Work',
    href: '/jobs',
    icon: Briefcase,
    description: 'Browse freelance jobs',
  },
  {
    label: 'My Proposals',
    href: '/dashboard/seeker/proposals',
    icon: FileText,
    description: 'Track your proposals',
  },
  {
    label: 'My Contracts',
    href: '/dashboard/contracts',
    icon: Bookmark,
    description: 'Manage active contracts',
  },
];

export default function SeekerDashboardPage() {
  const { user } = useAuthStore();
  const { data: applications, isLoading, error } = useMyApplications();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <DashboardStatsSkeleton />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load dashboard</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Something went wrong loading your data. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const stats = {
    totalApplications: applications?.length ?? 0,
    underReview: applications?.filter((a) => a.status === 'REVIEWED').length ?? 0,
    shortlisted: applications?.filter((a) => a.status === 'SHORTLISTED').length ?? 0,
    interviewsUpcoming: applications?.filter((a) => a.status === 'HIRED').length ?? 0,
  };

  const recentApplications = applications?.slice(0, 5) ?? [];
  const profileIncomplete = !user?.name;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name ?? 'there'}!
        </h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your job search.
        </p>
      </div>

      {profileIncomplete && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300">
          <AlertTriangle className="size-5 shrink-0" />
          <p className="flex-1">
            Your profile is incomplete. Add your skills and experience to stand out to employers.
          </p>
          <Link href="/dashboard/seeker/profile" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Complete Profile
          </Link>
        </div>
      )}

      <SeekerStatsGrid stats={stats} />

      <div className="grid gap-4 md:grid-cols-3">
        {(user?.role === 'FREELANCER' ? freelancerQuickLinks : quickLinks).map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{link.label}</CardTitle>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Applications</CardTitle>
          {applications && applications.length > 0 && (
            <Link href="/dashboard/seeker/applications" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {recentApplications.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Briefcase className="mb-3 size-10 text-muted-foreground" />
              <p className="mb-1 text-sm font-medium">No applications yet</p>
              <p className="mb-4 text-xs text-muted-foreground">
                Start applying to jobs to see your applications here.
              </p>
              <Link href="/jobs" className={buttonVariants({ variant: "default", size: "sm" })}>
                Browse Jobs
              </Link>
            </div>
          ) : (
            recentApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
