'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { MessageCircle, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Chat } from '@/lib/types'

import { useHistoryDialog } from '../history-dialog'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'

import { useAuth } from '@/components/context/auth-context'
import { ChatHistorySkeleton } from './chat-history-skeleton'
import { ChatMenuItem } from './chat-menu-item'

// 🧠 Global cache (persists while app is running)
let cachedChats: Chat[] | null = null
let cachedNextOffset: number | null = null
let hasFetchedOnce = false

// 🧹 Exported reset function — call this when new chat is added or deleted
export function clearChatHistoryCache() {
  cachedChats = null
  cachedNextOffset = null
  hasFetchedOnce = false
}

interface ChatPageResponse {
  chats: Chat[]
  nextOffset: number | null
}

// Reusable chat history list component
interface ChatHistoryListProps {
  groups: {
    thisWeek: Chat[]
    lastWeek: Chat[]
    thisMonth: Chat[]
    older: Chat[]
  }
  isLoading: boolean
  isLoadingMore: boolean
  isPending: boolean
  hasChats: boolean
  searchQuery: string
  loadMoreRef: React.RefObject<HTMLDivElement | null>
  compact?: boolean
}

function ChatHistoryList({
  groups,
  isLoading,
  isLoadingMore,
  isPending,
  hasChats,
  searchQuery,
  loadMoreRef,
  compact = false
}: ChatHistoryListProps) {
  if (isLoading) {
    return (
      <div className="py-2">
        <ChatHistorySkeleton />
      </div>
    )
  }

  if (!hasChats) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <div className="bg-muted/30 p-4 rounded-full mb-3 ring-1 ring-border/50">
          <MessageCircle size={24} className="text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-foreground/80 mb-1">
          {searchQuery ? 'No results found' : 'No chat history'}
        </p>
        <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
          {searchQuery
            ? 'We couldn\'t find any conversations matching your search.'
            : 'Your conversation history will appear here once you start chatting.'}
        </p>
      </div>
    )
  }

  const renderGroup = (label: string, chats: Chat[]) => {
    if (chats.length === 0) return null

    return (
      <div key={label} className="mb-6 last:mb-0">
        {!compact && (
          <div className="px-4 mb-2">
            <h3 className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
              {label}
            </h3>
          </div>
        )}
        <div className="space-y-0.5">
          {chats.map((chat) => (
            <ChatMenuItem key={chat.id} chat={chat} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {renderGroup('This Week', groups.thisWeek)}
      {renderGroup('Last Week', groups.lastWeek)}
      {renderGroup('This Month', groups.thisMonth)}
      {renderGroup('Older', groups.older)}

      {/* Loading skeleton for infinite scroll - only show when loading more */}
      {(isLoadingMore || isPending) && (
        <div className="py-2">
          <ChatHistorySkeleton />
        </div>
      )}

      {/* Load more trigger */}
      <div ref={loadMoreRef} style={{ height: '1px' }} />
    </>
  )
}

// Hook to manage chat history state
export function useChatHistory() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [chats, setChats] = useState<Chat[]>(cachedChats || [])
  const [nextOffset, setNextOffset] = useState<number | null>(cachedNextOffset)
  const [isLoading, setIsLoading] = useState(!hasFetchedOnce)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  const fetchInitialChats = useCallback(async (silent = false) => {
    if (isAuthLoading) return
    if (!user) {
      if (!silent) setIsLoading(false)
      return
    }
    if (!silent) setIsLoading(true)
    try {
      const response = await fetch(`/api/chats?offset=0&limit=20`)
      if (!response.ok) {
        throw new Error('Failed to fetch initial chat history')
      }

      const { chats: newChats, nextOffset: newNextOffset } =
        (await response.json()) as ChatPageResponse

      // ✅ Update both state and cache
      setChats(newChats)
      setNextOffset(newNextOffset)
      cachedChats = newChats
      cachedNextOffset = newNextOffset
      hasFetchedOnce = true
    } catch (error) {
      console.error('Failed to load initial chats:', error)
      toast.error('Failed to load chat history.')
      setNextOffset(null)
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [user, isAuthLoading])

  // 🧹 Clear state and cache on logout
  useEffect(() => {
    if (!isAuthLoading && !user) {
      setChats([])
      setNextOffset(null)
      clearChatHistoryCache()
    }
  }, [user, isAuthLoading])

  // 🧠 Only fetch when cache is empty
  useEffect(() => {
    if (!hasFetchedOnce) {
      fetchInitialChats()
    }
  }, [fetchInitialChats])

  useEffect(() => {
    const handleHistoryUpdate = (event: any) => {
      const detail = event.detail

      if (detail && detail.type === 'delete') {
        const { chatId } = detail
        setChats(prev => {
          const updated = prev.filter(c => c.id !== chatId)
          cachedChats = updated
          return updated
        })
      } else if (detail && detail.type === 'rename') {
        const { chatId, title } = detail
        setChats(prev => {
          const updated = prev.map(c => c.id === chatId ? { ...c, title } : c)
          cachedChats = updated
          return updated
        })
      } else {
        // Fallback for generic updates
        startTransition(() => {
          fetchInitialChats(true)
        })
      }
    }
    window.addEventListener('chat-history-updated', handleHistoryUpdate)
    return () => {
      window.removeEventListener('chat-history-updated', handleHistoryUpdate)
    }
  }, [fetchInitialChats])

  const fetchMoreChats = useCallback(async () => {
    if (isLoadingMore || nextOffset === null || !user || isAuthLoading) return

    setIsLoadingMore(true)
    try {
      const response = await fetch(`/api/chats?offset=${nextOffset}&limit=20`)
      if (!response.ok) {
        throw new Error('Failed to fetch more chat history')
      }

      const { chats: newChats, nextOffset: newNextOffset } =
        (await response.json()) as ChatPageResponse

      const updatedChats = [...chats, ...newChats]
      setChats(updatedChats)
      setNextOffset(newNextOffset)

      // ✅ Update cache
      cachedChats = updatedChats
      cachedNextOffset = newNextOffset
    } catch (error) {
      console.error('Failed to load more chats:', error)
      toast.error('Failed to load more chat history.')
      setNextOffset(null)
    } finally {
      setIsLoadingMore(false)
    }
  }, [nextOffset, isLoadingMore, chats, user, isAuthLoading])

  // Infinite scroll logic
  useEffect(() => {
    const observerRefValue = loadMoreRef.current
    if (!observerRefValue || nextOffset === null || isPending) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore && !isPending) {
          fetchMoreChats()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(observerRefValue)
    return () => {
      if (observerRefValue) observer.unobserve(observerRefValue)
    }
  }, [fetchMoreChats, nextOffset, isLoadingMore, isPending])

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    if (!searchQuery.trim()) return true

    const searchLower = searchQuery.toLowerCase()
    return (
      chat.title?.toLowerCase().includes(searchLower) ||
      chat.messages?.some(message => {
        const content = (message as any).content

        // Normalize non-string content into a string before searching.
        const contentStr =
          typeof content === 'string'
            ? content
            : typeof content === 'number' || typeof content === 'boolean'
              ? String(content)
              : Array.isArray(content)
                ? JSON.stringify(content)
                : content && typeof content === 'object'
                  ? JSON.stringify(content)
                  : ''

        return contentStr.toLowerCase().includes(searchLower)
      })
    )
  })

  const handleRefresh = () => {
    startTransition(() => {
      clearChatHistoryCache()
      setChats([])
      setNextOffset(null)
      setIsLoading(true)
      setSearchQuery('')
      fetchInitialChats()
    })
  }

  // Group chats by date
  const groups = useMemo(() => {
    // Return empty groups if no filtered chats or during SSR/Pre-rendering
    // to avoid "new Date()" hydration mismatches in Next.js 16 PPR
    if (typeof window === 'undefined' || filteredChats.length === 0) {
      return {
        thisWeek: [] as Chat[],
        lastWeek: [] as Chat[],
        thisMonth: [] as Chat[],
        older: [] as Chat[]
      }
    }

    const now = new Date()
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay())
    const startOfLastWeek = new Date(startOfThisWeek)
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const groups = {
      thisWeek: [] as Chat[],
      lastWeek: [] as Chat[],
      thisMonth: [] as Chat[],
      older: [] as Chat[]
    }

    filteredChats.forEach((chat) => {
      if (!chat.createdAt) return

      let chatDate: Date
      if (typeof chat.createdAt === 'object' && 'seconds' in chat.createdAt) {
        chatDate = new Date((chat.createdAt as any).seconds * 1000)
      } else {
        chatDate = new Date(chat.createdAt)
      }

      if (isNaN(chatDate.getTime())) return

      if (chatDate >= startOfThisWeek) {
        groups.thisWeek.push(chat)
      } else if (chatDate >= startOfLastWeek) {
        groups.lastWeek.push(chat)
      } else if (chatDate >= startOfThisMonth) {
        groups.thisMonth.push(chat)
      } else {
        groups.older.push(chat)
      }
    })

    return groups
  }, [filteredChats])

  const hasChats = groups.thisWeek.length > 0 || groups.lastWeek.length > 0 ||
    groups.thisMonth.length > 0 || groups.older.length > 0

  return {
    chats,
    groups,
    hasChats,
    isLoading,
    isLoadingMore,
    isPending,
    searchQuery,
    setSearchQuery,
    loadMoreRef,
    handleRefresh,
    fetchMoreChats
  }
}

export function ChatHistoryClient() {
  const { isHistoryDialogOpen, setHistoryDialogIsOpen } = useHistoryDialog()
  const {
    groups,
    hasChats,
    isLoading,
    isLoadingMore,
    isPending,
    searchQuery,
    setSearchQuery,
    loadMoreRef,
    fetchMoreChats
  } = useChatHistory()

  //handle keydown event
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setHistoryDialogIsOpen((current: boolean) => !current)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Dialog open={isHistoryDialogOpen} onOpenChange={() => setHistoryDialogIsOpen(false)}>
      <DialogTitle></DialogTitle>
      <DialogContent className="w-[95%] md:w-full max-w-2xl h-[70vh] sm:h-[70vh] p-0 bg-background/95 backdrop-blur-sm text-popover-foreground border border-border rounded-2xl overflow-hidden flex flex-col gap-0 cosmic-glass HiddenScrollbar">
        <div className="flex-shrink-0 py-2 px-4">
          <div className="flex items-center gap-3 mb-1">
            <Search size={16} className="text-muted-foreground" />
            <input
              placeholder="Search titles and messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={false}
              className="border-none bg-transparent focus:outline-none text-sm h-8 flex-1 placeholder-txt-mut text-foreground/90"
            />
            {/* <button
              onClick={handleRefresh}
              className="p-1 mr-5 rounded-full hover:bg-muted transition-colors"
            >
              <RefreshCcw size={14} />
            </button> */}
          </div>

          <div className='w-full h-[1px] bg-border' />
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          <ChatHistoryList
            groups={groups}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            isPending={isPending}
            hasChats={hasChats}
            searchQuery={searchQuery}
            loadMoreRef={loadMoreRef}
          />

          {!isLoadingMore && !isPending && hasChats && (
            <div className="flex justify-center py-3">
              <button
                onClick={fetchMoreChats}
                className="text-xs px-4 py-1.5 rounded-md border border-border bg-muted/30 hover:bg-muted transition"
              >
                Load more
              </button>
            </div>
          )}

        </div>

        <div className="flex-none border-t border-border/50 bg-background/50 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground/50 font-medium">
              {hasChats ? `${groups.thisWeek.length + groups.lastWeek.length + groups.thisMonth.length + groups.older.length} conversations` : 'No conversations'}
            </span>
            <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-muted/30 border border-border/40 rounded-md text-[10px] text-muted-foreground/60 font-mono">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}