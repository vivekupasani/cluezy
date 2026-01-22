'use client'

import { useChat } from '@ai-sdk/react';


import { cn } from '@/lib/utils';

import { ChatShare } from './chat-share';
import { CopyButton } from './copy-button';
import { DownloadResponse } from './download-response';
import { RetryButton } from './retry-button';

interface MessageActionsProps {
  message: string
  messageId: string
  reload?: () => Promise<string | null | undefined>
  chatId: string
  enableShare?: boolean
  className?: string
}

export function MessageActions({
  message,
  messageId,
  reload,
  chatId,
  enableShare,
  className
}: MessageActionsProps) {
  const { status } = useChat({
    id: chatId
  })
  const isLoading = status === 'submitted' || status === 'streaming'

  return (
    <div
      className={cn(
        'flex items-center self-end transition-opacity duration-200 mt-2',
        isLoading ? 'opacity-0' : 'opacity-100',
        className
      )}
    >
      {reload && <RetryButton reload={reload} messageId={messageId} />}
      {enableShare && chatId && <ChatShare chatId={chatId} />}
      <CopyButton message={message} />
      <DownloadResponse message={message} chatId={chatId} />
    </div>
  )
}
