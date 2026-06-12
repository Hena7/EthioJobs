'use client';

import { useState } from 'react';
import { DollarSign, Clock } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  freelancerName: string;
  bidAmount?: number;
  onHire: (payload: { type: string; budget?: number; hourlyRate?: number }) => Promise<void>;
}

export function HireDialog({ open, onOpenChange, freelancerName, bidAmount, onHire }: HireDialogProps) {
  const [contractType, setContractType] = useState<'FIXED_PRICE' | 'HOURLY'>('FIXED_PRICE');
  const [budget, setBudget] = useState(bidAmount?.toString() ?? '');
  const [hourlyRate, setHourlyRate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHire = async () => {
    setLoading(true);
    try {
      await onHire({
        type: contractType,
        budget: contractType === 'FIXED_PRICE' ? Number(budget) : undefined,
        hourlyRate: contractType === 'HOURLY' ? Number(hourlyRate) : undefined,
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hire {freelancerName}</DialogTitle>
          <DialogDescription>Create a contract and start working together.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label>Contract Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['FIXED_PRICE', 'HOURLY'] as const).map((t) => (
                <button key={t} type="button" onClick={() => setContractType(t)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors ${contractType === t ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'}`}>
                  {t === 'FIXED_PRICE' ? <DollarSign className="size-5" /> : <Clock className="size-5" />}
                  <span className="font-medium">{t === 'FIXED_PRICE' ? 'Fixed Price' : 'Hourly'}</span>
                </button>
              ))}
            </div>
          </div>
          {contractType === 'FIXED_PRICE' ? (
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget (USD)</Label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="budget" type="number" placeholder="e.g. 1500" className="pl-9" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (USD/hr)</Label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="hourlyRate" type="number" placeholder="e.g. 50" className="pl-9" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button disabled={loading || (!budget && !hourlyRate)} onClick={handleHire}>
              {loading ? 'Starting contract...' : 'Start Contract'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
