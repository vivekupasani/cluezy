'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { Check, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { useHistoryDialog } from '../history-dialog'
import { LoadingSpinner } from '../ui/spinner'

const formatDateWithTime = (date: Date | string) => {
  if (typeof window === 'undefined') return null
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
  chat: any
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

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isRenameClicked) onRename()
        if (isDeleteClicked) onDelete()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])


  /* ---------------- DELETE ---------------- */
  const onDelete = () => {
    startDeleteTransition(async () => {
      try {
        const res = await fetch(`/api/chat/${chat.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete chat')

        toast.success('Chat deleted')
        if (isActive) router.push('/')
        window.dispatchEvent(new CustomEvent('chat-history-updated', {
          detail: { type: 'delete', chatId: chat.id }
        }))
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

        window.dispatchEvent(new CustomEvent('chat-history-updated', {
          detail: { type: 'rename', chatId: chat.id, title: newTitle }
        }))
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
      <div className="px-1.5 py-0.5">
        <div className="flex gap-2 items-center bg-accent/30 border border-border/40 rounded-xl px-3 py-1.5 transition-all duration-200 ring-1 ring-primary/10">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onRename()
              if (e.key === 'Escape') setIsRenameClicked(false)
            }}
            className="flex-1 focus:outline-none bg-transparent text-sm placeholder:text-muted-foreground/50"
            disabled={isRenaming}
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsRenameClicked(false)}
              className="p-1 hover:bg-background/80 rounded-lg transition-colors text-muted-foreground/60"
            >
              <X size={14} />
            </button>
            <button
              onClick={onRename}
              disabled={isRenaming}
              className="p-1 hover:bg-primary/10 rounded-lg transition-colors text-primary"
            >
              {isRenaming ? <LoadingSpinner className="size-3" /> : <Check size={14} />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* 🗑️ DELETE CONFIRM INLINE */
  if (isDeleteClicked) {
    return (
      <div className="px-1.5 py-0.5">
        <div className="flex gap-2 items-center bg-destructive/5 border border-destructive/20 rounded-xl px-3 py-1.5 transition-all duration-200">
          <div className="text-xs text-destructive/70 font-medium flex-1 truncate">
            Delete conversation?
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsDeleteClicked(false)}
              className="p-1 hover:bg-destructive/10 rounded-lg transition-colors text-destructive/40 hover:text-destructive/60"
              disabled={isDeleting}
            >
              <X size={14} />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-1 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
            >
              {isDeleting ? <LoadingSpinner className="size-3" /> : <Check size={14} />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* DEFAULT VIEW */
  return (
    <div className="group px-1.5 py-0.5">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border border-transparent select-none",
          isActive
            ? "bg-accent/60 border-border/40 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"
            : "hover:bg-muted/50 hover:border-border/20"
        )}
      >
        <Link
          href={chat.path}
          onClick={() => {
            setHistoryDialogIsOpen(false)
            toast.message(`Opening conversation "${chat.title}"`)
          }}
          className="flex-1 min-w-0"
        >
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className={cn(
              "text-sm font-medium truncate leading-tight transition-colors",
              isActive ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
            )}>
              {chat.title || "Untitled conversation"}
            </span>
            <span className="text-[10px] text-muted-foreground/50 font-medium tracking-tight">
              {formatDateWithTime(chat.createdAt)}
            </span>
          </div>
        </Link>

        {/* Action buttons - Hover reveal */}
        <div className={cn(
          "flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 shrink-0",
          (isRenameClicked || isDeleteClicked || isActive) && "opacity-100 translate-x-0"
        )}>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsRenameClicked(true)
            }}
            className="p-1.5 text-muted-foreground/80 hover:text-foreground hover:bg-background rounded-lg transition-all"
            title="Rename"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsDeleteClicked(true)
            }}
            className="p-1.5 text-muted-foreground/80 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

