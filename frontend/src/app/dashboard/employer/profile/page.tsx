'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema, type CompanyFormData } from '@/schemas';
import { useMyCompany, useUpdateMyCompany } from '@/hooks/useCompanies';
import { LOCATIONS, COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function isProfileComplete(company: { name?: string | null; description?: string | null; industry?: string | null; location?: string | null } | null | undefined): boolean {
  return !!(company?.name && company?.description && company?.industry && company?.location);
}

export default function EmployerProfilePage() {
  const { data: company, isLoading, isError } = useMyCompany();
  const { mutate: updateCompany, isPending } = useUpdateMyCompany();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      logo: '',
      website: '',
      description: '',
      industry: '',
      size: '',
      location: '',
    },
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name ?? '',
        logo: company.logo ?? '',
        website: company.website ?? '',
        description: company.description ?? '',
        industry: company.industry ?? '',
        size: company.size ?? '',
        location: company.location ?? '',
      });
    }
  }, [company, reset]);

  const onSubmit = (data: CompanyFormData) => {
    updateCompany(data, {
      onSuccess: () => toast.success('Company profile updated successfully!'),
      onError: () => toast.error('Failed to update company profile. Please try again.'),
    });
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load company profile</h3>
        <p className="mb-6 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const complete = isProfileComplete(company);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Company Profile</h2>
          <p className="text-sm text-muted-foreground">
            This information is shown publicly to job seekers on the Companies page.
          </p>
        </div>
        {complete ? (
          <Badge className="gap-1.5 bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20 shrink-0">
            <CheckCircle2 className="size-3.5" />
            Profile Complete
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1.5 border-amber-500/40 text-amber-600 bg-amber-500/10 shrink-0">
            <AlertTriangle className="size-3.5" />
            Incomplete
          </Badge>
        )}
      </div>

      {!complete && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">Profile incomplete — you cannot post jobs yet.</p>
            <p className="mt-0.5 text-xs opacity-80">
              Fill in at least your <strong>Company Name</strong>, <strong>Description</strong>, <strong>Industry</strong>, and <strong>Location</strong> to unlock job posting.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Identity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Company Identity</CardTitle>
                <CardDescription>The core details that identify your company.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" placeholder="e.g. Ethio Telecom" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" placeholder="https://..." {...register('logo')} />
                {errors.logo && <p className="text-xs text-destructive">{errors.logo.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Tell job seekers about your company, culture, and mission..."
                className="min-h-[120px]"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Company Details</CardTitle>
                <CardDescription>Industry, size, and location information.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>
                  Industry <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.industry && <p className="text-xs text-destructive">{errors.industry.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Company Size</Label>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Location <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Online Presence</CardTitle>
                <CardDescription>Your company website link.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://yourcompany.com" {...register('website')} />
              {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={!isDirty || isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
