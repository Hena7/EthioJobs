'use client';

import { useState } from 'react';
import { useMyResumes, useUploadResume, useDeleteResume, type Resume } from '@/hooks/useResumes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUpload } from '@/components/shared/file-upload';
import { FileText, Download, Trash2, AlertTriangle, FileUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

function ResumesSkeleton() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResumesPage() {
  const { data: resumes, isLoading, isError } = useMyResumes();
  const { mutate: uploadResume, isPending: isUploading } = useUploadResume();
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleFileUpload = (file: File | null) => {
    if (!file) return;

    uploadResume(file, {
      onSuccess: () => toast.success('Resume uploaded successfully!'),
      onError: () => toast.error('Failed to upload resume. Please try again.'),
    });
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteResume(id, {
      onSuccess: () => {
        toast.success('Resume deleted successfully.');
        setDeletingId(null);
      },
      onError: () => {
        toast.error('Failed to delete resume.');
        setDeletingId(null);
      },
    });
  };

  if (isLoading) return <ResumesSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load resumes</h3>
        <p className="mb-6 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Resumes</h2>
        <p className="text-sm text-muted-foreground">
          Manage your uploaded resumes. You can use these to quickly apply for jobs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Resume List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uploaded Resumes</CardTitle>
              <CardDescription>You can upload multiple resumes for different roles.</CardDescription>
            </CardHeader>
            <CardContent>
              {resumes && resumes.length > 0 ? (
                <div className="grid gap-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="size-5" />
                        </div>
                        <div>
                          <p className="font-medium">{resume.fileName}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {format(new Date(resume.uploadedAt), 'MMM d, yyyy')}
                            </span>
                            <span className="uppercase">{resume.fileType.split('/').pop()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Download className="size-4" />
                            <span className="sr-only">Download</span>
                          </a>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={isDeleting && deletingId === resume.id}
                          onClick={() => handleDelete(resume.id)}
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-12 text-center border-2 border-dashed rounded-lg">
                  <FileText className="mb-3 size-12 text-muted-foreground/50" />
                  <p className="mb-1 text-sm font-medium">No resumes uploaded yet</p>
                  <p className="text-xs text-muted-foreground">
                    Upload your first resume using the area on the right.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileUp className="size-5 text-primary" />
                <CardTitle className="text-base">Upload New Resume</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="pointer-events-auto relative">
                {isUploading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                    <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="mt-2 text-sm font-medium text-primary">Uploading...</p>
                  </div>
                )}
                <FileUpload
                  accept=".pdf,.doc,.docx"
                  maxSize={5 * 1024 * 1024} // 5MB
                  onFileSelect={handleFileUpload}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
