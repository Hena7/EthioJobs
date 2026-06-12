'use client';

import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

interface ChatBubbleProps {
  message: {
    id: string;
    senderName: string;
    body: string;
    createdAt: string;
    readByRecipient?: boolean;
  };
  isMine: boolean;
}

export function ChatBubble({ message, isMine }: ChatBubbleProps) {
  return (
    <div className={cn('flex gap-2 max-w-[80%]', isMine ? 'ml-auto flex-row-reverse' : 'mr-auto')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white mt-auto',
          isMine ? 'bg-primary' : 'bg-muted-foreground',
        )}
      >
        {message.senderName?.[0]?.toUpperCase() ?? '?'}
      </div>

      <div className={cn('flex flex-col gap-1', isMine ? 'items-end' : 'items-start')}>
        <span className="text-xs text-muted-foreground px-1">{message.senderName}</span>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed',
            isMine
              ? 'rounded-tr-sm bg-primary text-primary-foreground'
              : 'rounded-tl-sm bg-muted text-foreground border',
          )}
        >
          {message.body}
        </div>
        <span className="text-xs text-muted-foreground px-1">{formatDate(message.createdAt)}</span>
      </div>
    </div>
  );
}
