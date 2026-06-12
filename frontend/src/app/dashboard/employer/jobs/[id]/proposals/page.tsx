'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { UserCheck, MessageSquare, XCircle, ChevronDown, ChevronUp, Users, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useHireProposal, useJobProposals, useUpdateProposalStatus } from '@/hooks/useMarketplace';
import { HireDialog } from '@/components/marketplace/hire-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Proposal } from '@/types';
import { cn } from '@/lib/utils';
import { InitialAvatar } from '@/components/marketplace/freelancer-card';

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: 'bg-blue-500/10 text-blue-600 border-blue-200',
  SHORTLISTED: 'bg-amber-500/10 text-amber-600 border-amber-200',
  INTERVIEWING: 'bg-purple-500/10 text-purple-600 border-purple-200',
  HIRED: 'bg-green-500/10 text-green-600 border-green-200',
  REJECTED: 'bg-red-500/10 text-red-600 border-red-200',
};

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [expanded, setExpanded] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const updateStatus = useUpdateProposalStatus();
  const hireProposal = useHireProposal();

  const handleHire = async (payload: { type: string; budget?: number; hourlyRate?: number }) => {
    await hireProposal.mutateAsync(
      { proposalId: proposal.id, ...payload },
      { onSuccess: () => toast.success('Contract started! 🎉'), onError: () => toast.error('Failed to create contract') },
    );
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <InitialAvatar name={proposal.freelancerName} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">{proposal.freelancerName}</h3>
                <Badge className={cn('text-xs', STATUS_STYLES[proposal.status] ?? '')}>{proposal.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {proposal.bidAmount ? `$${proposal.bidAmount}` : 'Rate open'}
                {proposal.estimatedDuration && ` · ${proposal.estimatedDuration}`}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="shrink-0 gap-1">
              {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              {expanded ? 'Less' : 'More'}
            </Button>
          </div>

          {/* Cover letter preview */}
          <p className={cn('text-sm text-muted-foreground', !expanded && 'line-clamp-2')}>
            {proposal.coverLetter}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 border-t pt-3">
            <Button size="sm" variant="outline" disabled={updateStatus.isPending}
              onClick={() => updateStatus.mutate({ proposalId: proposal.id, status: 'SHORTLISTED' }, { onSuccess: () => toast.success('Shortlisted') })}>
              <UserCheck className="size-4" /> Shortlist
            </Button>
            <Button size="sm" variant="outline" disabled={updateStatus.isPending}
              onClick={() => updateStatus.mutate({ proposalId: proposal.id, status: 'INTERVIEWING' }, { onSuccess: () => toast.success('Marked for interview') })}>
              <MessageSquare className="size-4" /> Interview
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setHireOpen(true)} disabled={proposal.status === 'HIRED'}>
              <Send className="size-4" /> {proposal.status === 'HIRED' ? 'Hired' : 'Hire'}
            </Button>
            <Button size="sm" variant="destructive" disabled={updateStatus.isPending || proposal.status === 'REJECTED'}
              onClick={() => updateStatus.mutate({ proposalId: proposal.id, status: 'REJECTED' }, { onSuccess: () => toast.success('Rejected') })}>
              <XCircle className="size-4" /> Reject
            </Button>
          </div>
        </CardContent>
      </Card>

      <HireDialog
        open={hireOpen}
        onOpenChange={setHireOpen}
        freelancerName={proposal.freelancerName}
        bidAmount={proposal.bidAmount}
        onHire={handleHire}
      />
    </>
  );
}

export default function JobProposalsPage() {
  const params = useParams<{ id: string }>();
  const { data: proposals = [], isLoading } = useJobProposals(params.id);
  const [filter, setFilter] = useState<string>('ALL');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    );
  }

  const STATUS_TABS = ['ALL', 'SUBMITTED', 'SHORTLISTED', 'INTERVIEWING', 'HIRED', 'REJECTED'];
  const filtered = filter === 'ALL' ? proposals : proposals.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Proposals</h2>
          <p className="text-sm text-muted-foreground">{proposals.length} total · Review and hire the best fit.</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="size-4" />{proposals.length} applicants
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map((s) => {
          const count = s === 'ALL' ? proposals.length : proposals.filter((p) => p.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filter === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}>
              {s} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <Users className="size-10 text-muted-foreground" />
          <p className="font-medium">No proposals {filter !== 'ALL' ? `with status "${filter}"` : 'yet'}</p>
        </div>
      )}
    </div>
  );
}
