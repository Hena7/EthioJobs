'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type {
  Conversation,
  MarketplaceContract,
  Message,
  PaginatedResponse,
  Proposal,
  ServiceListing,
} from '@/types';

type PageResult<T> = PaginatedResponse<T>;

export function useMyProposals() {
  return useQuery({
    queryKey: ['marketplace', 'proposals', 'mine'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: PageResult<Proposal> }>('/api/marketplace/proposals/mine');
      return data.data.content ?? [];
    },
  });
}

export function useJobProposals(jobId?: string) {
  return useQuery({
    queryKey: ['marketplace', 'proposals', 'job', jobId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: PageResult<Proposal> }>(`/api/marketplace/jobs/${jobId}/proposals`);
      return data.data.content ?? [];
    },
    enabled: !!jobId,
  });
}

export function useSubmitProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, ...payload }: { jobId: string; coverLetter: string; bidAmount?: number; estimatedDuration?: string; attachments?: string }) =>
      axiosInstance.post(`/api/marketplace/jobs/${jobId}/proposals`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'proposals'] });
    },
  });
}

export function useUpdateProposalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ proposalId, status }: { proposalId: string; status: string }) =>
      axiosInstance.patch(`/api/marketplace/proposals/${proposalId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'proposals'] });
    },
  });
}

export function useHireProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ proposalId, ...payload }: { proposalId: string; type: string; budget?: number; hourlyRate?: number }) =>
      axiosInstance.post(`/api/marketplace/proposals/${proposalId}/hire`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
  });
}

export function useMyContracts() {
  return useQuery({
    queryKey: ['marketplace', 'contracts', 'mine'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: PageResult<MarketplaceContract> }>('/api/marketplace/contracts/mine');
      return data.data.content ?? [];
    },
  });
}

export function useUpdateContractStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, status }: { contractId: string; status: string }) =>
      axiosInstance.patch(`/api/marketplace/contracts/${contractId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketplace', 'contracts'] }),
  });
}

export function useUpdateMilestoneStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, status }: { milestoneId: string; status: string }) =>
      axiosInstance.patch(`/api/marketplace/milestones/${milestoneId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketplace', 'contracts'] }),
  });
}

export function useMyConversations() {
  return useQuery({
    queryKey: ['marketplace', 'conversations', 'mine'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: PageResult<Conversation> }>('/api/marketplace/conversations/mine');
      return data.data.content ?? [];
    },
  });
}

export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: ['marketplace', 'messages', conversationId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: Message[] }>(`/api/marketplace/conversations/${conversationId}/messages`);
      return data.data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: string; body: string }) =>
      axiosInstance.post(`/api/marketplace/conversations/${conversationId}/messages`, { body }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'conversations'] });
    },
  });
}

export function useCatalog() {
  return useQuery({
    queryKey: ['marketplace', 'catalog'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: PageResult<ServiceListing> }>('/api/marketplace/catalog');
      return data.data.content ?? [];
    },
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: ['marketplace', 'catalog', 'mine'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: PageResult<ServiceListing> }>('/api/marketplace/catalog/mine');
      return data.data.content ?? [];
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; category: string; description: string; price: number; deliveryDays?: number }) =>
      axiosInstance.post('/api/marketplace/catalog', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'catalog'] });
    },
  });
}

export function useOrderListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listingId, budget }: { listingId: string; budget?: number }) =>
      axiosInstance.post(`/api/marketplace/catalog/${listingId}/order`, { budget }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketplace', 'contracts'] }),
  });
}
