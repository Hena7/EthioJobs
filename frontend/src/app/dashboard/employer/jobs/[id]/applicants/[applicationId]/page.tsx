'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  MapPin,
  Briefcase,
  Mail,
  Clock,
  FileText,
  Star,
  Eye,
  UserCheck,
  X,
  ChevronDown,
  AlertCircle,
  DollarSign,
  Calendar,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useApplication, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';
import { cn, getInitials, timeAgo, formatDate, formatFileSize, formatSalary } from '@/lib/utils';
import { APPLICATION_STATUS_OPTIONS, EXPERIENCE_LEVEL_OPTIONS } from '@/lib/constants';
import { ApplicationStatus } from '@/types';
import { toast } from 'sonner';

/* ─── status styling ──────────────────────────────────────────────── */
const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  [ApplicationStatus.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    icon: <Clock className="size-3.5" />,
  },
  [ApplicationStatus.REVIEWED]: {
    label: 'Reviewed',
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    icon: <Eye className="size-3.5" />,
  },
  [ApplicationStatus.SHORTLISTED]: {
    label: 'Shortlisted',
    color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    icon: <UserCheck className="size-3.5" />,
  },
  [ApplicationStatus.REJECTED]: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    icon: <X className="size-3.5" />,
  },
  [ApplicationStatus.HIRED]: {
    label: 'Hired 🎉',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: <Star className="size-3.5" />,
  },
};

const experienceLabelMap = Object.fromEntries(
  EXPERIENCE_LEVEL_OPTIONS.map((o) => [o.value, o.label]),
);

/* ─── application timeline steps ─────────────────────────────────── */
const PIPELINE_STEPS: ApplicationStatus[] = [
  ApplicationStatus.PENDING,
  ApplicationStatus.REVIEWED,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.HIRED,
];

function PipelineBar({ current }: { current: ApplicationStatus }) {
  const isRejected = current === ApplicationStatus.REJECTED;
  const currentIdx = isRejected ? -1 : PIPELINE_STEPS.indexOf(current);

  return (
    <div className="flex items-center gap-0">
      {PIPELINE_STEPS.map((step, idx) => {
        const cfg = statusConfig[step];
        const done = !isRejected && idx <= currentIdx;
        const active = step === current;
        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
                  done
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30 bg-muted text-muted-foreground',
                  active && 'ring-2 ring-primary ring-offset-2',
                )}
              >
                {idx + 1}
              </div>
              <span
                className={cn(
                  'whitespace-nowrap text-[10px] font-medium',
                  done ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {cfg.label.replace(' 🎉', '')}
              </span>
            </div>
            {idx < PIPELINE_STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-0.5 flex-1 rounded-full transition-all',
                  idx < currentIdx && !isRejected ? 'bg-primary' : 'bg-muted-foreground/20',
                )}
              />
            )}
          </div>
        );
      })}

      {/* rejected node */}
      <div className="ml-3 flex flex-col items-center gap-1">
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
            isRejected
              ? 'border-red-500 bg-red-500 text-white'
              : 'border-muted-foreground/30 bg-muted text-muted-foreground',
          )}
        >
          <X className="size-3.5" />
        </div>
        <span
          className={cn(
            'whitespace-nowrap text-[10px] font-medium',
            isRejected ? 'text-red-500' : 'text-muted-foreground',
          )}
        >
          Rejected
        </span>
      </div>
    </div>
  );
}

