'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Code2,
  Blocks,
  BrainCircuit,
  Palette,
  Megaphone,
  TrendingUp,
  ArrowRight,
  Briefcase,
  Users,
  Building2,
  Medal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { JobCard } from '@/components/jobs/job-card';
import { JobCardSkeleton } from '@/components/shared/loading-skeleton';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useJobs } from '@/hooks/useJobs';
import { CATEGORIES } from '@/lib/constants';
import type { Job } from '@/types';

const categoryIcons = [Code2, Blocks, BrainCircuit, Palette, Megaphone, TrendingUp];

const stats = [
  { icon: Briefcase, label: 'Jobs', value: '10,000+' },
  { icon: Building2, label: 'Companies', value: '5,000+' },
  { icon: Users, label: 'Job Seekers', value: '50,000+' },
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { data: jobsData, isLoading } = useJobs({ page: 0 });

  const featuredJobs: Job[] = (jobsData?.content ?? []).filter((j) => j.isFeatured).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Find Your Dream Job in{' '}
                <span className="text-primary">Ethiopia</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                Connect with top employers across Ethiopia. Browse thousands of
                opportunities from leading companies.
              </p>
              <form
                onSubmit={handleSearch}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keyword, or company"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-12 pl-10 text-base"
                  />
                </div>
                <div className="sm:w-48">
                  <Select value={category} onValueChange={(v) => setCategory(typeof v === 'string' ? v : '')}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" size="lg" className="h-12 px-8">
                  <Search className="mr-2 size-4" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Featured Jobs</h2>
            <Link
              href="/jobs"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View All Jobs
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(jobsData?.content ?? []).slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
              Browse by Category
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {CATEGORIES.slice(0, 6).map((cat, i) => {
                const Icon = categoryIcons[i];
                return (
                  <Link key={cat} href={`/jobs?category=${encodeURIComponent(cat)}`}>
                    <Card className="group h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-6" />
                        </div>
                        <span className="text-sm font-medium">{cat}</span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <Building2 className="mb-4 size-10 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Post a Job</h3>
                <p className="mb-6 text-muted-foreground">
                  Reach thousands of qualified candidates across Ethiopia. Find
                  the perfect match for your team.
                </p>
                <Link href="/auth/register?role=employer">
                  <Button size="lg">
                    Post a Job
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
              <CardContent className="p-8">
                <Briefcase className="mb-4 size-10 text-blue-500" />
                <h3 className="mb-2 text-xl font-bold">Find a Job</h3>
                <p className="mb-6 text-muted-foreground">
                  Discover opportunities that match your skills. Take the next
                  step in your career today.
                </p>
                <Link href="/jobs">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                    Find a Job
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-y bg-muted/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center justify-center gap-4 py-6 sm:py-0"
                  >
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
