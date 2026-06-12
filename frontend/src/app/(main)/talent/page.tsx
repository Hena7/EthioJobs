'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { useCatalog } from '@/hooks/useMarketplace';
import { FreelancerCard } from '@/components/marketplace/freelancer-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { JobSeekerProfile } from '@/types';

const SKILL_FILTERS = ['All', 'React', 'Node.js', 'Python', 'Design', 'Marketing', 'Writing', 'Mobile', 'Data Science'];
const AVAILABILITY_FILTERS = ['Any', 'Full-time', 'Part-time', '< 30 hrs/week'];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'rate_asc', label: 'Rate: Low to High' },
  { value: 'rate_desc', label: 'Rate: High to Low' },
  { value: 'jobs', label: 'Most Jobs Completed' },
];

export default function TalentPage() {
  const { data: listings = [], isLoading } = useCatalog();
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('Any');
  const [sort, setSort] = useState('rating');

  // Derive unique freelancers from catalog listings, including their profile info
  const rawFreelancers: Array<JobSeekerProfile & { userId: string; name: string }> = Array.from(
    new Map(
      listings.map((l) => [
        l.freelancerId,
        {
          userId: l.freelancerId,
          name: l.freelancerName,
          bio: undefined,
          skills: undefined,
          headline: l.title,
          hourlyRate: l.price,
          categories: l.category,
          portfolioLinks: undefined,
          availability: undefined,
          ratingAverage: undefined,
          completedJobs: undefined,
          location: undefined,
          experienceLevel: undefined,
          expectedSalary: undefined,
        } satisfies JobSeekerProfile & { userId: string; name: string },
      ]),
    ).values(),
  );

  // Filter
  const filtered = rawFreelancers.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      (f.headline ?? '').toLowerCase().includes(q) ||
      (f.skills ?? '').toLowerCase().includes(q);
    const matchSkill =
      skillFilter === 'All' ||
      (f.skills ?? '').toLowerCase().includes(skillFilter.toLowerCase()) ||
      (f.categories ?? '').toLowerCase().includes(skillFilter.toLowerCase());
    const matchAvail =
      availFilter === 'Any' || (f.availability ?? '').toLowerCase().includes(availFilter.toLowerCase());
    return matchSearch && matchSkill && matchAvail;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'rating') return (b.ratingAverage ?? 0) - (a.ratingAverage ?? 0);
    if (sort === 'rate_asc') return (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0);
    if (sort === 'rate_desc') return (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0);
    if (sort === 'jobs') return (b.completedJobs ?? 0) - (a.completedJobs ?? 0);
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Find Talent</h1>
        <p className="text-muted-foreground">Browse verified freelancers ready to help with your project.</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, skill, or headline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
        <Select value={availFilter} onValueChange={(val) => setAvailFilter(String(val))}>
          <SelectTrigger className="h-10 w-full sm:w-44">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABILITY_FILTERS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(val) => setSort(String(val))}>
          <SelectTrigger className="h-10 w-full sm:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Skill chips */}
      <div className="flex flex-wrap gap-2">
        {SKILL_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setSkillFilter(s)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              skillFilter === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary hover:text-primary'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4" />
        {isLoading ? 'Loading...' : `${sorted.length} freelancer${sorted.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((f) => (
            <FreelancerCard key={f.userId} profile={f} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <Users className="size-10 text-muted-foreground" />
          <p className="font-medium">No freelancers found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
          <Button variant="outline" onClick={() => { setSearch(''); setSkillFilter('All'); setAvailFilter('Any'); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
