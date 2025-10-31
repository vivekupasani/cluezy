'use client'

import { Chat } from '@/lib/types'
import { History, MessageCircle, Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useHistoryDialog } from '../history-dialog'
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

export function ChatHistoryClient() {
  const [chats, setChats] = useState<Chat[]>(cachedChats || [])
  const [nextOffset, setNextOffset] = useState<number | null>(cachedNextOffset)
  const [isLoading, setIsLoading] = useState(!hasFetchedOnce)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const { setHistoryDialogIsOpen } = useHistoryDialog()

  const fetchInitialChats = useCallback(async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }, [])

  // 🧠 Only fetch when cache is empty
  useEffect(() => {
    if (!hasFetchedOnce) {
      fetchInitialChats()
    }
  }, [fetchInitialChats])

  useEffect(() => {
    const handleHistoryUpdate = () => {
      startTransition(() => {
        fetchInitialChats()
      })
    }
    window.addEventListener('chat-history-updated', handleHistoryUpdate)
    return () => {
      window.removeEventListener('chat-history-updated', handleHistoryUpdate)
    }
  }, [fetchInitialChats])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHistoryDialogIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setHistoryDialogIsOpen])

  const fetchMoreChats = useCallback(async () => {
    if (isLoadingMore || nextOffset === null) return

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
  }, [nextOffset, isLoadingMore, chats])

  // Infinite scroll logic (same as before)
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
        // Handle strings, numbers, booleans, arrays and objects safely.
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

  // Group chats by date with new categories
  const groupChatsByDate = () => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
    const startOfLastWeek = new Date(startOfThisWeek)
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

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
  }

  const groups = groupChatsByDate()
  const hasChats = groups.thisWeek.length > 0 || groups.lastWeek.length > 0 ||
    groups.thisMonth.length > 0 || groups.older.length > 0

  return (
    <div className="w-full max-w-3xl h-[60vh] sm:h-[80vh] p-0 bg-gradient-to-br from-popover/75 via-popover/55 to-popover/65 shadow-inner shadow-popover-foreground/10 backdrop-blur-sm text-popover-foreground border border-border rounded-2xl overflow-hidden flex flex-col gap-0 cosmic-glass HiddenScrollbar">
      <div className="flex-shrink-0 py-2 px-4">
        <div className="flex items-center gap-3 mb-1">
          <Search size={16} className="text-muted-foreground" />
          <input
            placeholder="Search titles and messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none bg-transparent focus:outline-none text-sm h-8 flex-1 placeholder-muted-foreground/60"
          />
          <button
            onClick={() => setHistoryDialogIsOpen(false)}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className='w-full h-[1px] bg-border' />
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2">
        {isLoading ? (
          // Show skeleton only during initial load when no chats are loaded yet
          <div className="py-2">
            <ChatHistorySkeleton />
          </div>
        ) : !hasChats ? (
          // Show empty state only after initial load is complete and no chats exist
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <MessageCircle size={48} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No chats found' : 'No chat history'}
            </p>
            {searchQuery && (
              <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <>
            {groups.thisWeek.length > 0 && (
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-foreground px-3 py-2 bg-primary/10 rounded-lg flex items-center gap-2">
                  <History size={16} /> This Week
                </h3>
                <div className="space-y-1">
                  {groups.thisWeek.map((chat) => (
                    <ChatMenuItem
                      key={chat.id}
                      chat={chat}
                    />
                  ))}
                </div>
              </div>
            )}

            {groups.lastWeek.length > 0 && (
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-foreground px-3 py-2 bg-primary/10 rounded-lg  flex items-center gap-2">
                  <History size={16} /> Last Week
                </h3>
                <div className="space-y-1">
                  {groups.lastWeek.map((chat) => (
                    <ChatMenuItem
                      key={chat.id}
                      chat={chat}
                    />
                  ))}
                </div>
              </div>
            )}

            {groups.thisMonth.length > 0 && (
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-foreground px-3 py-2 bg-primary/10 rounded-lg  flex items-center gap-2">
                  <History size={16} /> This Month
                </h3>
                <div className="space-y-1">
                  {groups.thisMonth.map((chat) => (
                    <ChatMenuItem
                      key={chat.id}
                      chat={chat}
                    />
                  ))}
                </div>
              </div>
            )}

            {groups.older.length > 0 && (
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-foreground px-3 py-2 bg-primary/10 rounded-lg flex items-center gap-2">
                  <History size={16} />  Older
                </h3>
                <div className="space-y-1">
                  {groups.older.map((chat) => (
                    <ChatMenuItem
                      key={chat.id}
                      chat={chat}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeleton for infinite scroll - only show when loading more */}
            {(isLoadingMore || isPending) && (
              <div className="py-2">
                <ChatHistorySkeleton />
              </div>
            )}

            {/* Load more trigger */}
            <div ref={loadMoreRef} style={{ height: '1px' }} />
          </>
        )}
      </div>

      {/* <div className="border-t border-border/30 p-3 bg-muted/10">
        <div className="text-xs text-muted-foreground text-center">
          Designed and developed by Team Cluezy
        </div>
      </div> */}
    </div>
  )
}