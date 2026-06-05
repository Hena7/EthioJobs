'use client';

import {
  Bell,
  Briefcase,
  FileText,
  UserCheck,
  X,
  Star,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import type { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  JOB_ALERT: Briefcase,
  APPLICATION_UPDATE: FileText,
  STATUS_CHANGE: UserCheck,
  INTERVIEW: Star,
  REJECTION: X,
  GENERAL: AlertCircle,
  default: Bell,
};

function getIcon(type: string): LucideIcon {
  return iconMap[type] || iconMap.default;
}

function getIconColor(type: string): string {
  switch (type) {
    case 'JOB_ALERT':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'APPLICATION_UPDATE':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    case 'STATUS_CHANGE':
      return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    case 'INTERVIEW':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
    case 'REJECTION':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function NotificationItem({
  notification,
  onMarkRead,
  className,
}: NotificationItemProps) {
  const Icon = getIcon(notification.type);

  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.isRead) {
          onMarkRead(notification.id);
        }
      }}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
        !notification.isRead && 'bg-primary/5',
        className,
      )}
    >
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          getIconColor(notification.type),
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm',
              !notification.isRead ? 'font-semibold' : 'font-medium text-muted-foreground',
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="mt-1 block size-2 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}
