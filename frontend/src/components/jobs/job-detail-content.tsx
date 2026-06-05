'use client';

import { useMemo } from 'react';
import {
  DollarSign,
  CalendarClock,
  Building2,
  Globe,
  Users,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn, formatSalary } from '@/lib/utils';
import type { Job } from '@/types';

interface JobDetailContentProps {
  job: Job;
  className?: string;
}

function DeadlineDisplay({ deadline }: { deadline: string }) {
  const { label, urgent } = useMemo(() => {
    const now = new Date();
    const end = new Date(deadline);
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return { label: 'Deadline passed', urgent: true };

    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return { label: 'Deadline: Tomorrow', urgent: true };
    if (diffDays <= 7) return { label: `Deadline: ${diffDays} days left`, urgent: true };
    return { label: `Deadline: ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, urgent: false };
  }, [deadline]);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm',
        urgent ? 'text-red-600 font-medium' : 'text-muted-foreground',
      )}
    >
      {urgent ? (
        <AlertCircle className="size-4" />
      ) : (
        <CalendarClock className="size-4" />
      )}
      {label}
    </span>
  );
}

export function JobDetailContent({ job, className }: JobDetailContentProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Description */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Description</h2>
        <div
          className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
          dangerouslySetInnerHTML={
            job.description.includes('<')
              ? { __html: job.description }
              : undefined
          }
        >
          {!job.description.includes('<') && (
            <p className="whitespace-pre-wrap">{job.description}</p>
          )}
        </div>
      </section>

      {/* Requirements */}
      {job.requirements && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Requirements</h2>
          <div
            className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
            dangerouslySetInnerHTML={
              job.requirements.includes('<')
                ? { __html: job.requirements }
                : undefined
            }
          >
            {!job.requirements.includes('<') && (
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            )}
          </div>
        </section>
      )}

      {/* Salary */}
      {(job.salaryMin ?? job.salaryMax) && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Salary</h2>
          <div className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-3">
            <DollarSign className="size-5 text-emerald-600" />
            <span className="text-lg font-semibold">
              {formatSalary(job.salaryMin ?? 0, job.salaryMax)}
            </span>
          </div>
        </section>
      )}

      {/* Deadline */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Application Deadline</h2>
        <DeadlineDisplay deadline={job.deadline} />
      </section>

      {/* Company Sidebar Widget */}
      <section className="rounded-lg border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">About the Company</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Building2 className="size-4 shrink-0" />
            <span className="font-medium text-foreground">{job.companyName}</span>
          </div>
          {job.location && (
            <div className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0" />
              <span>{job.location}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Users className="size-4 shrink-0" />
            <span>{job.applicationCount} applicants for this job</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 shrink-0" />
            <span>Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
