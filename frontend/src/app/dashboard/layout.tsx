'use client';

import type { ReactNode } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';

import { ClientOnly } from '@/components/shared/client-only';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ClientOnly>
      <Header />
      <DashboardLayout>{children}</DashboardLayout>
      <Footer />
    </ClientOnly>
  );
}
