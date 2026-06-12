'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useMessages, useMyConversations, useSendMessage } from '@/hooks/useMarketplace';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export default function MessagesPage() {
  const { data: conversations = [], isLoading } = useMyConversations();
  const [activeId, setActiveId] = useState<string | undefined>();
  const [body, setBody] = useState('');
  const selectedId = activeId ?? conversations[0]?.id;
  const { data: messages = [] } = useMessages(selectedId);
  const sendMessage = useSendMessage();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardContent className="space-y-2 p-3">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActiveId(conversation.id)}
              className={`w-full rounded-lg p-3 text-left text-sm transition-colors ${
                selectedId === conversation.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              }`}
            >
              <p className="font-medium">{conversation.clientName} / {conversation.freelancerName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(conversation.lastMessageAt)}</p>
            </button>
          ))}
          {conversations.length === 0 && <p className="p-3 text-sm text-muted-foreground">No conversations yet.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex min-h-[420px] flex-col gap-4 p-4">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="rounded-lg border p-3">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{message.senderName}</span>
                  <span>{formatDate(message.createdAt)}</span>
                </div>
                <p className="text-sm">{message.body}</p>
              </div>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!selectedId || !body.trim()) return;
              sendMessage.mutate(
                { conversationId: selectedId, body },
                {
                  onSuccess: () => {
                    setBody('');
                    toast.success('Message sent');
                  },
                  onError: () => toast.error('Failed to send message'),
                },
              );
            }}
          >
            <Input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a message" />
            <Button disabled={!selectedId || sendMessage.isPending}>
              <Send className="size-4" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
