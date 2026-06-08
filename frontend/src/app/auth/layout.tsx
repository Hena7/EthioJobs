'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-muted/30 px-4 py-12">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Link href="/" className="mb-8 flex items-center gap-2.5 group">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-500 text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Briefcase className="size-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Ethio<span className="text-primary">Jobs</span></span>
        </Link>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
