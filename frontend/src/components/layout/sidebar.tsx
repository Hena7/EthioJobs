'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Bookmark,
  User,
  Users,
  ShieldCheck,
  Building2,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

const employerNav = [
  { label: 'Overview', href: '/dashboard/employer', icon: LayoutDashboard },
  { label: 'My Jobs', href: '/dashboard/employer/jobs', icon: Briefcase },
  { label: 'Post New Job', href: '/dashboard/employer/jobs/new', icon: PlusCircle },
  { label: 'Company Profile', href: '/dashboard/employer/profile', icon: Building2 },
];

const seekerNav = [
  { label: 'Overview', href: '/dashboard/seeker', icon: LayoutDashboard },
  { label: 'My Applications', href: '/dashboard/seeker/applications', icon: FileText },
  { label: 'Saved Jobs', href: '/dashboard/seeker/bookmarks', icon: Bookmark },
  { label: 'My Resumes', href: '/dashboard/seeker/resumes', icon: FileText },
  { label: 'My Profile', href: '/dashboard/seeker/profile', icon: User },
];

const adminNav = [
  { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/dashboard/admin/users', icon: Users },
  { label: 'Jobs Moderation', href: '/dashboard/admin/jobs', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  let navItems: { label: string; href: string; icon: typeof LayoutDashboard }[] = [];

  if (user?.role === 'ADMIN') {
    navItems = adminNav;
  } else if (user?.role === 'EMPLOYER') {
    navItems = employerNav;
  } else if (user?.role === 'JOB_SEEKER') {
    navItems = seekerNav;
  }

  const sidebarContent = (
    <div className="flex h-full flex-col gap-1 p-4">
      <div className="flex items-center justify-between mb-4 md:hidden">
        <span className="font-semibold text-sm">Navigation</span>
        <button
          onClick={closeSidebar}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/dashboard/employer' || item.href === '/dashboard/seeker' || item.href === '/dashboard/admin'
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeSidebar}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <div className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              isActive ? "bg-primary/20" : "group-hover:bg-muted-foreground/10"
            )}>
              <Icon className="size-4 shrink-0" />
            </div>
            {item.label}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary" />
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-background">
        {sidebarContent}
      </aside>
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeSidebar}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-60 border-r border-border bg-background md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
