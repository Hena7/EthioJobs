'use client';

import { useState } from 'react';
import { Building2, Search } from 'lucide-react';
import { CompanyCard } from '@/components/companies/company-card';
import { CompanyCardSkeleton } from '@/components/shared/loading-skeleton';
import { Input } from '@/components/ui/input';
import { useCompanies } from '@/hooks/useCompanies';
import type { Company } from '@/types';

export default function CompaniesPage() {
  const { data: companies = [], isLoading } = useCompanies();
  const [search, setSearch] = useState('');

  const filtered: Company[] = companies.filter((c) =>
    `${c.name} ${c.industry ?? ''} ${c.location ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent" />

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-teal-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-500 text-primary-foreground shadow-lg">
            <Building2 className="size-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Discover Top <span className="text-primary">Companies</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Explore leading employers across Ethiopia and find the perfect company that matches your career goals.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="company-search"
                placeholder="Search by name, industry, or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 rounded-xl pl-12 pr-4 text-base shadow-sm focus-visible:ring-primary/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Companies</h2>
            {!isLoading && (
              <p className="mt-1 text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? 'company' : 'companies'} found
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Building2 className="size-10" />
            </div>
            <h3 className="text-xl font-semibold">No companies found</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {search
                ? `No companies match "${search}". Try a different search term.`
                : 'No companies are available at the moment. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
