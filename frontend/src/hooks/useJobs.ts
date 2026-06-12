'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { Job, JobFilters, PaginatedResponse } from '@/types';

async function fetchJobs(filters: JobFilters): Promise<PaginatedResponse<Job>> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.location) params.set('location', filters.location);
  if (filters.type) params.set('type', filters.type);
  if (filters.experienceLevel) params.set('experienceLevel', filters.experienceLevel);
  if (filters.salaryMin) params.set('salaryMin', String(filters.salaryMin));
  if (filters.salaryMax) params.set('salaryMax', String(filters.salaryMax));
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', String(filters.page));
  const { data } = await axiosInstance.get<{ data: PaginatedResponse<Job> }>(
    `/api/jobs?${params.toString()}`,
  );
  return data.data;
}

async function fetchJob(id: string): Promise<Job> {
  const { data } = await axiosInstance.get<{ data: Job }>(`/api/jobs/${id}`);
  return data.data;
}

async function fetchMyJobs(): Promise<Job[]> {
  const { data } = await axiosInstance.get<{ data: PaginatedResponse<Job> }>('/api/jobs/mine');
  return data.data.content ?? [];
}

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJob(id),
    enabled: !!id,
  });
}

export function useMyJobs() {
  return useQuery({
    queryKey: ['my-jobs'],
    queryFn: fetchMyJobs,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobData: Partial<Job>) =>
      axiosInstance.post('/api/jobs', jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...jobData }: Partial<Job> & { id: string }) =>
      axiosInstance.put(`/api/jobs/${id}`, jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/jobs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
}

export function useFeaturedJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/api/jobs/${id}/feature`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
  });
}
