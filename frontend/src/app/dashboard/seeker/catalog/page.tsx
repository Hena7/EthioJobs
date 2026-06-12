'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateListing, useMyListings } from '@/hooks/useMarketplace';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyCatalogPage() {
  const { data: listings = [], isLoading } = useMyListings();
  const createListing = useCreateListing();
  const [form, setForm] = useState({ title: '', category: '', description: '', price: '', deliveryDays: '' });

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Catalog Listings</h2>
        <p className="text-sm text-muted-foreground">Publish fixed-scope services clients can order.</p>
      </div>
      <Card>
        <CardContent className="p-5">
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              createListing.mutate(
                {
                  title: form.title,
                  category: form.category,
                  description: form.description,
                  price: Number(form.price),
                  deliveryDays: form.deliveryDays ? Number(form.deliveryDays) : undefined,
                },
                {
                  onSuccess: () => {
                    setForm({ title: '', category: '', description: '', price: '', deliveryDays: '' });
                    toast.success('Listing published');
                  },
                  onError: () => toast.error('Failed to publish listing'),
                },
              );
            }}
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Delivery Days</Label>
              <Input type="number" value={form.deliveryDays} onChange={(event) => setForm({ ...form, deliveryDays: event.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            </div>
            <div className="md:col-span-2">
              <Button disabled={createListing.isPending}>
                <PlusCircle className="size-4" />
                Publish Listing
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm text-muted-foreground">{listing.category} &middot; ${listing.price}</p>
              <p className="mt-2 line-clamp-3 text-sm">{listing.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
