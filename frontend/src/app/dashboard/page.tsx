'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Building2, Handshake, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    switch (user?.role) {
      case 'EMPLOYER':
        router.replace('/dashboard/employer');
        break;
      case 'JOB_SEEKER':
      case 'FREELANCER':
        router.replace('/dashboard/seeker');
        break;
      case 'ADMIN':
        router.replace('/dashboard/admin');
        break;
      default:
        router.replace('/auth/login');
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const isEmployer = user?.role === 'EMPLOYER';
  const basePath = isEmployer ? '/dashboard/employer' : user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/seeker';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Opening your role-specific workspace. You can also jump directly to a section below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href={basePath}>
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-3 p-4">
              <LayoutDashboard className="size-5 text-primary" />
              <span className="font-medium">Overview</span>
            </CardContent>
          </Card>
        </Link>
        {isEmployer ? (
          <>
            <Link href="/dashboard/employer/jobs">
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <Briefcase className="size-5 text-primary" />
                  <span className="font-medium">My Jobs</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/employer/jobs/new">
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <PlusCircle className="size-5 text-primary" />
                  <span className="font-medium">Post New Job</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/employer/profile">
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <Building2 className="size-5 text-primary" />
                  <span className="font-medium">Company Profile</span>
                </CardContent>
              </Card>
            </Link>
          </>
        ) : (
          <Link href="/dashboard/contracts">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-3 p-4">
                <Handshake className="size-5 text-primary" />
                <span className="font-medium">Contracts</span>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      <Button onClick={() => router.replace(basePath)}>
        Go to overview
      </Button>
    </div>
  );
}
