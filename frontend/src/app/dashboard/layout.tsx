'use client';

import type { ReactNode } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';

import { ClientOnly } from '@/components/shared/client-only';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ClientOnly>
      <DashboardLayout>{children}</DashboardLayout>
    </ClientOnly>
  );
}
