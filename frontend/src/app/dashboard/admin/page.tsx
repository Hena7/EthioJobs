'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { AdminStatsGrid } from '@/components/dashboard/admin-stats';
import { DashboardStatsSkeleton } from '@/components/shared/loading-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDate, getInitials } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { User, Job } from '@/types';

const lineData = [
  { month: 'Jan', users: 400 },
  { month: 'Feb', users: 600 },
  { month: 'Mar', users: 800 },
  { month: 'Apr', users: 1200 },
  { month: 'May', users: 1500 },
  { month: 'Jun', users: 1900 },
];

const pieData = [
  { name: 'Software Eng', value: 35 },
  { name: 'Marketing', value: 20 },
  { name: 'Sales', value: 15 },
  { name: 'Finance', value: 12 },
  { name: 'Design', value: 10 },
  { name: 'Other', value: 8 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

const barData = [
  { month: 'Jan', apps: 120 },
  { month: 'Feb', apps: 200 },
  { month: 'Mar', apps: 320 },
  { month: 'Apr', apps: 450 },
  { month: 'May', apps: 380 },
  { month: 'Jun', apps: 520 },
];

async function fetchAdminStats() {
  const { data } = await axiosInstance.get<{
    data: {
      totalUsers: number;
      totalJobs: number;
      totalApplications: number;
      companiesRegistered: number;
    };
  }>('/api/admin/stats');
  return data.data;
}

async function fetchRecentUsers(): Promise<User[]> {
  const { data } = await axiosInstance.get<{ data: User[] }>('/api/admin/users?limit=5');
  return data.data;
}

async function fetchRecentJobs(): Promise<Job[]> {
  const { data } = await axiosInstance.get<{ data: Job[] }>('/api/admin/jobs?limit=5');
  return data.data;
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchAdminStats });

  const {
    data: recentUsers,
    isLoading: usersLoading,
  } = useQuery({ queryKey: ['admin-recent-users'], queryFn: fetchRecentUsers });

  const {
    data: recentJobs,
    isLoading: jobsLoading,
  } = useQuery({ queryKey: ['admin-recent-jobs'], queryFn: fetchRecentJobs });

  const isLoading = statsLoading || usersLoading || jobsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <DashboardStatsSkeleton />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load dashboard</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name ?? 'Admin'}!
          </h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of the platform.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-1.5 size-3.5" />
          Refresh
        </Button>
      </div>

      <AdminStatsGrid
        stats={{
          totalUsers: stats?.totalUsers ?? 0,
          totalJobs: stats?.totalJobs ?? 0,
          totalApplications: stats?.totalApplications ?? 0,
          companiesRegistered: stats?.companiesRegistered ?? 0,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Jobs by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) =>
                      `${entry.name ?? ''} ${((entry.percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="apps" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Users</CardTitle>
            <Link
              href="/dashboard/admin/users"
              className={buttonVariants({ variant: 'outline', size: 'xs' })}
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {!recentUsers || recentUsers.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Users className="mb-3 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No users yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {getInitials(u.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge
                      variant={
                        u.role === 'ADMIN'
                          ? 'default'
                          : u.role === 'EMPLOYER'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="shrink-0 text-[10px]"
                    >
                      {u.role.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Jobs</CardTitle>
          <Link
            href="/dashboard/admin/jobs"
            className={buttonVariants({ variant: 'outline', size: 'xs' })}
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {!recentJobs || recentJobs.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Briefcase className="mb-3 size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No jobs posted yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.companyName} &middot; {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <Badge
                      variant={
                        job.status === 'ACTIVE'
                          ? 'default'
                          : job.status === 'EXPIRED'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="shrink-0 text-[10px]"
                    >
                      {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                    </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
