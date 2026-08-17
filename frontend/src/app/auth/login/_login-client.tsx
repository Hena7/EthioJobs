'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loginSchema } from '@/schemas';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { LoginFormData } from '@/schemas';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function LoginClient() {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Welcome back!');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Invalid email or password';
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
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Welcome Back</CardTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <CardDescription className="text-base mt-2">Sign in to your account</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-semibold text-foreground/80">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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

            <motion.div variants={itemVariants} className="flex items-center gap-2.5 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="size-4.5 rounded-md border-input accent-primary"
              />
              <Label htmlFor="remember" className="text-sm font-medium text-foreground/80 cursor-pointer">
                Remember me
              </Label>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg" size="lg" disabled={loading}>
                  <LogIn className="mr-2 size-5" />
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Register
            </Link>
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
