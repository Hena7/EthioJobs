'use client';

import { MapPin, Clock, Heart, Briefcase, Medal } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn, timeAgo, formatSalary, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Job } from '@/types';

interface JobCardProps {
  job: Job;
  onBookmark?: (jobId: string) => void;
  isBookmarked?: boolean;
  className?: string;
}

const typeColors: Record<string, string> = {
  FULL_TIME: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PART_TIME: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  CONTRACT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  INTERNSHIP: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REMOTE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

const levelColors: Record<string, string> = {
  ENTRY: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  JUNIOR: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  MID: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  SENIOR: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  LEAD: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function JobCard({
  job,
  onBookmark,
  isBookmarked = false,
  className,
}: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/jobs/${job.id}`}
        className={cn(
          'group relative block h-full rounded-2xl border p-6 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40',
          job.isFeatured ? 'border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5' : 'bg-card/95 backdrop-blur-md',
          className,
        )}
      >
        {job.isFeatured && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 shadow-sm"
          >
            <Medal className="size-3.5" />
            Featured
          </motion.span>
        )}

        <div className="mb-5 flex items-start gap-4">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="size-14 rounded-2xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-teal-500/20 text-lg font-bold text-primary shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 border border-primary/20">
              {getInitials(job.companyName)}
            </div>
          )}

          <div className="min-w-0 flex-1 pt-1">
            <h3 className="truncate text-lg font-bold group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-muted-foreground mt-0.5">{job.companyName}</p>
          </div>

          {onBookmark && (
            <motion.div whileTap={{ scale: 0.8 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBookmark(job.id);
                }}
                className="shrink-0 mt-1 hover:bg-red-500/10 rounded-full"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Heart
                  className={cn(
                    'size-5 transition-colors',
                    isBookmarked
                      ? 'fill-red-500 text-red-500'
                      : 'text-muted-foreground hover:text-red-500',
                  )}
                />
              </Button>
            </motion.div>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
              typeColors[job.type] || typeColors.FULL_TIME,
            )}
          >
            <Briefcase className="mr-1.5 size-3.5" />
            {job.type.replace('_', ' ')}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
              levelColors[job.experienceLevel] || levelColors.ENTRY,
            )}
          >
            {job.experienceLevel}
          </span>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground font-medium">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 text-foreground/50" />
            {job.location}
          </span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="inline-flex items-center gap-1.5 font-bold text-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
              {formatSalary(job.salaryMin ?? 0, job.salaryMax)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-4 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
            <Clock className="size-3.5" />
            {timeAgo(job.createdAt)}
          </span>
          <span className="bg-muted/50 px-2 py-1 rounded-md">{job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}</span>
        </div>
      </Link>
    </motion.div>
  );
}
