'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Send } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const proposalSchema = z.object({
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters'),
  bidAmount: z.coerce.number().positive('Must be a positive number').optional(),
  estimatedDuration: z.string().optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  companyName: string;
  fixedBudget?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  onSubmit: (data: ProposalFormData) => Promise<void>;
}

const DURATION_OPTIONS = ['< 1 week', '1–2 weeks', '2–4 weeks', '1–3 months', '3–6 months', '6+ months'];

export function ProposalDialog({ open, onOpenChange, jobTitle, companyName, fixedBudget, hourlyRateMin, hourlyRateMax, onSubmit }: ProposalDialogProps) {
  const [selectedDuration, setSelectedDuration] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema) as never,
  });

  const handleClose = () => { onOpenChange(false); reset(); setSelectedDuration(''); };

  const onSubmitForm = async (data: ProposalFormData) => {
    await onSubmit({ ...data, estimatedDuration: selectedDuration || data.estimatedDuration });
    handleClose();
  };

  const budgetLabel = fixedBudget ? `Fixed: $${fixedBudget}` : hourlyRateMin || hourlyRateMax ? `$${hourlyRateMin ?? 0}–$${hourlyRateMax ?? '?'}/hr` : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Proposal</DialogTitle>
          <DialogDescription>Applying for <strong>{jobTitle}</strong> at <strong>{companyName}</strong></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5 pt-2">
          {budgetLabel && (
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3 text-sm">
              <DollarSign className="size-4 text-primary" />
              <span className="text-muted-foreground">Client budget: </span>
              <Badge variant="secondary">{budgetLabel}</Badge>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter <span className="text-destructive">*</span></Label>
            <textarea
              id="coverLetter"
              placeholder="Introduce yourself and explain why you're a great fit..."
              className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              {...register('coverLetter')}
            />
            {errors.coverLetter && <p className="text-xs text-destructive">{errors.coverLetter.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bidAmount">Your Bid (USD)</Label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="bidAmount" type="number" placeholder="e.g. 750" className="pl-9" {...register('bidAmount')} />
              </div>
              {errors.bidAmount && <p className="text-xs text-destructive">{errors.bidAmount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Timeline</Label>
              <div className="flex flex-wrap gap-1.5">
                {DURATION_OPTIONS.map((d) => (
                  <button key={d} type="button" onClick={() => setSelectedDuration(d === selectedDuration ? '' : d)}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${selectedDuration === d ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary hover:text-primary'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Send className="size-4" />{isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type { ProposalFormData };
