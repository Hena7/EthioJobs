'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { Notification } from '@/types';

async function fetchMyNotifications(): Promise<Notification[]> {
  const { data } = await axiosInstance.get<{ data: Notification[] }>(
    '/api/notifications/mine',
  );
  return data.data;
}

export function useMyNotifications() {
  return useQuery({
    queryKey: ['my-notifications'],
    queryFn: fetchMyNotifications,
    refetchInterval: 30000,
  });
}

export function useUnreadCount() {
  const { data: notifications } = useMyNotifications();
  return notifications?.filter((n) => !n.isRead).length ?? 0;
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axiosInstance.patch('/api/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    },
  });
}
