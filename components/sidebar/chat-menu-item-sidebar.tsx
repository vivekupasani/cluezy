'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { Chat } from '@/lib/types'


import { useHistoryDialog } from '../history-dialog'

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

export function ChatMenuItemSidebar({ chat }: ChatMenuItemProps) {
    const pathname = usePathname()
    const isActive = pathname === chat.path

    const router = useRouter()
    const { setHistoryDialogIsOpen } = useHistoryDialog()

    return (
        <div>
            <div className="h-auto flex gap-0.5 items-center justify-center  py-1">
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
                    </div>
                </Link>
            </div>
        </div>
    )
}
