'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  BadgeCheck,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/jobs/job-card';
import { JobCardSkeleton } from '@/components/shared/loading-skeleton';
import { DetailSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { useCompany } from '@/hooks/useCompanies';
import { useJobs } from '@/hooks/useJobs';
import { getInitials } from '@/lib/utils';

export default function CompanyProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: company, isLoading, error } = useCompany(id);
  const { data: jobsData, isLoading: jobsLoading } = useJobs({ page: 0 });

  const companyJobs = jobsData?.content?.filter((j) => j.companyId === id) ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <DetailSkeleton />
        <div className="mt-8 space-y-4">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={AlertCircle}
          title="Company not found"
          description="The company you are looking for does not exist or has been removed."
          actionLabel="Browse Companies"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/companies"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Companies
      </Link>

      <div className="rounded-lg border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          {company.logo ? (
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="size-20 rounded-xl object-cover sm:size-24"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-xl bg-muted text-2xl font-bold text-muted-foreground sm:size-24">
              {getInitials(company.name)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
              {company.isVerified && (
                <BadgeCheck className="size-5 text-blue-500" />
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {company.industry && (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="size-4" />
                  {company.industry}
                </span>
              )}
              {company.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4" />
                  {company.location}
                </span>
              )}
              {company.size && (
                <span className="inline-flex items-center gap-1">
                  <Users className="size-4" />
                  {company.size} employees
                </span>
              )}
              {company.jobCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="size-4" />
                  {company.jobCount} active jobs
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {company.isVerified && (
                <Badge variant="default" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
                  <BadgeCheck className="mr-1 size-3" />
                  Verified
                </Badge>
              )}
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <Globe className="size-4" />
                Visit Website
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>

        {company.description && (
          <div className="mt-6 border-t pt-6">
            <h2 className="mb-3 text-lg font-semibold">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {company.description}
            </p>
          </div>
        )}
      </div>

      <section className="mt-8">
        <h2 className="mb-6 text-xl font-bold">
          Active Jobs at {company.name}
        </h2>
        {jobsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : companyJobs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {companyJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No active jobs"
            description="This company has no active job listings right now."
          />
        )}
      </section>
    </div>
  );
}
