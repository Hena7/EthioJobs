'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { Company } from '@/types';
import type { CompanyFormData } from '@/schemas';

async function fetchCompanies(): Promise<Company[]> {
  const { data } = await axiosInstance.get<{ data: Company[] }>('/api/companies');
  return data.data;
}

async function fetchCompany(id: string): Promise<Company> {
  const { data } = await axiosInstance.get<{ data: Company }>(`/api/companies/${id}`);
  return data.data;
}

async function fetchMyCompany(): Promise<Company> {
  const { data } = await axiosInstance.get<{ data: Company }>('/api/companies/mine');
  return data.data;
}

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompany(id),
    enabled: !!id,
  });
}

export function useMyCompany() {
  return useQuery({
    queryKey: ['my-company'],
    queryFn: fetchMyCompany,
  });
}

export function useUpdateMyCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CompanyFormData) =>
      axiosInstance.put<{ data: Company }>('/api/companies', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}
