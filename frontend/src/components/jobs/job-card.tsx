'use client';

import { MapPin, Clock, Heart, Briefcase, Medal } from 'lucide-react';
import Link from 'next/link';
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
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        'group relative block rounded-xl border p-5 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30',
        job.isFeatured ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent' : 'bg-card/90 backdrop-blur-sm',
        className,
      )}
    >
      {job.isFeatured && (
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
          <Medal className="size-3" />
          Featured
        </span>
      )}

      <div className="mb-4 flex items-start gap-4">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={`${job.companyName} logo`}
            className="size-12 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-teal-500/10 text-sm font-semibold text-primary shadow-sm transition-transform group-hover:scale-105 border border-primary/10">
            {getInitials(job.companyName)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold group-hover:text-primary">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground">{job.companyName}</p>
        </div>

        {onBookmark && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBookmark(job.id);
            }}
            className="shrink-0"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Heart
              className={cn(
                'size-5 transition-colors',
                isBookmarked
                  ? 'fill-red-500 text-red-500'
                  : 'text-muted-foreground hover:text-red-400',
              )}
            />
          </Button>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            typeColors[job.type] || typeColors.FULL_TIME,
          )}
        >
          <Briefcase className="mr-1 size-3" />
          {job.type.replace('_', ' ')}
        </span>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            levelColors[job.experienceLevel] || levelColors.ENTRY,
          )}
        >
          {job.experienceLevel}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {job.location}
        </span>
        {(job.salaryMin || job.salaryMax) && (
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            {formatSalary(job.salaryMin ?? 0, job.salaryMax)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" />
          {timeAgo(job.createdAt)}
        </span>
        <span>{job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}</span>
      </div>
    </Link>
  );
}
