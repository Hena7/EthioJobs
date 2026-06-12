'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { useMyProposals } from '@/hooks/useMarketplace';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export default function MyProposalsPage() {
  const { data: proposals = [], isLoading } = useMyProposals();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Proposals</h2>
          <p className="text-sm text-muted-foreground">Track freelance bids and client decisions.</p>
        </div>
        <Link href="/jobs">
          <Button>
            <Send className="size-4" />
            Find Work
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {proposals.map((proposal) => (
          <Card key={proposal.id}>
            <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{proposal.jobTitle}</h3>
                  <Badge variant={proposal.status === 'HIRED' ? 'default' : 'secondary'}>{proposal.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${proposal.bidAmount ?? 0} &middot; {proposal.estimatedDuration || 'Timeline open'} &middot; {formatDate(proposal.submittedAt)}
                </p>
              </div>
              <Link href={`/jobs/${proposal.jobId}`}>
                <Button variant="outline">View Job</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {proposals.length === 0 && (
        <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No proposals submitted yet.</div>
      )}
    </div>
  );
}
