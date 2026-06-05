'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { EmptyState } from '@/components/shared/empty-state';
import { toast } from 'sonner';
import { Users, Search, AlertTriangle, Loader2, Ban, CheckCircle } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';
import type { User } from '@/types';

async function fetchAllUsers(): Promise<User[]> {
  const { data } = await axiosInstance.get<{ data: User[] }>('/api/admin/users');
  return data.data;
}

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAllUsers,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      axiosInstance.patch(`/api/admin/users/${id}/status`, {
        isActive: !isActive,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('User status updated');
    },
    onError: () => {
      toast.error('Failed to update user status');
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      axiosInstance.patch(`/api/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated');
    },
    onError: () => {
      toast.error('Failed to update user role');
    },
  });

  const filtered = useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage all platform users.
            </p>
          </div>
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load users</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage all platform users.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!users || users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="There are no registered users on the platform yet."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No users match your search"
          description="Try a different search term."
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const isStatusPending = toggleStatusMutation.isPending;
                const isRolePending = changeRoleMutation.isPending;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {getInitials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.role}
                        onValueChange={(value) =>
                          changeRoleMutation.mutate({ id: u.id, role: String(value) })
                        }
                      >
                        <SelectTrigger className="h-7 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JOB_SEEKER">Job Seeker</SelectItem>
                          <SelectItem value="EMPLOYER">Employer</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={u.isVerified ? 'default' : 'secondary'}
                          className="text-[10px]"
                        >
                          {u.isVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                        <Badge
                          variant={u.isActive ? 'default' : 'destructive'}
                          className="text-[10px]"
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant={u.isActive ? 'destructive' : 'outline'}
                          size="xs"
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: u.id,
                              isActive: u.isActive,
                            })
                          }
                          disabled={isStatusPending}
                        >
                          {isStatusPending ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : u.isActive ? (
                            <Ban className="size-3" />
                          ) : (
                            <CheckCircle className="size-3" />
                          )}
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {users?.length ?? 0} user{users?.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
