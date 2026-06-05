'use client';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { Company } from '@/types';

async function fetchCompanies(): Promise<Company[]> {
  const { data } = await axiosInstance.get<{ data: Company[] }>('/api/companies');
  return data.data;
}

async function fetchCompany(id: string): Promise<Company> {
  const { data } = await axiosInstance.get<{ data: Company }>(`/api/companies/${id}`);
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
