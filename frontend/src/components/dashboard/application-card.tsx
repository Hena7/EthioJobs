'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Check,
  X,
  Eye,
  UserCheck,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { cn, timeAgo, getInitials, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ApplicationStatus, type Application } from '@/types';

interface ApplicationCardProps {
  application: Application;
  className?: string;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  [ApplicationStatus.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: <Clock className="size-3.5" />,
  },
  [ApplicationStatus.REVIEWED]: {
    label: 'Reviewed',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: <Eye className="size-3.5" />,
  },
  [ApplicationStatus.SHORTLISTED]: {
    label: 'Shortlisted',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: <UserCheck className="size-3.5" />,
  },
  [ApplicationStatus.REJECTED]: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: <X className="size-3.5" />,
  },
  [ApplicationStatus.HIRED]: {
    label: 'Hired',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: <Star className="size-3.5" />,
  },
};

const statusOrder: ApplicationStatus[] = [
  ApplicationStatus.PENDING,
  ApplicationStatus.REVIEWED,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.HIRED,
];

function StatusTimeline({ status }: { status: ApplicationStatus }) {
  const currentIdx = statusOrder.indexOf(status);
  const isRejected = status === ApplicationStatus.REJECTED;

  if (isRejected) {
    return (
      <div className="flex items-center gap-2">
        {statusOrder.slice(0, 2).map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'flex size-6 items-center justify-center rounded-full',
                idx <= currentIdx
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <X className="size-3" />
            </div>
            {idx < 1 && (
              <div
                className={cn(
                  'h-0.5 w-6',
                  idx < currentIdx ? 'bg-red-400' : 'bg-muted',
                )}
              />
            )}
          </div>
        ))}
        <span className="text-xs font-medium text-red-600">Rejected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {statusOrder.map((s, idx) => {
        const completed = idx <= currentIdx;
        const isLast = idx === statusOrder.length - 1;
        const isCurrent = s === status;
        const Icon = completed ? Check : Clock;
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-xs transition-colors duration-300',
                completed
                  ? 'bg-gradient-to-r from-primary to-teal-500 text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground',
                isCurrent && 'ring-4 ring-primary/20',
              )}
            >
              <Icon className="size-3" />
            </div>
            {!isLast && (
              <div
                className={cn(
                  'h-0.5 w-6',
                  completed && idx < 3 ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ApplicationCard({
  application,
  className,
}: ApplicationCardProps) {
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const { job } = application;
  const config = statusConfig[application.status];

  return (
    <div
      className={cn(
        'group rounded-xl border bg-card/90 backdrop-blur-sm p-5 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="size-12 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
              {getInitials(job.companyName)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.companyName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  config.color,
                )}
              >
                {config.icon}
                {config.label}
              </span>
              <span className="text-xs text-muted-foreground">
                Applied {timeAgo(application.appliedAt)}
              </span>
            </div>
          </div>
        </div>

        <Link href={`/jobs/${job.id}`}>
          <Button variant="outline" size="xs" className="gap-1">
            <ExternalLink className="size-3.5" />
            View Job
          </Button>
        </Link>
      </div>

      {application.coverLetter && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowCoverLetter(!showCoverLetter)}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {showCoverLetter ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
            Cover Letter
          </button>
          {showCoverLetter && (
            <p className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm text-muted-foreground">
              {application.coverLetter}
            </p>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Application Status
        </p>
        <StatusTimeline status={application.status} />
      </div>
    </div>
  );
}
