'use client';

import { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import {
  Search,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  X,
  MapPin,
  Briefcase,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  JOB_TYPE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  CATEGORIES,
  LOCATIONS,
} from '@/lib/constants';
import type { JobFilters } from '@/types';

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onClear: () => void;
  className?: string;
}

const SALARY_RANGES = [
  { label: 'Any Salary', min: undefined, max: undefined },
  { label: 'Under 10,000 ETB', min: undefined, max: 10000 },
  { label: '10,000 - 30,000 ETB', min: 10000, max: 30000 },
  { label: '30,000 - 50,000 ETB', min: 30000, max: 50000 },
  { label: '50,000 - 100,000 ETB', min: 50000, max: 100000 },
  { label: '100,000+ ETB', min: 100000, max: undefined },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Highest Salary', value: 'salary_desc' },
  { label: 'Most Relevant', value: 'relevance' },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, icon, defaultOpen = true, children }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mb-2 flex w-full items-center justify-between text-sm font-medium text-foreground"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown
          className={cn(
            'size-4 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

export function JobFiltersPanel({
  filters,
  onFilterChange,
  onClear,
  className,
}: JobFiltersPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? '')) {
      onFilterChange({ ...filters, search: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters, onFilterChange]);

  const updateFilter = useCallback(
    (key: keyof JobFilters, value: string | undefined) => {
      onFilterChange({ ...filters, [key]: value || undefined });
    },
    [filters, onFilterChange],
  );

  const handleSalaryChange = (label: string) => {
    const range = SALARY_RANGES.find((r) => r.label === label);
    onFilterChange({
      ...filters,
      salaryMin: range?.min,
      salaryMax: range?.max,
    });
  };

  const getSelectedSalaryLabel = () => {
    if (!filters.salaryMin && !filters.salaryMax) return 'Any Salary';
    const match = SALARY_RANGES.find(
      (r) => r.min === filters.salaryMin && r.max === filters.salaryMax,
    );
    return match?.label ?? 'Custom';
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.location ||
    filters.type ||
    filters.experienceLevel ||
    filters.salaryMin ||
    filters.salaryMax ||
    filters.sort;

  const filterContent = (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="h-10 w-full rounded-xl border bg-background/50 pl-9 pr-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 transition-all duration-200"
        />
      </div>

      <FilterSection title="Category" icon={<BarChart3 className="size-4" />}>
        <select
          value={filters.category ?? ''}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Location" icon={<MapPin className="size-4" />}>
        <select
          value={filters.location ?? ''}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Job Type" icon={<Briefcase className="size-4" />}>
        {JOB_TYPE_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              checked={filters.type === opt.value}
              onChange={() =>
                updateFilter(
                  'type',
                  filters.type === opt.value ? undefined : opt.value,
                )
              }
              className="rounded border-gray-300"
            />
            {opt.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection
        title="Experience Level"
        icon={<BarChart3 className="size-4" />}
      >
        <select
          value={filters.experienceLevel ?? ''}
          onChange={(e) =>
            updateFilter('experienceLevel', e.target.value)
          }
          className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Levels</option>
          {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection
        title="Salary Range"
        icon={<DollarSign className="size-4" />}
      >
        {SALARY_RANGES.map((range) => (
          <label
            key={range.label}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              type="radio"
              name="salary"
              checked={getSelectedSalaryLabel() === range.label}
              onChange={() => handleSalaryChange(range.label)}
              className="text-primary"
            />
            {range.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Sort By" icon={<BarChart3 className="size-4" />}>
        <select
          value={filters.sort ?? 'newest'}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="w-full gap-2 text-muted-foreground"
        >
          <RotateCcw className="size-3.5" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter trigger */}
      <div className={cn('lg:hidden', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="gap-2"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              !
            </span>
          )}
        </Button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative ml-auto h-full w-full max-w-sm overflow-y-auto bg-background p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-1 hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className={cn('hidden lg:block', className)}>
        <div className="rounded-xl border bg-card/90 backdrop-blur-sm p-6 shadow-sm sticky top-24">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            Filters
          </h2>
          {filterContent}
        </div>
      </div>
    </>
  );
}
