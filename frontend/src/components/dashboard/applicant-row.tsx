'use client';

import { useState } from 'react';
import {
  Download,
  ChevronDown,
  ExternalLink,
  Clock,
  Eye,
  UserCheck,
  X,
  Star,
} from 'lucide-react';
import { cn, timeAgo, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { APPLICATION_STATUS_OPTIONS } from '@/lib/constants';
import { toast } from 'sonner';
import type { Application, ApplicationStatus } from '@/types';

interface ApplicantRowProps {
  application: Application;
  onStatusChange: (id: string, status: string) => void;
  isUpdating?: boolean;
  className?: string;
}

const statusColors: Record<
  ApplicationStatus,
  string
> = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  REVIEWED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  SHORTLISTED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  HIRED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const statusIcons: Record<ApplicationStatus, React.ReactNode> = {
  PENDING: <Clock className="size-3.5" />,
  REVIEWED: <Eye className="size-3.5" />,
  SHORTLISTED: <UserCheck className="size-3.5" />,
  REJECTED: <X className="size-3.5" />,
  HIRED: <Star className="size-3.5" />,
};

export function ApplicantRow({
  application,
  onStatusChange,
  isUpdating = false,
  className,
}: ApplicantRowProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const currentStatusLabel =
    APPLICATION_STATUS_OPTIONS.find((o) => o.value === application.status)
      ?.label ?? application.status;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 border-b px-4 py-4 last:border-b-0',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {application.user.profilePicture ? (
          <img
            src={application.user.profilePicture}
            alt={application.user.name}
            className="size-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {getInitials(application.user.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {application.user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {application.user.email}
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Applied {timeAgo(application.appliedAt)}
      </div>

      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
          statusColors[application.status],
        )}
      >
        {statusIcons[application.status]}
        {currentStatusLabel}
      </span>

      <div className="flex items-center gap-2">
        {application.resume && (
          <a
            href={application.resume.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="xs"
              className="gap-1 text-muted-foreground"
            >
              <Download className="size-3.5" />
              Resume
            </Button>
          </a>
        )}

        <div className="relative">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setStatusOpen(!statusOpen)}
            disabled={isUpdating}
            className="gap-1"
          >
            Update Status
            <ChevronDown className="size-3.5" />
          </Button>
          {statusOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setStatusOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border bg-popover p-1 shadow-lg">
                {APPLICATION_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onStatusChange(application.id, opt.value);
                      setStatusOpen(false);
                      toast.success(`Status updated to ${opt.label}`);
                    }}
                    disabled={opt.value === application.status}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50',
                      opt.value === application.status && 'font-medium text-primary',
                    )}
                  >
                    {statusIcons[opt.value as ApplicationStatus]}
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <a
          href={`/applications/${application.id}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View application details"
        >
          <Button variant="ghost" size="icon-xs">
            <ExternalLink className="size-3.5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
