'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { Copy, Pencil } from 'lucide-react'

import { cn } from '@/lib/utils'

import { PROVIDER_ICONS } from '@/lib/connectors/icons'
import { CONNECTOR_CONFIGS, ConnectorProvider } from '@/lib/connectors/types'
import { toast } from 'sonner'
import { CollapsibleMessage } from './collapsible-message'
import { Button } from './ui/button'

type UserMessageProps = {
  message: string
  messageId?: string
  onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
  parts: any
  selectedApps?: string[]
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
  parts,
  selectedApps
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

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(message)
    toast.success('Message copied to clipboard')
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
  console.log("UserMessage [received]:", selectedApps)
  return (
    <CollapsibleMessage role="user">
      <div
        className="flex-1 break-words flex flex-col items-end w-full group outline-none"
        tabIndex={0}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full max-w-xs md:max-w-lg">
            <TextareaAutosize
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              autoFocus
              className="resize-none flex w-full bg-secondary dark:bg-muted rounded-2xl rounded-br-sm border border-input px-4 py-2.5 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="relative flex flex-col max-w-xs md:max-w-lg bg-secondary dark:bg-card/70 text-secondary-foreground dark:text-foreground/90 px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm border border-border/20">
            {selectedApps && selectedApps.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedApps.map(app => {
                  const config = CONNECTOR_CONFIGS[app as ConnectorProvider]
                  const Icon = config ? PROVIDER_ICONS[config.icon] : null

                  return (
                    <div
                      key={app}
                      className="inline-flex items-center gap-1.5 bg-muted/80 px-2 py-1 rounded-lg border border-border/50 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <div className="shrink-0 flex items-center justify-center size-3.5">
                        {Icon && <Icon className="size-full" />}
                      </div>
                      <span className="truncate">
                        {config?.name || app}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="text-[15px] leading-relaxed">{message}</div>
            {parts && parts.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                {parts.map(
                  (item: UserMessageFileTypeProps, index: number) =>
                    item.type === 'file' && (
                      <Link
                        key={index}
                        href={item.url}
                        target="_blank"
                        className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors border border-border/50 max-w-sm"
                      >
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          📎
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.size
                              ? `${(item.size / 1024).toFixed(1)} KB`
                              : 'File'}
                          </span>
                        </div>
                      </Link>
                    )
                )}
              </div>
            )}

            <div
              className={cn(
                'absolute bottom-0 right-full mr-2 transition-opacity flex',
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
                <Pencil className="size-3.5 text-foreground/70" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-7 w-7"
                onClick={handleCopyClick}
              >
                <Copy className="size-3.5 text-foreground/70" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </CollapsibleMessage>
  )
}
