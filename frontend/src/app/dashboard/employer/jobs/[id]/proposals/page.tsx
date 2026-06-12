'use client';

import { useParams } from 'next/navigation';
import { MessageSquare, UserCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useHireProposal, useJobProposals, useUpdateProposalStatus } from '@/hooks/useMarketplace';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobProposalsPage() {
  const params = useParams<{ id: string }>();
  const { data: proposals = [], isLoading } = useJobProposals(params.id);
  const updateStatus = useUpdateProposalStatus();
  const hireProposal = useHireProposal();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Proposals</h2>
        <p className="text-sm text-muted-foreground">Shortlist, interview, reject, or hire freelancers.</p>
      </div>
      {proposals.map((proposal) => (
        <Card key={proposal.id}>
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-semibold">{proposal.freelancerName}</h3>
                <p className="text-sm text-muted-foreground">
                  ${proposal.bidAmount ?? 0} &middot; {proposal.estimatedDuration || 'Timeline open'}
                </p>
              </div>
              <Badge>{proposal.status}</Badge>
            </div>
            <p className="text-sm">{proposal.coverLetter}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate(
                    { proposalId: proposal.id, status: 'SHORTLISTED' },
                    { onSuccess: () => toast.success('Proposal shortlisted') },
                  )
                }
              >
                <UserCheck className="size-4" />
                Shortlist
              </Button>
              <Button
                variant="outline"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate(
                    { proposalId: proposal.id, status: 'INTERVIEWING' },
                    { onSuccess: () => toast.success('Marked for interview') },
                  )
                }
              >
                <MessageSquare className="size-4" />
                Interview
              </Button>
              <Button
                disabled={hireProposal.isPending}
                onClick={() =>
                  hireProposal.mutate(
                    { proposalId: proposal.id, type: 'FIXED_PRICE', budget: proposal.bidAmount },
                    { onSuccess: () => toast.success('Contract started') },
                  )
                }
              >
                Hire
              </Button>
              <Button
                variant="destructive"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate(
                    { proposalId: proposal.id, status: 'REJECTED' },
                    { onSuccess: () => toast.success('Proposal rejected') },
                  )
                }
              >
                <XCircle className="size-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {proposals.length === 0 && (
        <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No proposals yet.</div>
      )}
    </div>
  );
}
