'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useMessages, useMyConversations, useSendMessage } from '@/hooks/useMarketplace';
import { useAuthStore } from '@/store/authStore';
import { ChatBubble } from '@/components/marketplace/chat-bubble';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { InitialAvatar } from '@/components/marketplace/freelancer-card';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { data: conversations = [], isLoading } = useMyConversations();
  const [activeId, setActiveId] = useState<string | undefined>();
  const [body, setBody] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedId = activeId ?? conversations[0]?.id;
  const activeConversation = conversations.find((c) => c.id === selectedId);
  const { data: messages = [] } = useMessages(selectedId);
  const sendMessage = useSendMessage();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // The other person's name for the active conversation
  const otherName = activeConversation
    ? (user?.role === 'EMPLOYER' ? activeConversation.freelancerName : activeConversation.clientName)
    : null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !body.trim()) return;
    sendMessage.mutate(
      { conversationId: selectedId, body },
      {
        onSuccess: () => setBody(''),
        onError: () => toast.error('Failed to send message'),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-0 lg:gap-4 lg:grid-cols-[300px_1fr] h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Conversations sidebar */}
      <Card className="flex flex-col overflow-hidden">
        <div className="border-b p-4">
          <h2 className="font-semibold flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            Messages
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <MessageSquare className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === selectedId;
              const name = user?.role === 'EMPLOYER' ? conv.freelancerName : conv.clientName;
              return (
                <button key={conv.id} onClick={() => setActiveId(conv.id)}
                  className={cn('w-full flex items-center gap-3 p-3 text-left transition-colors border-b',
                    isActive ? 'bg-primary/5 text-primary' : 'hover:bg-muted/50')}>
                  <InitialAvatar name={name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-muted-foreground truncate">{formatDate(conv.lastMessageAt)}</p>
                  </div>
                  {isActive && <div className="size-2 rounded-full bg-primary shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </Card>

      {/* Chat panel */}
      <Card className="flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 flex items-center gap-3">
          {otherName ? (
            <>
              <InitialAvatar name={otherName} size="sm" />
              <div>
                <p className="font-semibold">{otherName}</p>
                <p className="text-xs text-green-600">Active</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select a conversation</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && selectedId ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <MessageSquare className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isMine={msg.senderName === user?.name}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2 border-t p-3">
          <Input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={selectedId ? `Message ${otherName ?? ''}...` : 'Select a conversation first'}
            disabled={!selectedId}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as never); } }}
            className="flex-1"
          />
          <Button type="submit" disabled={!selectedId || !body.trim() || sendMessage.isPending} size="icon">
            <Send className="size-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
