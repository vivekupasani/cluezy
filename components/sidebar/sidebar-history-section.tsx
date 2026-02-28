'use client'

import { MessageCircle } from 'lucide-react'
import { useChatHistory } from './chat-history-client'
import { ChatHistorySkeleton } from './chat-history-skeleton'
import { ChatMenuItemSidebar } from './chat-menu-item-sidebar'

export default function SidebarHistorySection() {
  const { groups, hasChats, isLoading, isLoadingMore, isPending, loadMoreRef } =
    useChatHistory()

  if (isLoading) {
    return (
      <div className="py-2 px-2">
        <ChatHistorySkeleton />
      </div>
    )
  }

  if (!hasChats) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center px-2">
        <MessageCircle size={32} className="text-muted-foreground/40 mb-2" />
        <p className="text-xs text-muted-foreground">No chat history</p>
      </div>
    )
  }

  return (
    <div className="space-y-1 px-2">
      {groups.thisWeek.length > 0 && (
        <>
          {groups.thisWeek.slice(0, 5).map(chat => (
            <ChatMenuItemSidebar key={chat.id} chat={chat} />
          ))}
        </>
      )}

      {groups.thisWeek.length < 5 && groups.lastWeek.length > 0 && (
        <>
          {groups.lastWeek.slice(0, 5 - groups.thisWeek.length).map(chat => (
            <ChatMenuItemSidebar key={chat.id} chat={chat} />
          ))}
        </>
      )}

      {groups.thisWeek.length + groups.lastWeek.length < 5 &&
        groups.thisMonth.length > 0 && (
          <>
            {groups.thisMonth
              .slice(0, 5 - groups.thisWeek.length - groups.lastWeek.length)
              .map(chat => (
                <ChatMenuItemSidebar key={chat.id} chat={chat} />
              ))}
          </>
        )}

      {groups.thisWeek.length +
        groups.lastWeek.length +
        groups.thisMonth.length <
        5 &&
        groups.older.length > 0 && (
          <>
            {groups.older
              .slice(
                0,
                5 -
                  groups.thisWeek.length -
                  groups.lastWeek.length -
                  groups.thisMonth.length
              )
              .map(chat => (
                <ChatMenuItemSidebar key={chat.id} chat={chat} />
              ))}
          </>
        )}

      {(isLoadingMore || isPending) && (
        <div className="py-2">
          <ChatHistorySkeleton />
        </div>
      )}

      <div ref={loadMoreRef} style={{ height: '1px' }} />
    </div>
  )
}
