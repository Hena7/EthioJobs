'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    switch (user?.role) {
      case 'EMPLOYER':
        router.replace('/dashboard/employer');
        break;
      case 'JOB_SEEKER':
        router.replace('/dashboard/seeker');
        break;
      case 'ADMIN':
        router.replace('/dashboard/admin');
        break;
      default:
        router.replace('/login');
    }
  }, [user, isAuthenticated, router]);

  return null;
}
