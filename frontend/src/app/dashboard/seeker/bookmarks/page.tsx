'use client';

import { useMyBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { JobCardSkeleton } from '@/components/shared/loading-skeleton';
import { Bookmark, Heart, ExternalLink, MapPin, Briefcase, AlertTriangle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Bookmark as BookmarkType } from '@/types';

function BookmarkCard({
  bookmark,
  onRemove,
}: {
  bookmark: BookmarkType;
  onRemove: (id: string) => void;
}) {
  const { job } = bookmark;

  return (
    <div className="group relative rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => onRemove(job.id)}
        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-red-500 opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100 dark:hover:bg-red-950/50"
        title="Remove bookmark"
      >
        <Trash2 className="size-4" />
      </button>
      <div className="mb-3 flex items-start gap-3">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={`${job.companyName} logo`}
            className="size-10 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
            {job.companyName.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{job.title}</h3>
          <p className="text-xs text-muted-foreground">{job.companyName}</p>
        </div>
        <Heart className="size-5 shrink-0 fill-red-500 text-red-500" />
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          <Briefcase className="size-3" />
          {job.type.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Saved {formatDate(bookmark.createdAt)}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className={buttonVariants({ variant: 'outline', size: 'xs' })}
        >
          <ExternalLink className="size-3.5" />
          View Job
        </Link>
      </div>
    </div>
  );
}

export default function SavedJobsPage() {
  const { data: bookmarks, isLoading, error } = useMyBookmarks();
  const toggleBookmark = useToggleBookmark();

  const handleRemove = (jobId: string) => {
    toggleBookmark.mutate(jobId, {
      onSuccess: () => {
        toast.success('Bookmark removed');
      },
      onError: () => {
        toast.error('Failed to remove bookmark');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load saved jobs</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Saved Jobs</h2>
        <p className="text-sm text-muted-foreground">
          Jobs you&apos;ve bookmarked for later.
        </p>
      </div>

      {!bookmarks || bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Save jobs you're interested in and they'll appear here."
          actionLabel="Browse Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bm) => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
