'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/6.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-0" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        <Link href="/" className="mb-8 flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-500 text-primary-foreground shadow-xl"
          >
            <Briefcase className="size-7" />
          </motion.div>
          <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Ethio<span className="text-primary">Jobs</span></span>
        </Link>
        <div className="w-full drop-shadow-2xl">{children}</div>
      </motion.div>
    </div>
  );
}
