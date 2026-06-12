'use client';

import { ShoppingCart, Store } from 'lucide-react';
import { toast } from 'sonner';
import { useCatalog, useOrderListing } from '@/hooks/useMarketplace';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CatalogPage() {
  const { data: listings = [], isLoading } = useCatalog();
  const { user } = useAuthStore();
  const orderListing = useOrderListing();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
        <p className="text-sm text-muted-foreground">Fixed-scope services from freelancers.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <Badge variant="secondary">{listing.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="line-clamp-4 text-sm text-muted-foreground">{listing.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{listing.freelancerName}</span>
                <span className="text-lg font-semibold">${listing.price}</span>
              </div>
              <Button
                className="w-full"
                disabled={user?.role !== 'EMPLOYER' || orderListing.isPending}
                onClick={() =>
                  orderListing.mutate(
                    { listingId: listing.id, budget: listing.price },
                    {
                      onSuccess: () => toast.success('Catalog order started'),
                      onError: () => toast.error('Failed to order service'),
                    },
                  )
                }
              >
                <ShoppingCart className="size-4" />
                Order Service
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {listings.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border py-12 text-center">
          <Store className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No catalog services yet.</p>
        </div>
      )}
    </div>
  );
}
