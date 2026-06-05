'use client';

import { useState } from 'react';
import {
  MapPin,
  Clock,
  Eye,
  Users,
  Heart,
  Share2,
  Link as LinkIcon,
  Medal,
  Check,
  Globe,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { cn, timeAgo, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Job } from '@/types';

interface JobDetailHeaderProps {
  job: Job;
  isBookmarked?: boolean;
  onBookmark?: () => void;
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

export function JobDetailHeader({
  job,
  isBookmarked = false,
  onBookmark,
  className,
}: JobDetailHeaderProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this job: ${job.title} at ${job.companyName}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="size-16 rounded-xl object-cover sm:size-20"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-xl bg-muted text-xl font-bold text-muted-foreground sm:size-20">
              {getInitials(job.companyName)}
            </div>
          )}

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-xl font-bold sm:text-2xl">{job.title}</h1>
              {job.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  <Medal className="size-3" />
                  Featured
                </span>
              )}
            </div>
            <Link
              href={`/companies/${job.companyId}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {job.companyName}
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {job.location}
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  typeColors[job.type] || typeColors.FULL_TIME,
                )}
              >
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

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                Posted {timeAgo(job.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3.5" />
                {job.viewCount} views
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5" />
                {job.applicationCount} applicants
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <div className="flex items-center gap-2">
            <Link href={`/jobs/${job.id}/apply`}>
              <Button size="lg">Apply Now</Button>
            </Link>
            {onBookmark && (
              <Button
                variant="outline"
                size="icon"
                onClick={onBookmark}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Heart
                  className={cn(
                    'size-5',
                    isBookmarked
                      ? 'fill-red-500 text-red-500'
                      : 'text-muted-foreground',
                  )}
                />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={copyLink}
              className="gap-1 text-muted-foreground"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <LinkIcon className="size-3.5" />
              )}
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={shareOnLinkedIn}
              className="text-muted-foreground hover:text-blue-600"
              aria-label="Share on LinkedIn"
            >
              <Globe className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={shareOnTwitter}
              className="text-muted-foreground hover:text-sky-500"
              aria-label="Share on X"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
