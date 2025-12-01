'use client'

import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { Pencil } from 'lucide-react'

import { cn } from '@/lib/utils'

import Link from 'next/link'
import { CollapsibleMessage } from './collapsible-message'
import { Button } from './ui/button'

type UserMessageProps = {
  message: string
  messageId?: string
  onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
  parts: any
}

type UserMessageFileTypeProps = {
  data: string
  mimeType: string
  name: string
  size: any
  type: string
  url: string
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  messageId,
  onUpdateMessage,
  parts
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message)

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setEditedContent(message)
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
  }

  const handleSaveClick = async () => {
    if (!onUpdateMessage || !messageId) return

    setIsEditing(false)

    try {
      await onUpdateMessage(messageId, editedContent)
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  return (
    <CollapsibleMessage role="user">
      <div
        className="flex-1 break-words w-full group outline-none relative"
        tabIndex={0}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <TextareaAutosize
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              autoFocus
              className="resize-none flex w-full rounded-lg border border-input bg-background p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              minRows={1}
              maxRows={10}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleCancelClick}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveClick}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between items-start bg-gradient-to-r from-card/45 via-card/40 to-card/5 backdrop-blur-sm drop-shadow-sm border border-border/30 p-2 rounded-lg">
            <div className="max-w-2xl txt-grad">{message}</div>
            <div className='mr-5'>
              {parts.map((item: UserMessageFileTypeProps, index: number) =>
                item.type === "file" && (
                  <div key={index} className="flex items-center gap-2 bg-secondary/50 px-1 py-1 rounded-lg border">
                    <span className="text-xs text-foreground/80"><Link href={item.url} target='_blank'>📎{item.name}</Link></span>
                  </div>
                  // <div key={index} className="mt-2 p-2 border rounded-md bg-muted/30">
                  //   <div className="font-medium"> {item.name}</div>
                  //   <div className="text-xs opacity-75">
                  //     {item.mimeType?.split('/')[1]?.toUpperCase()} • {(item.size / 1024).toFixed(1)} KB
                  //   </div>
                  //   <a
                  //     href={item.url}
                  //     target="_blank"
                  //     rel="noopener noreferrer"
                  //     className="text-blue-500 underline text-sm"
                  //   >
                  //     View / Download
                  //   </a>
                  // </div>
                )
              )}
            </div>
            <div
              className={cn(
                'absolute top-1 right-1 transition-opacity ml-2',
                'opacity-0',
                'group-focus-within:opacity-100',
                'md:opacity-0',
                'md:group-hover:opacity-100'
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-7 w-7"
                onClick={handleEditClick}
              >
                <Pencil className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </CollapsibleMessage>
  )
}
