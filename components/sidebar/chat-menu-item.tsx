'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { Check, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { Chat } from '@/lib/types'

import { SidebarMenuItem } from '@/components/ui/sidebar'

import { useHistoryDialog } from '../history-dialog'
import { Spinner } from '../ui/spinner'

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
  const { setHistoryDialogIsOpen } = useHistoryDialog()

  const [isDeleting, startDeleteTransition] = useTransition()
  const [isRenaming, startRenameTransition] = useTransition()

  const [isRenameClicked, setIsRenameClicked] = useState(false)
  const [isDeleteClicked, setIsDeleteClicked] = useState(false)

  const [newTitle, setNewTitle] = useState(chat.title)

  /* ---------------- DELETE ---------------- */
  const onDelete = () => {
    startDeleteTransition(async () => {
      try {
        const res = await fetch(`/api/chat/${chat.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete chat')

        toast.success('Chat deleted')
        if (isActive) router.push('/')
        window.dispatchEvent(new CustomEvent('chat-history-updated'))
      } catch (err) {
        toast.error('Failed to delete chat')
      }
    })
  }

  /* ---------------- RENAME ---------------- */
  const onRename = () => {
    if (newTitle.trim() === '') {
      toast.error('Title cannot be empty')
      return
    }


    startRenameTransition(async () => {
      try {
        const res = await fetch(`/api/chat/${chat.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ title: newTitle })
        })

        if (!res.ok) throw new Error('Failed to rename chat')

        window.dispatchEvent(new CustomEvent('chat-history-updated'))
        setIsRenameClicked(false)
      } catch {
        toast.error('Failed to rename chat')
      }
    })
  }

  /* ---------------- UI STATES ---------------- */

  /* ✏️ RENAME MODE */
  if (isRenameClicked) {
    return (
      <SidebarMenuItem>
        <div className="h-auto flex gap-2 items-center bg-card border border-muted rounded-xl px-4 py-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            className="flex-1 focus:outline-none bg-transparent text-sm placeholder:text-muted-foreground"
            disabled={isRenaming}
          />

          <button
            onClick={() => setIsRenameClicked(false)}
            className="size-7 p-1 hover:bg-accent rounded-sm"
          >
            <X size={16} />
          </button>

          <button
            onClick={onRename}
            disabled={isRenaming}
            className="size-7 p-1 hover:bg-accent rounded-sm"
          >
            {isRenaming ? <Spinner /> : <Check size={16} />}
          </button>
        </div>
      </SidebarMenuItem>
    )
  }

  /* 🗑️ DELETE CONFIRM INLINE */
  if (isDeleteClicked) {
    return (
      <SidebarMenuItem>
        <div className="h-auto flex gap-2 items-center bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-1">
          <div className="text-sm text-red-500 flex-1">
            Delete &quot;{chat.title}&quot;?
          </div>

          <button
            onClick={() => setIsDeleteClicked(false)}
            className="size-7 p-1 hover:bg-red-600/20 rounded-sm"
            disabled={isDeleting}
          >
            <X size={16} />
          </button>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="size-7 p-1 hover:bg-red-600/20 rounded-sm"
          >
            {isDeleting ? <Spinner /> : <Check size={16} />}
          </button>
        </div>
      </SidebarMenuItem>
    )
  }

  /* DEFAULT VIEW */
  return (
    <SidebarMenuItem>
      <div className="h-auto flex gap-0.5 items-center justify-center px-4 py-1">
        <Link
          href={chat.path}
          onClick={() => {
            setHistoryDialogIsOpen(false)
            toast.message(`Opening conversation "${chat.title}"`)
          }}
          className="flex-1">
          <div className="flex items-center justify-between pr-2 w-full">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="text-sm text-foreground/80 w-48 font-medium truncate select-none flex-1">
                {chat.title}
              </div>
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 shrink-0">
              {formatDateWithTime(chat.createdAt)}
            </div>
          </div>
        </Link>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsRenameClicked(true)}
            className="size-7 p-1 text-foreground/70 hover:bg-accent rounded-sm"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={() => setIsDeleteClicked(true)}
            className="size-7 p-1 text-foreground/70 hover:bg-accent rounded-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </SidebarMenuItem>
  )
}
