'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Chat } from '@/lib/types'

import {
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import { useHistoryDialog } from '../history-dialog'
import { Spinner } from '../ui/spinner'

// 🕒 Format date as "time ago"
const formatDateWithTime = (date: Date | string) => {
  const parsedDate = new Date(date)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(days / 365)
  return `${years}y ago`
}

interface ChatMenuItemProps {
  chat: Chat
}

export function ChatMenuItem({ chat }: ChatMenuItemProps) {
  const pathname = usePathname()
  const isActive = pathname === chat.path
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [newTitle, setNewTitle] = useState(chat.title)
  const { setHistoryDialogIsOpen } = useHistoryDialog();

  const onDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      try {
        const res = await fetch(`/api/chat/${chat.id}`, { method: 'DELETE' })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to delete chat')
        }

        toast.success('Chat deleted')

        if (isActive) router.push('/')
        window.dispatchEvent(new CustomEvent('chat-history-updated'))
        setShowDeleteDialog(false)
      } catch (error) {
        console.error('Failed to delete chat:', error)
        toast.error((error as Error).message || 'Failed to delete chat')
        setShowDeleteDialog(false)
      }
    })
  }

  const onRename = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (newTitle.trim() && newTitle !== chat.title) {
      toast.message(`Renamed conversation to "${newTitle}"`)
      // Add your rename API call here
    }
    setShowRenameDialog(false)
  }

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    action()
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          className="h-auto flex-row gap-0.5 items-center justify-center px-4 py-1 "
        >
          <Link
            href={chat.path}
            className="flex-1 "
            onClick={() => {
              setHistoryDialogIsOpen(false)
              toast.message(`Opening conversation "${chat.title}"`)
            }}
          >
            <div className="flex items-center justify-between pr-2 w-full">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* <Lock size={16} /> */}
                <div className="text-sm w-48  font-medium truncate select-none flex-1">
                  {chat.title}
                </div>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 shrink-0">
                {formatDateWithTime(chat.createdAt)}
              </div>
            </div>
          </Link>

          {/* Action buttons container */}
          <div className="flex items-center gap-1 ">
            {/* ✏️ Rename Button */}
            <button
              onClick={(e) => handleActionClick(e, () => setShowRenameDialog(true))}
              className="size-7 p-1 text-foreground hover:bg-accent rounded-sm flex items-center justify-center"
              title="Rename chat"
            >
              <Edit size={16} />
              <span className="sr-only">Rename chat</span>
            </button>

            {/* 🗑️ Delete Button */}
            <button
              onClick={(e) => handleActionClick(e, () => setShowDeleteDialog(true))}
              className="size-7 p-1 text-foreground hover:bg-accent rounded-sm flex items-center justify-center"
              title="Delete chat"
              disabled={isPending}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <Trash2 size={16} />
              )}
              <span className="sr-only">Delete chat</span>
            </button>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Rename Dialog */}
      {showRenameDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowRenameDialog(false)}
        >
          <div
            className="bg-popover rounded-lg p-6 w-96 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Rename Chat</h3>
              <button
                onClick={() => setShowRenameDialog(false)}
                className="p-1 hover:bg-accent rounded-sm"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enter a new name for this chat.
            </p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background mb-4"
              placeholder="Enter new chat name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRename(e as any)
                if (e.key === 'Escape') setShowRenameDialog(false)
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameDialog(false)}
                className="px-3 py-2 text-sm border border-border rounded-md hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={onRename}
                className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !isPending && setShowDeleteDialog(false)}
        >
          <div
            className="bg-popover rounded-lg p-6 w-96 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Delete Chat</h3>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="p-1 hover:bg-accent rounded-sm"
                disabled={isPending}
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={isPending}
                className="px-3 py-2 text-sm border border-border rounded-md hover:bg-accent disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                disabled={isPending}
                className="px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Spinner />}
                {!isPending && "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}