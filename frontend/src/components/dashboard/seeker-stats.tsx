'use client';

import { Send, Clock, UserCheck, Calendar } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export interface SeekerStatsData {
  totalApplications: number;
  underReview: number;
  shortlisted: number;
  interviewsUpcoming: number;
  applicationsTrend?: { value: number; isPositive: boolean };
  reviewTrend?: { value: number; isPositive: boolean };
  shortlistedTrend?: { value: number; isPositive: boolean };
  interviewsTrend?: { value: number; isPositive: boolean };
}

interface SeekerStatsGridProps {
  stats: SeekerStatsData;
  className?: string;
}

export function SeekerStatsGrid({ stats, className }: SeekerStatsGridProps) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Applications Sent"
          value={stats.totalApplications}
          icon={Send}
          color="blue"
          trend={stats.applicationsTrend}
        />
        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={Clock}
          color="yellow"
          trend={stats.reviewTrend}
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={UserCheck}
          color="green"
          trend={stats.shortlistedTrend}
        />
        <StatCard
          title="Upcoming Interviews"
          value={stats.interviewsUpcoming}
          icon={Calendar}
          color="purple"
          trend={stats.interviewsTrend}
        />
      </div>
    </div>
  );
}
