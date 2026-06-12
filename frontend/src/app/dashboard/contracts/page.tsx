'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, CircleDollarSign, Plus, Clock } from 'lucide-react';
import {
  useMyContracts, useUpdateContractStatus, useUpdateMilestoneStatus, useAddMilestone
} from '@/hooks/useMarketplace';
import { useAuthStore } from '@/store/authStore';
import { MilestoneTracker } from '@/components/marketplace/milestone-tracker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-500/10 text-green-600 border-green-200',
  PAUSED: 'bg-amber-500/10 text-amber-600 border-amber-200',
  COMPLETED: 'bg-blue-500/10 text-blue-600 border-blue-200',
  CANCELLED: 'bg-red-500/10 text-red-600 border-red-200',
};

const TABS = ['ALL', 'ACTIVE', 'COMPLETED', 'PAUSED'] as const;

export default function ContractsPage() {
  const { user } = useAuthStore();
  const { data: contracts = [], isLoading } = useMyContracts();
  const updateContract = useUpdateContractStatus();
  const updateMilestone = useUpdateMilestoneStatus();
  const addMilestone = useAddMilestone();

  const [tab, setTab] = useState<string>('ALL');
  const [addMilestoneOpen, setAddMilestoneOpen] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({ title: '', amount: '', description: '' });

  const isEmployer = user?.role === 'EMPLOYER';
  const isFreelancer = user?.role === 'FREELANCER' || user?.role === 'JOB_SEEKER';

  const filtered = tab === 'ALL' ? contracts : contracts.filter((c) => c.status === tab);

  const handleMilestoneStatus = (milestoneId: string, status: string) => {
    updateMilestone.mutate(
      { milestoneId, status },
      {
        onSuccess: () => toast.success('Milestone updated'),
        onError: () => toast.error('Failed to update milestone'),
      },
    );
  };

  const handleAddMilestone = (contractId: string) => {
    if (!milestoneForm.title || !milestoneForm.amount) {
      toast.error('Title and amount are required');
      return;
    }
    addMilestone.mutate(
      { contractId, title: milestoneForm.title, amount: Number(milestoneForm.amount), description: milestoneForm.description || undefined },
      {
        onSuccess: () => {
          toast.success('Milestone added');
          setAddMilestoneOpen(null);
          setMilestoneForm({ title: '', amount: '', description: '' });
        },
        onError: () => toast.error('Failed to add milestone'),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Contracts</h2>
        <p className="text-sm text-muted-foreground">Track milestones, submit work, and release payments.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(['ALL', 'ACTIVE', 'COMPLETED', 'PAUSED'] as const).map((s) => {
          const count = s === 'ALL' ? contracts.length : contracts.filter((c) => c.status === s).length;
          return (
            <button key={s} onClick={() => setTab(s)}
              className={cn('rounded-lg border p-3 text-center transition-colors', tab === s ? 'border-primary bg-primary/5 text-primary' : 'hover:border-primary/50')}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground capitalize">{s.toLowerCase()}</p>
            </button>
          );
        })}
      </div>

      {/* Contracts list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
          No contracts yet.
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((contract) => (
            <Card key={contract.id} className="overflow-hidden">
              <div className={cn('h-1.5', contract.status === 'ACTIVE' ? 'bg-green-500' : contract.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-muted')} />
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{contract.title}</CardTitle>
                      <Badge className={cn('text-xs', STATUS_COLORS[contract.status])}>{contract.status}</Badge>
                      <Badge variant="outline" className="text-xs">{contract.type.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {contract.clientName} ↔ {contract.freelancerName}
                      {contract.startDate && ` · Started ${formatDate(contract.startDate)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      {contract.budget && <p className="text-lg font-bold">${contract.budget}</p>}
                      {contract.hourlyRate && <p className="text-sm text-muted-foreground">${contract.hourlyRate}/hr</p>}
                    </div>
                    {contract.status !== 'COMPLETED' && (
                      <Button size="sm" variant="outline" disabled={updateContract.isPending}
                        onClick={() => updateContract.mutate({ contractId: contract.id, status: 'COMPLETED' }, { onSuccess: () => toast.success('Contract completed') })}>
                        <CheckCircle2 className="size-4" /> Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Milestones */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Milestones</h4>
                    {isEmployer && contract.status === 'ACTIVE' && (
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setAddMilestoneOpen(contract.id)}>
                        <Plus className="size-3.5" /> Add
                      </Button>
                    )}
                  </div>
                  <MilestoneTracker
                    milestones={contract.milestones}
                    isEmployer={isEmployer}
                    isFreelancer={isFreelancer}
                    onUpdateStatus={handleMilestoneStatus}
                    isUpdating={updateMilestone.isPending}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Milestone Dialog */}
      <Dialog open={!!addMilestoneOpen} onOpenChange={() => setAddMilestoneOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g. Design mockups" value={milestoneForm.title}
                onChange={(e) => setMilestoneForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <div className="relative">
                <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" placeholder="e.g. 500" className="pl-9" value={milestoneForm.amount}
                  onChange={(e) => setMilestoneForm((f) => ({ ...f, amount: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input placeholder="Brief description of deliverables" value={milestoneForm.description}
                onChange={(e) => setMilestoneForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setAddMilestoneOpen(null)}>Cancel</Button>
              <Button disabled={addMilestone.isPending} onClick={() => addMilestoneOpen && handleAddMilestone(addMilestoneOpen)}>
                {addMilestone.isPending ? 'Adding...' : 'Add Milestone'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
