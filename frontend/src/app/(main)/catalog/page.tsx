'use client';

import { useState } from 'react';
import { Search, Store, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCatalog, useOrderListing } from '@/hooks/useMarketplace';
import { useAuthStore } from '@/store/authStore';
import { ServiceCard } from '@/components/marketplace/service-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { ServiceListing } from '@/types';

const CATEGORY_TABS = ['All', 'Development', 'Design', 'Writing', 'Marketing', 'Video', 'Audio', 'Data'];

export default function CatalogPage() {
  const { data: listings = [], isLoading } = useCatalog();
  const { user } = useAuthStore();
  const orderListing = useOrderListing();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const canOrder = user?.role === 'EMPLOYER';

  const filtered = listings.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.freelancerName.toLowerCase().includes(q);
    const matchCategory = activeCategory === 'All' || l.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleOrder = (listing: ServiceListing) => {
    orderListing.mutate(
      { listingId: listing.id, budget: listing.price },
      {
        onSuccess: () => toast.success('Order placed! Contract started.'),
        onError: () => toast.error('Failed to order service'),
      },
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingBag className="size-8 text-primary" />
          Service Catalog
        </h1>
        <p className="text-muted-foreground">Browse fixed-scope services from top freelancers. Order directly and get started today.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search services, skills, or sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-10 pr-4"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {isLoading ? 'Loading...' : `${filtered.length} service${filtered.length !== 1 ? 's' : ''} available`}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((listing) => (
            <ServiceCard
              key={listing.id}
              listing={listing}
              canOrder={canOrder}
              onOrder={handleOrder}
              isOrdering={orderListing.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <Store className="size-10 text-muted-foreground" />
          <p className="font-medium">No services found</p>
          <p className="text-sm text-muted-foreground">Try a different category or search term.</p>
          <Button variant="outline" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
            Clear Filters
          </Button>
        </div>
      )}

      {!canOrder && user && (
        <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground text-center">
          Only employer accounts can order services.
        </div>
      )}
    </div>
  );
}
