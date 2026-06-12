'use client';

import { ShoppingCart, Clock, Star, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { ServiceListing } from '@/types';
import { cn } from '@/lib/utils';
import { InitialAvatar } from './freelancer-card';

interface ServiceCardProps {
  listing: ServiceListing;
  canOrder?: boolean;
  onOrder?: (listing: ServiceListing) => void;
  isOrdering?: boolean;
  className?: string;
}

const categoryColors: Record<string, string> = {
  Design: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800',
  Development: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800',
  Writing: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800',
  Marketing: 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-800',
  Video: 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800',
  Audio: 'bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800',
};

export function ServiceCard({ listing, canOrder, onOrder, isOrdering, className }: ServiceCardProps) {
  const categoryStyle = categoryColors[listing.category] ?? 'bg-primary/10 text-primary';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg flex flex-col',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-teal-500 opacity-0 transition-opacity group-hover:opacity-100" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-base leading-snug line-clamp-2">{listing.title}</h3>
          <Badge className={cn('shrink-0 text-xs', categoryStyle)}>{listing.category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{listing.description}</p>

        {/* Seller info */}
        <div className="flex items-center gap-2">
          <InitialAvatar name={listing.freelancerName} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{listing.freelancerName}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span>Top Rated</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {listing.deliveryDays && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {listing.deliveryDays}d delivery
              </span>
            )}
            <span className="flex items-center gap-1">
              <Package className="size-3.5" />1 service
            </span>
          </div>
          <span className="text-xl font-bold text-primary">${listing.price}</span>
        </div>

        {canOrder !== undefined && (
          <Button
            className="w-full gap-2"
            disabled={!canOrder || isOrdering}
            onClick={() => onOrder?.(listing)}
          >
            <ShoppingCart className="size-4" />
            {isOrdering ? 'Ordering...' : canOrder ? 'Order Service' : 'Login as Employer'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
