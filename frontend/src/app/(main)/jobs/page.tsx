'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, AlertCircle } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useDebounce } from '@/hooks/useDebounce';
import { useMyBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { JobCard } from '@/components/jobs/job-card';
import { JobFiltersPanel } from '@/components/jobs/job-filters';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { JobCardSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import type { JobFilters, JobType, ExperienceLevel } from '@/types';

function JobsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<JobFilters>(() => ({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    location: searchParams.get('location') || undefined,
    type: (searchParams.get('type') as JobType) || undefined,
    experienceLevel:
      (searchParams.get('experienceLevel') as ExperienceLevel) || undefined,
    salaryMin: searchParams.get('salaryMin')
      ? Number(searchParams.get('salaryMin'))
      : undefined,
    salaryMax: searchParams.get('salaryMax')
      ? Number(searchParams.get('salaryMax'))
      : undefined,
    sort: searchParams.get('sort') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
  }));

  const debouncedFilters = useDebounce(filters, 300);

  const { data, isLoading, isError, refetch } = useJobs(filters);
  const { data: bookmarks } = useMyBookmarks();
  const toggleBookmark = useToggleBookmark();

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedFilters.search) params.set('search', debouncedFilters.search);
    if (debouncedFilters.category)
      params.set('category', debouncedFilters.category);
    if (debouncedFilters.location)
      params.set('location', debouncedFilters.location);
    if (debouncedFilters.type) params.set('type', debouncedFilters.type);
    if (debouncedFilters.experienceLevel)
      params.set('experienceLevel', debouncedFilters.experienceLevel);
    if (debouncedFilters.salaryMin)
      params.set('salaryMin', String(debouncedFilters.salaryMin));
    if (debouncedFilters.salaryMax)
      params.set('salaryMax', String(debouncedFilters.salaryMax));
    if (debouncedFilters.sort) params.set('sort', debouncedFilters.sort);
    if (debouncedFilters.page && debouncedFilters.page > 0)
      params.set('page', String(debouncedFilters.page));

    const qs = params.toString();
    router.replace(qs ? `/jobs?${qs}` : '/jobs', { scroll: false });
  }, [debouncedFilters, router]);

  const handleFilterChange = useCallback((newFilters: JobFilters) => {
    setFilters({ ...newFilters, page: 0 });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ page: 0 });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const bookmarkedIds = new Set(bookmarks?.map((b) => b.job.id) ?? []);

  const handleBookmark = useCallback(
    (jobId: string) => {
      toggleBookmark.mutate(jobId);
    },
    [toggleBookmark],
  );

  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.page ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Find Jobs</h1>
        {!isLoading && !isError && (
          <p className="mt-1 text-muted-foreground">
            {totalElements} {totalElements === 1 ? 'job' : 'jobs'} found
          </p>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <JobFiltersPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </aside>

        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="size-8 text-destructive" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">
                Failed to load jobs
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Something went wrong. Please try again.
              </p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          ) : data && data.content.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No jobs found"
              description="Try adjusting your filters or search term."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {data?.content.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onBookmark={handleBookmark}
                    isBookmarked={bookmarkedIds.has(job.id)}
                  />
                ))}
              </div>

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
            <div className="mt-1 h-5 w-32 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="flex gap-8">
            <div className="hidden w-72 shrink-0 lg:block">
              <div className="h-96 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
