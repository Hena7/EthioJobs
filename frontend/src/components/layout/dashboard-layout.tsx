'use client';

import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import Sidebar from './sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { toggleSidebar } = useUIStore();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-16 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="text-base font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
