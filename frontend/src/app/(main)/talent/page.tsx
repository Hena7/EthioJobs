'use client';

import Link from 'next/link';
import { Search, Star } from 'lucide-react';
import { useCatalog } from '@/hooks/useMarketplace';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TalentPage() {
  const { data: listings = [], isLoading } = useCatalog();
  const freelancers = Array.from(new Map(listings.map((listing) => [listing.freelancerId, listing])).values());

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Talent</h1>
        <p className="text-sm text-muted-foreground">Browse freelancers through their published catalog services.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {freelancers.map((listing) => (
          <Card key={listing.freelancerId}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{listing.freelancerName}</h2>
                  <p className="text-sm text-muted-foreground">{listing.title}</p>
                </div>
                <Badge variant="outline">
                  <Star className="mr-1 size-3" />
                  New
                </Badge>
              </div>
              <p className="line-clamp-3 text-sm text-muted-foreground">{listing.description}</p>
              <Link href="/catalog">
                <Button variant="outline" className="w-full">
                  <Search className="size-4" />
                  View Catalog
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
