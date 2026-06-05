'use client';

import { Users, Briefcase, FileText, Building2 } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export interface AdminStatsData {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  companiesRegistered: number;
  usersTrend?: { value: number; isPositive: boolean };
  jobsTrend?: { value: number; isPositive: boolean };
  applicationsTrend?: { value: number; isPositive: boolean };
  companiesTrend?: { value: number; isPositive: boolean };
}

interface AdminStatsGridProps {
  stats: AdminStatsData;
  className?: string;
}

export function AdminStatsGrid({ stats, className }: AdminStatsGridProps) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          trend={stats.usersTrend}
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          color="green"
          trend={stats.jobsTrend}
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={FileText}
          color="purple"
          trend={stats.applicationsTrend}
        />
        <StatCard
          title="Companies"
          value={stats.companiesRegistered}
          icon={Building2}
          color="indigo"
          trend={stats.companiesTrend}
        />
      </div>
    </div>
  );
}
