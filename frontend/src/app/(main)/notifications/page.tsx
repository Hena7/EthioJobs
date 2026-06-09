'use client';

import { useMyNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCircle2, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function NotificationsSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError } = useMyNotifications();
  const { mutate: markAsRead, isPending: isMarking } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const [markingId, setMarkingId] = useState<string | null>(null);

  const unreadCount = notifications?.filter(n => !n.isRead).length ?? 0;

  const handleMarkAsRead = (id: string) => {
    setMarkingId(id);
    markAsRead(id, {
      onSettled: () => setMarkingId(null)
    });
  };

  if (isLoading) return <NotificationsSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-4xl mx-auto px-4">
        <AlertCircle className="mb-4 size-12 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">Failed to load notifications</h3>
        <p className="mb-6 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="size-6 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with your applications and account activity.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="shrink-0"
          >
            <CheckCircle2 className="mr-2 size-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {(!notifications || notifications.length === 0) ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
                <Bell className="size-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                You're all caught up! We'll notify you when there's an update on your account or applications.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "transition-all duration-200 border-l-4",
                notification.isRead 
                  ? "border-l-transparent bg-background" 
                  : "border-l-primary bg-primary/5 shadow-sm"
              )}
            >
              <CardContent className="p-4 sm:p-6 flex gap-4">
                <div className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full mt-1",
                  notification.isRead ? "bg-muted text-muted-foreground" : "bg-primary/20 text-primary"
                )}>
                  {notification.type === 'APPLICATION_STATUS' ? <CheckCircle2 className="size-5" /> : <Bell className="size-5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                    <h4 className={cn(
                      "text-base font-semibold leading-none",
                      !notification.isRead && "text-foreground"
                    )}>
                      {notification.title}
                    </h4>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                      <Clock className="size-3" />
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="shrink-0 flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={isMarking && markingId === notification.id}
                      title="Mark as read"
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8"
                    >
                      <Check className="size-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
