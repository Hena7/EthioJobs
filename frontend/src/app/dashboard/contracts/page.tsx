'use client';

import { CheckCircle2, CircleDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useMyContracts, useUpdateContractStatus, useUpdateMilestoneStatus } from '@/hooks/useMarketplace';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export default function ContractsPage() {
  const { data: contracts = [], isLoading } = useMyContracts();
  const updateContract = useUpdateContractStatus();
  const updateMilestone = useUpdateMilestoneStatus();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Contracts</h2>
        <p className="text-sm text-muted-foreground">Manage fixed-price milestones and hourly work.</p>
      </div>
      {contracts.map((contract) => (
        <Card key={contract.id}>
          <CardHeader>
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle>{contract.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {contract.clientName} and {contract.freelancerName} &middot; {contract.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{contract.status}</Badge>
                <Button
                  variant="outline"
                  disabled={contract.status === 'COMPLETED' || updateContract.isPending}
                  onClick={() =>
                    updateContract.mutate(
                      { contractId: contract.id, status: 'COMPLETED' },
                      {
                        onSuccess: () => toast.success('Contract completed'),
                        onError: () => toast.error('Failed to update contract'),
                      },
                    )
                  }
                >
                  <CheckCircle2 className="size-4" />
                  Complete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Budget ${contract.budget ?? 0} {contract.hourlyRate ? `&middot; $${contract.hourlyRate}/hr` : ''} &middot; Started {contract.startDate ? formatDate(contract.startDate) : 'recently'}
            </div>
            {contract.milestones.map((milestone) => (
              <div key={milestone.id} className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{milestone.title}</p>
                  <p className="text-sm text-muted-foreground">${milestone.amount} &middot; {milestone.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['FUNDED', 'SUBMITTED', 'APPROVED', 'RELEASED'].map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      disabled={milestone.status === status || updateMilestone.isPending}
                      onClick={() =>
                        updateMilestone.mutate(
                          { milestoneId: milestone.id, status },
                          {
                            onSuccess: () => toast.success('Milestone updated'),
                            onError: () => toast.error('Failed to update milestone'),
                          },
                        )
                      }
                    >
                      <CircleDollarSign className="size-3.5" />
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      {contracts.length === 0 && (
        <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">No contracts yet.</div>
      )}
    </div>
  );
}
