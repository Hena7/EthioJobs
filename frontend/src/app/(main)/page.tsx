'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
import { Button, buttonVariants } from '@/components/ui/button';
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
import { useJobs } from '@/hooks/useJobs';
import { CATEGORIES } from '@/lib/constants';
import type { Job } from '@/types';
import { cn } from '@/lib/utils';

const categoryIcons = [Code2, Blocks, BrainCircuit, Palette, Megaphone, TrendingUp];

const stats = [
  { icon: Briefcase, label: 'Jobs', value: '10,000+' },
  { icon: Building2, label: 'Companies', value: '5,000+' },
  { icon: Users, label: 'Job Seekers', value: '50,000+' },
  { icon: Medal, label: 'Freelancers', value: '5,000+' },
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
      <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center py-20 sm:py-28">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-[-1]"
          >
            <source src="/1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-[-1]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent z-[-1]" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full"
          >
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground drop-shadow-sm">
                Find Your Dream Job in{' '}
                <span className="text-primary">Ethiopia</span>
              </h1>
              <p className="mt-6 text-lg text-foreground/80 sm:text-xl max-w-2xl mx-auto font-medium">
                Connect with top employers across Ethiopia. Browse thousands of
                opportunities from leading companies.
              </p>
              <form
                onSubmit={handleSearch}
                className="mt-10 flex flex-col gap-3 sm:flex-row bg-background/95 p-3 rounded-2xl shadow-xl backdrop-blur-md border border-primary/10"
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keyword, or company"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-14 pl-11 text-base bg-transparent border-0 focus-visible:ring-0 shadow-none"
                  />
                </div>
                <div className="hidden sm:block w-px bg-border my-2" />
                <div className="sm:w-56">
                  <Select value={category} onValueChange={(v) => setCategory(typeof v === 'string' ? v : '')}>
                    <SelectTrigger className="h-14 text-base border-0 bg-transparent focus:ring-0 shadow-none">
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
                <Button type="submit" size="lg" className="h-14 px-8 rounded-xl text-lg group">
                  <Search className="mr-2 size-5 transition-transform group-hover:scale-110" />
                  Search
                </Button>
              </form>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Jobs</h2>
              <p className="text-muted-foreground mt-2">Explore top opportunities curated just for you.</p>
            </div>
            <Link
              href="/jobs"
              className="group flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View All Jobs
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <JobCard job={job} />
              </motion.div>
            ))
          ) : (
            (jobsData?.content ?? []).slice(0, 6).map((job) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <JobCard job={job} />
              </motion.div>
            ))
          )}
          </motion.div>
        </section>

        <section className="bg-muted/30 py-24 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight">
                Browse by Category
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Find the perfect role that matches your skills across our diverse categories.</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {CATEGORIES.slice(0, 6).map((cat, i) => {
                const Icon = categoryIcons[i];
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/jobs?category=${encodeURIComponent(cat)}`}>
                      <Card className="group h-full border-transparent bg-background shadow-sm transition-all hover:shadow-lg hover:border-primary/20">
                        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3">
                            <Icon className="size-7" />
                          </div>
                          <span className="text-sm font-medium">{cat}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Post a Job",
                desc: "Reach thousands of qualified candidates across Ethiopia. Find the perfect match for your team.",
                href: "/auth/register?role=employer",
                linkText: "Post a Job",
                color: "primary",
                textColor: "text-primary",
                borderColor: "border-primary/20",
                gradientTo: "to-primary/10",
                bgColor: "",
                hoverBgColor: "",
                video: "/2.mp4"
              },
              {
                icon: Briefcase,
                title: "Find a Job",
                desc: "Discover opportunities that match your skills. Take the next step in your career today.",
                href: "/jobs",
                linkText: "Find a Job",
                color: "blue",
                textColor: "text-blue-500",
                borderColor: "border-blue-500/20",
                gradientTo: "to-blue-500/10",
                bgColor: "bg-blue-500",
                hoverBgColor: "hover:bg-blue-600",
                video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              },
              {
                icon: Medal,
                title: "Hire Freelancers",
                desc: "Need flexible talent? Browse our marketplace of verified Ethiopian freelancers.",
                href: "/talent",
                linkText: "Find Talent",
                color: "purple",
                textColor: "text-purple-500",
                borderColor: "border-purple-500/20",
                gradientTo: "to-purple-500/10",
                bgColor: "bg-purple-500",
                hoverBgColor: "hover:bg-purple-600",
                video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Card className={cn(`relative overflow-hidden h-full group cursor-pointer`, item.borderColor)}>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-10 transition-opacity group-hover:opacity-20 z-0"
                  >
                    <source src={item.video} type="video/mp4" />
                  </video>
                  <div className={cn(`absolute inset-0 bg-gradient-to-br from-background via-background/90 z-0`, item.gradientTo)} />

                  <CardContent className="p-8 relative z-10 flex flex-col h-full">
                    <item.icon className={cn(`mb-6 size-12`, item.textColor)} />
                    <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
                    <p className="mb-8 text-muted-foreground flex-1">
                      {item.desc}
                    </p>
                    <Link
                      href={item.href}
                      className={cn(buttonVariants({ size: 'default' }), item.bgColor, item.hoverBgColor, "w-fit group-hover:pl-6 transition-all")}
                    >
                      {item.linkText}
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/10 py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent z-[-1]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight">How EthioJobs Marketplace Works</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to know to get started.</p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8 p-8 rounded-3xl bg-card border shadow-sm"
              >
                <h3 className="text-2xl font-semibold text-primary flex items-center gap-3">
                  <Building2 className="size-6" /> For Clients
                </h3>
                <div className="space-y-6">
                  {[
                    { title: "Post a job or browse catalog", desc: "Tell us what you need done, or browse ready-to-buy services." },
                    { title: "Choose the best freelancer", desc: "Review proposals, conduct interviews, and hire your favorite." },
                    { title: "Pay securely", desc: "Fund milestones upfront, and release payment only when you approve the work." }
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex gap-5 p-4 rounded-xl hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-md">{i + 1}</div>
                      <div>
                        <h4 className="font-semibold text-lg">{step.title}</h4>
                        <p className="text-muted-foreground mt-1">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8 p-8 rounded-3xl bg-card border shadow-sm"
              >
                <h3 className="text-2xl font-semibold text-blue-600 flex items-center gap-3">
                  <Briefcase className="size-6" /> For Freelancers
                </h3>
                <div className="space-y-6">
                  {[
                    { title: "Create a strong profile", desc: "Showcase your skills, experience, and portfolio to stand out." },
                    { title: "Submit proposals & sell services", desc: "Bid on active jobs or create catalog listings for clients to buy." },
                    { title: "Get paid safely", desc: "Work with peace of mind knowing the client has funded the milestone." }
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex gap-5 p-4 rounded-xl hover:bg-blue-500/5 transition-colors"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-md">{i + 1}</div>
                      <div>
                        <h4 className="font-semibold text-lg">{step.title}</h4>
                        <p className="text-muted-foreground mt-1">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-y bg-primary text-primary-foreground py-16 relative overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay z-0"
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" type="video/mp4" />
          </video>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center justify-center gap-3 py-6 text-center"
                  >
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white mb-2 shadow-lg">
                      <Icon className="size-7" />
                    </div>
                    <div>
                      <p className="text-4xl font-bold mb-1">{stat.value}</p>
                      <p className="text-primary-foreground/80 font-medium">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
    </>
  );
}
