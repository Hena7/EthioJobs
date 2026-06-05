'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { Application } from '@/types';

async function fetchMyApplications(): Promise<Application[]> {
  const { data } = await axiosInstance.get<{ data: Application[] }>(
    '/api/applications/mine',
  );
  return data.data;
}

async function fetchJobApplications(jobId: string): Promise<Application[]> {
  const { data } = await axiosInstance.get<{ data: Application[] }>(
    `/api/jobs/${jobId}/applications`,
  );
  return data.data;
}

export function useMyApplications() {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: fetchMyApplications,
  });
}

export function useJobApplications(jobId: string) {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => fetchJobApplications(jobId),
    enabled: !!jobId,
  });
}

export function useApply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      formData,
    }: {
      jobId: string;
      formData: FormData;
    }) => axiosInstance.post(`/api/jobs/${jobId}/apply`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => axiosInstance.patch(`/api/applications/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
}
