'use client';

import { CheckCircle2, Circle, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Milestone } from '@/types';
import { cn } from '@/lib/utils';

const STEP_ORDER = ['DRAFT', 'FUNDED', 'SUBMITTED', 'APPROVED', 'RELEASED'] as const;

type MilestoneStatus = (typeof STEP_ORDER)[number];

const stepLabels: Record<MilestoneStatus, string> = {
  DRAFT: 'Draft',
  FUNDED: 'Funded',
  SUBMITTED: 'Work Submitted',
  APPROVED: 'Approved',
  RELEASED: 'Payment Released',
};

const stepColors: Record<MilestoneStatus, string> = {
  DRAFT: 'text-muted-foreground',
  FUNDED: 'text-blue-600',
  SUBMITTED: 'text-amber-600',
  APPROVED: 'text-primary',
  RELEASED: 'text-green-600',
};

interface MilestoneTrackerProps {
  milestones: Milestone[];
  isEmployer?: boolean;
  isFreelancer?: boolean;
  onUpdateStatus?: (milestoneId: string, status: string) => void;
  isUpdating?: boolean;
}

function MilestoneStep({
  status,
  currentStatus,
  label,
}: {
  status: MilestoneStatus;
  currentStatus: MilestoneStatus;
  label: string;
}) {
  const currentIdx = STEP_ORDER.indexOf(currentStatus);
  const stepIdx = STEP_ORDER.indexOf(status);
  const isDone = stepIdx < currentIdx;
  const isCurrent = stepIdx === currentIdx;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'flex size-7 items-center justify-center rounded-full border-2 transition-all',
          isDone && 'border-primary bg-primary text-primary-foreground',
          isCurrent && 'border-primary text-primary bg-primary/10',
          !isDone && !isCurrent && 'border-muted text-muted-foreground',
        )}
      >
        {isDone ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
      </div>
      <span
        className={cn(
          'text-xs font-medium text-center leading-tight max-w-[72px]',
          isCurrent ? 'text-primary' : isDone ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function MilestoneTracker({
  milestones,
  isEmployer,
  isFreelancer,
  onUpdateStatus,
  isUpdating,
}: MilestoneTrackerProps) {
  if (milestones.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        <AlertCircle className="size-4 shrink-0" />
        No milestones added yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => {
        const currentStatus = (milestone.status ?? 'DRAFT') as MilestoneStatus;
        const currentIdx = STEP_ORDER.indexOf(currentStatus);

        return (
          <div key={milestone.id} className="rounded-xl border bg-card p-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold">{milestone.title}</h4>
                {milestone.description && (
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DollarSign className="size-4 text-primary" />
                <span className="text-lg font-bold">${milestone.amount}</span>
              </div>
            </div>

            {/* Step progress bar */}
            <div className="relative flex items-start justify-between">
              {/* connector line */}
              <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-border -z-0" />
              <div
                className="absolute top-3.5 left-0 h-0.5 bg-primary transition-all -z-0"
                style={{
                  width: `${(currentIdx / (STEP_ORDER.length - 1)) * 100}%`,
                }}
              />
              {STEP_ORDER.map((s) => (
                <MilestoneStep
                  key={s}
                  status={s}
                  currentStatus={currentStatus}
                  label={stepLabels[s]}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              {/* Employer can fund */}
              {isEmployer && currentStatus === 'DRAFT' && (
                <Button
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => onUpdateStatus?.(milestone.id, 'FUNDED')}
                >
                  Fund Milestone
                </Button>
              )}
              {/* Freelancer submits work */}
              {isFreelancer && currentStatus === 'FUNDED' && (
                <Button
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => onUpdateStatus?.(milestone.id, 'SUBMITTED')}
                >
                  Submit Work
                </Button>
              )}
              {/* Employer approves */}
              {isEmployer && currentStatus === 'SUBMITTED' && (
                <>
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => onUpdateStatus?.(milestone.id, 'APPROVED')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => onUpdateStatus?.(milestone.id, 'FUNDED')}
                  >
                    Request Revision
                  </Button>
                </>
              )}
              {/* Employer releases payment */}
              {isEmployer && currentStatus === 'APPROVED' && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isUpdating}
                  onClick={() => onUpdateStatus?.(milestone.id, 'RELEASED')}
                >
                  <DollarSign className="size-4" />
                  Release Payment
                </Button>
              )}
              {currentStatus === 'RELEASED' && (
                <Badge className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="size-3 mr-1" />
                  Paid
                </Badge>
              )}
            </div>

            {milestone.dueDate && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                Due {new Date(milestone.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
