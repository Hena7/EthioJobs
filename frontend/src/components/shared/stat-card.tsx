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
  blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  green: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  red: 'bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20',
  yellow: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  purple: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
  indigo: 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  default: 'bg-muted border text-muted-foreground',
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
        'group relative overflow-hidden rounded-xl border bg-card/90 backdrop-blur-sm p-6 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30',
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
