'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { Bookmark } from '@/types';

async function fetchMyBookmarks(): Promise<Bookmark[]> {
  const { data } = await axiosInstance.get<{ data: Bookmark[] }>(
    '/api/bookmarks/mine',
  );
  return data.data;
}

export function useMyBookmarks() {
  return useQuery({
    queryKey: ['my-bookmarks'],
    queryFn: fetchMyBookmarks,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await axiosInstance.post(`/api/bookmarks/${jobId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookmarks'] });
    },
  });
}