/* ─── status dropdown ─────────────────────────────────────────────── */
function StatusDropdown({
  current,
  onSelect,
  isLoading,
}: {
  current: ApplicationStatus;
  onSelect: (s: string) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const cfg = statusConfig[current];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className={cn('gap-2 border font-medium', cfg.color)}
        onClick={() => setOpen(!open)}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : cfg.icon}
        {cfg.label}
        <ChevronDown className="ml-auto size-3.5 opacity-60" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1.5 w-48 rounded-xl border bg-popover p-1.5 shadow-xl">
            <p className="mb-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Move to stage
            </p>
            {APPLICATION_STATUS_OPTIONS.map((opt) => {
              const c = statusConfig[opt.value as ApplicationStatus];
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.value === current}
                  onClick={() => {
                    onSelect(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    'hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
                    opt.value === current && 'font-semibold text-primary',
                  )}
                >
                  {c.icon}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── skill tags ──────────────────────────────────────────────────── */
function SkillTags({ skills }: { skills?: string }) {
  if (!skills?.trim()) return <p className="text-sm text-muted-foreground italic">No skills listed</p>;
  const tags = skills.split(',').map((s) => s.trim()).filter(Boolean);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ─── main page ───────────────────────────────────────────────────── */
export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const applicationId = params.applicationId as string;

  const { data: application, isLoading, isError, refetch } = useApplication(applicationId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus();

  const handleStatusChange = (status: string) => {
    updateStatus(
      { id: applicationId, status },
      {
        onSuccess: () => toast.success(`Status updated to ${statusConfig[status as ApplicationStatus]?.label ?? status}`),
        onError: () => toast.error('Failed to update status'),
      },
    );
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError || !application) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <p className="font-medium">Failed to load application</p>
          <p className="text-sm text-muted-foreground">
            The application may have been removed or you don&apos;t have access.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
            <Button size="sm" onClick={() => router.back()}>Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { user, job, status, coverLetter, resume, appliedAt } = application;
  const cfg = statusConfig[status];

  return (
    <div className="space-y-6">
      {/* ── breadcrumb back ── */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/employer/jobs/${jobId}/applicants`}>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">
            <Link href="/dashboard/employer/jobs" className="hover:underline">My Jobs</Link>
            {' / '}
            <Link href={`/dashboard/employer/jobs/${jobId}/applicants`} className="hover:underline">
              {job.title}
            </Link>
            {' / '}
            <span className="font-medium text-foreground">{user.name}</span>
          </p>
        </div>
      </div>

      {/* ── hero card ── */}
      <Card className="overflow-hidden">
        {/* coloured top band based on status */}
        <div className={cn('h-2 w-full', status === ApplicationStatus.HIRED && 'bg-emerald-500', status === ApplicationStatus.SHORTLISTED && 'bg-green-500', status === ApplicationStatus.REJECTED && 'bg-red-500', status === ApplicationStatus.REVIEWED && 'bg-blue-500', status === ApplicationStatus.PENDING && 'bg-yellow-500')} />
        <CardContent className="flex flex-wrap items-start gap-6 p-6">
          {/* avatar */}
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="size-20 shrink-0 rounded-2xl object-cover shadow-md"
            />
          ) : (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/60 to-primary text-3xl font-bold text-primary-foreground shadow-md">
              {getInitials(user.name)}
            </div>
          )}

          {/* info */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                Applied {timeAgo(appliedAt)} ({formatDate(appliedAt)})
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="size-3.5" />
                Applying for: <strong className="text-foreground">{job.title}</strong>
              </span>
            </div>

            {/* current status badge */}
            <div className="mt-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
                  cfg.color,
                )}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            </div>
          </div>

          {/* action area */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusDropdown
              current={status}
              onSelect={handleStatusChange}
              isLoading={isUpdating}
            />
            {resume && (
              <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 w-full">
                  <Download className="size-3.5" />
                  Download Resume
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── pipeline progress ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Pipeline</CardTitle>
          <CardDescription>Current stage in the hiring process</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <PipelineBar current={status} />
        </CardContent>
      </Card>

      {/* ── two column body ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* left — cover letter + resume */}
        <div className="space-y-6 lg:col-span-2">
          {/* cover letter */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Cover Letter</CardTitle>
                  <CardDescription>Written by the applicant</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {coverLetter ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {coverLetter}
                </p>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <FileText className="mb-2 size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No cover letter submitted</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* resume attachment */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Download className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Resume / CV</CardTitle>
                  <CardDescription>Submitted with this application</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {resume ? (
                <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{resume.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(resume.fileSize)} · Uploaded {formatDate(resume.uploadedAt)}
                    </p>
                  </div>
                  <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-1.5 shrink-0">
                      <Download className="size-3.5" />
                      Download
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <FileText className="mb-2 size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No resume attached</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* right — applicant profile sidebar */}
        <div className="space-y-6">
          {/* candidate quick stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Candidate Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {/* experience level */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Briefcase className="size-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Experience Level</p>
                  <p className="font-medium">
                    {application.user
                      ? experienceLabelMap[(application as unknown as { profile?: { experienceLevel?: string } }).profile?.experienceLevel ?? ''] ?? '—'
                      : '—'}
                  </p>
                </div>
              </div>

              {/* location */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="size-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {(application as unknown as { profile?: { location?: string } }).profile?.location ?? '—'}
                  </p>
                </div>
              </div>

              {/* expected salary */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <DollarSign className="size-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected Salary</p>
                  <p className="font-medium">
                    {(application as unknown as { profile?: { expectedSalary?: number } }).profile?.expectedSalary
                      ? `$${((application as unknown as { profile: { expectedSalary: number } }).profile.expectedSalary / 1000).toFixed(0)}k / yr`
                      : '—'}
                  </p>
                </div>
              </div>

              <Separator />

              {/* job this person applied to */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Applied to</p>
                <Link
                  href={`/jobs/${job.id}`}
                  target="_blank"
                  className="flex items-center gap-1 font-medium text-primary hover:underline text-sm"
                >
                  {job.title}
                  <ExternalLink className="size-3" />
                </Link>
                <p className="text-xs text-muted-foreground">
                  {job.location} · {job.type.replace('_', ' ')}
                </p>
                {(job.salaryMin || job.salaryMax) && (
                  <p className="text-xs text-muted-foreground">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* bio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
              {(application as unknown as { profile?: { bio?: string } }).profile?.bio ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {(application as unknown as { profile: { bio: string } }).profile.bio}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No bio provided</p>
              )}
            </CardContent>
          </Card>

          {/* skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillTags skills={(application as unknown as { profile?: { skills?: string } }).profile?.skills} />
            </CardContent>
          </Card>

          {/* quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                className="w-full justify-start gap-2"
                disabled={status === ApplicationStatus.SHORTLISTED || isUpdating}
                onClick={() => handleStatusChange(ApplicationStatus.SHORTLISTED)}
              >
                <UserCheck className="size-4" />
                Shortlist Candidate
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                disabled={status === ApplicationStatus.HIRED || isUpdating}
                onClick={() => handleStatusChange(ApplicationStatus.HIRED)}
              >
                <Star className="size-4" />
                Mark as Hired
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                disabled={status === ApplicationStatus.REJECTED || isUpdating}
                onClick={() => handleStatusChange(ApplicationStatus.REJECTED)}
              >
                <X className="size-4" />
                Reject
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
