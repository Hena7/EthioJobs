'use client';

import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  className?: string;
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  yellow: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  default: 'bg-muted text-muted-foreground',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-lg',
            colorMap[color] || colorMap.default,
          )}
        >
          <Icon className="size-5" />
        </div>
        {trend && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              trend.isPositive ? 'text-emerald-600' : 'text-red-600',
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
