'use client';

import { Briefcase, FileText, Eye, UserCheck } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export interface EmployerStatsData {
  activeJobs: number;
  totalApplications: number;
  totalViews: number;
  shortlistedCandidates: number;
  activeJobsTrend?: { value: number; isPositive: boolean };
  applicationsTrend?: { value: number; isPositive: boolean };
  viewsTrend?: { value: number; isPositive: boolean };
  shortlistedTrend?: { value: number; isPositive: boolean };
}

interface EmployerStatsGridProps {
  stats: EmployerStatsData;
  className?: string;
}

export function EmployerStatsGrid({ stats, className }: EmployerStatsGridProps) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          color="blue"
          trend={stats.activeJobsTrend}
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          icon={FileText}
          color="green"
          trend={stats.applicationsTrend}
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={Eye}
          color="purple"
          trend={stats.viewsTrend}
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlistedCandidates}
          icon={UserCheck}
          color="indigo"
          trend={stats.shortlistedTrend}
        />
      </div>
    </div>
  );
}
