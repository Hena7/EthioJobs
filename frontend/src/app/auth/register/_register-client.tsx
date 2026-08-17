'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { registerSchema } from '@/schemas';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { RegisterFormData } from '@/schemas';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'EMPLOYER' : 'FREELANCER';

  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'FREELANCER' | 'EMPLOYER'>(initialRole);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole,
    }
  });

  useEffect(() => {
    setValue('role', role);
  }, [role, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success('Registration successful! Please sign in.');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
    >
      <Card className="border-0 shadow-2xl bg-background/90 backdrop-blur-xl">
        <CardHeader className="text-center pb-6">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Create an Account</CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription className="text-base mt-2">Join EthioJobs Hub today</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div variants={itemVariants} className="mb-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('FREELANCER')}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all",
                role === 'FREELANCER'
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-muted bg-transparent text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <User className="size-6" />
              <span className="font-semibold text-sm">Freelancer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('EMPLOYER')}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all",
                role === 'EMPLOYER'
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-muted bg-transparent text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <Building2 className="size-6" />
              <span className="font-semibold text-sm">Employer</span>
            </button>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-2.5">
              <Label htmlFor="name" className="font-semibold text-foreground/80">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                aria-invalid={!!errors.name}
                className="h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50"
              />
              {errors.name && (
                <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2.5">
              <Label htmlFor="email" className="font-semibold text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-invalid={!!errors.email}
                className="h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50"
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2.5">
              <Label htmlFor="password" className="font-semibold text-foreground/80">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  className="h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg" size="lg" disabled={loading}>
                  <UserPlus className="mr-2 size-5" />
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </motion.div>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RegisterClient() {
  return (
    <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
