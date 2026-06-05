'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { profileSchema, type ProfileFormData } from '@/schemas';
import { useAuthStore } from '@/store/authStore';
import { LOCATIONS, EXPERIENCE_LEVEL_OPTIONS } from '@/lib/constants';
import { ProfileSkeleton } from '@/components/shared/loading-skeleton';
import { FileUpload } from '@/components/shared/file-upload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { toast } from 'sonner';
import { User, FileText, Download, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { Resume, JobSeekerProfile } from '@/types';

async function fetchProfile(): Promise<JobSeekerProfile> {
  const { data } = await axiosInstance.get<{ data: JobSeekerProfile }>('/api/profile');
  return data.data;
}

async function fetchResumes(): Promise<Resume[]> {
  const { data } = await axiosInstance.get<{ data: Resume[] }>('/api/resumes/mine');
  return data.data;
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });

  const {
    data: resumes,
    isLoading: resumesLoading,
    error: resumesError,
  } = useQuery({ queryKey: ['resumes'], queryFn: fetchResumes });

  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as never,
    defaultValues: {
      bio: '',
      skills: '',
      location: '',
      experienceLevel: undefined,
      expectedSalary: undefined,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio ?? '',
        skills: profile.skills ?? '',
        location: profile.location ?? '',
        experienceLevel: profile.experienceLevel ?? undefined,
        expectedSalary: profile.expectedSalary ?? undefined,
      });
    }
  }, [profile, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: (formData: ProfileFormData) =>
      axiosInstance.put('/api/profile', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return axiosInstance.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setUploadingFile(null);
      toast.success('Resume uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload resume');
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/resumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted');
    },
    onError: () => {
      toast.error('Failed to delete resume');
    },
  });

  const onSubmit = (formData: ProfileFormData) => {
    updateProfileMutation.mutate(formData);
  };

  const handleFileSelect = useCallback(
    (file: File | null) => {
      setUploadingFile(file);
      if (file) {
        uploadResumeMutation.mutate(file);
      }
    },
    [uploadResumeMutation],
  );

  const isLoading = profileLoading || resumesLoading;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (profileError || resumesError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load profile</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and resume.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and career preferences.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={user?.name ?? ''}
                  disabled
                  className="cursor-not-allowed opacity-60"
                />
                <p className="text-xs text-muted-foreground">Name cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  className="cursor-not-allowed opacity-60"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell employers about yourself..."
                className="min-h-[100px]"
                {...register('bio')}
              />
              {errors.bio && (
                <p className="text-xs text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g. JavaScript, Python, Project Management"
                {...register('skills')}
              />
              <p className="text-xs text-muted-foreground">
                Separate skills with commas
              </p>
              {errors.skills && (
                <p className="text-xs text-destructive">{errors.skills.message}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Location</Label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(val) => field.onChange(val || undefined)}
                    >
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
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Controller
                  name="experienceLevel"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(val) => field.onChange(val || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.experienceLevel && (
                  <p className="text-xs text-destructive">
                    {errors.experienceLevel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedSalary">Expected Salary ($)</Label>
                <Input
                  id="expectedSalary"
                  type="number"
                  placeholder="e.g. 50000"
                  {...register('expectedSalary')}
                />
                {errors.expectedSalary && (
                  <p className="text-xs text-destructive">
                    {errors.expectedSalary.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting || updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Resume</CardTitle>
              <CardDescription>
                Upload your resume (PDF, max 5MB). Employers will see your latest resume.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumes && resumes.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Uploaded Resumes
              </p>
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{resume.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(resume.fileSize)} &middot;{' '}
                      {formatDate(resume.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Download"
                      className={buttonVariants({ variant: 'outline', size: 'icon-xs' })}
                    >
                      <Download className="size-3.5" />
                    </a>
                    <Button
                      variant="destructive"
                      size="icon-xs"
                      onClick={() => deleteResumeMutation.mutate(resume.id)}
                      disabled={deleteResumeMutation.isPending}
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {resumes && resumes.length > 0 ? 'Upload New Resume' : 'Upload Resume'}
            </p>
            <FileUpload
              accept=".pdf"
              maxSize={5 * 1024 * 1024}
              onFileSelect={handleFileSelect}
            />
            {uploadResumeMutation.isPending && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Uploading resume...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
