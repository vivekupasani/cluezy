'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useChat } from '@ai-sdk/react'
import { ChatRequestOptions } from 'ai'
import { Message } from 'ai/react'
import { toast } from 'sonner'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ChatMessages } from './chat-messages'
import { ChatPanel } from './chat-panel'
import Header from './header'
import { HistoryDialog, useHistoryDialog } from './history-dialog'
import { Button } from './ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

// Define section structure
interface ChatSection {
  id: string // User message ID
  userMessage: Message
  assistantMessages: Message[]
}

export function Chat({
  id,
  savedMessages = [],
  query,
  models
}: {
  id: string
  savedMessages?: Message[]
  query?: string
  models?: Model[]
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const { isHistoryDialogOpen } = useHistoryDialog();
  const [user, setUser] = useState<User | null>(null)
  const [isRateLimitDialogOpen, setisRateLimitDialogOpen] = useState(false)
  const [rateLimitMessage, setRateLimitMessage] = useState('')

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
    stop,
    append,
    data,
    setData,
    addToolResult,
    reload
  } = useChat({
    initialMessages: savedMessages,
    id: id, // Use unique chat ID for isolated streaming
    body: {
      id
    },
    onFinish: () => {
      // Only update URL if we're on the home page (new chat)
      // Don't update if we're already on a search page to avoid hijacking navigation
      if (window.location.pathname === '/') {
        window.history.replaceState({}, '', `/search/${id}`)
      }
      window.dispatchEvent(new CustomEvent('chat-history-updated'))
    },
    onError: async (error) => {
      console.log(error)
      const message = error?.message || "Something went wrong."
      // 👇 Handle rate limit case
      if (message.includes("limit of") && message.includes("wait until")) {
        try {
          setRateLimitMessage(message)
          setisRateLimitDialogOpen(true)
          return
        } catch {
          setRateLimitMessage(error.message)
          setisRateLimitDialogOpen(true)
          return
        }
      } else {
        toast.error(`Error in chat: ${error.message}`)
      }
    },
    sendExtraMessageFields: false, // Disable extra message fields,
    experimental_throttle: 100
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  // Convert messages array to sections array
  const sections = useMemo<ChatSection[]>(() => {
    const result: ChatSection[] = []
    let currentSection: ChatSection | null = null

    for (const message of messages) {
      if (message.role === 'user') {
        // Start a new section when a user message is found
        if (currentSection) {
          result.push(currentSection)
        }
        currentSection = {
          id: message.id,
          userMessage: message,
          assistantMessages: []
        }
      } else if (currentSection && message.role === 'assistant') {
        // Add assistant message to the current section
        currentSection.assistantMessages.push(message)
      }
      // Ignore other role types like 'system' for now
    }

    // Add the last section if exists
    if (currentSection) {
      result.push(currentSection)
    }

    return result
  }, [messages])

  // Detect if scroll container is at the bottom
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const threshold = 50 // threshold in pixels
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        setIsAtBottom(true)
      } else {
        setIsAtBottom(false)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Set initial state

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to the section when a new user message is sent
  useEffect(() => {
    // Only scroll if this chat is currently visible in the URL
    const isCurrentChat =
      window.location.pathname === `/search/${id}` ||
      (window.location.pathname === '/' && sections.length > 0)

    if (isCurrentChat && sections.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.role === 'user') {
        // If the last message is from user, find the corresponding section
        const sectionId = lastMessage.id
        requestAnimationFrame(() => {
          const sectionElement = document.getElementById(`section-${sectionId}`)
          sectionElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
  }, [sections, messages, id])

  useEffect(() => {
    const getUserData = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = await createClient()
        const {
          data: { user: supabaseUser }
        } = await supabase.auth.getUser()
        setUser(supabaseUser ?? null)
      }
    }
    if (!user) {
      getUserData()
    }
  }, [])

  useEffect(() => {
    setMessages(savedMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onQuerySelect = (query: string) => {
    append({
      role: 'user',
      content: query
    })
  }

  const handleUpdateAndReloadMessage = async (
    messageId: string,
    newContent: string
  ) => {
    setMessages(currentMessages =>
      currentMessages.map(msg =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    )

    try {
      const messageIndex = messages.findIndex(msg => msg.id === messageId)
      if (messageIndex === -1) return

      const messagesUpToEdited = messages.slice(0, messageIndex + 1)

      setMessages(messagesUpToEdited)

      setData(undefined)

      await reload({
        body: {
          chatId: id,
          regenerate: true
        }
      })
    } catch (error) {
      console.error('Failed to reload after message update:', error)
      toast.error(`Failed to reload conversation: ${(error as Error).message}`)
    }
  }

  const handleReloadFrom = async (
    messageId: string,
    options?: ChatRequestOptions
  ) => {
    const messageIndex = messages.findIndex(m => m.id === messageId)
    if (messageIndex !== -1) {
      const userMessageIndex = messages
        .slice(0, messageIndex)
        .findLastIndex(m => m.role === 'user')
      if (userMessageIndex !== -1) {
        const trimmedMessages = messages.slice(0, userMessageIndex + 1)
        setMessages(trimmedMessages)
        return await reload(options)
      }
    }
    return await reload(options)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setData(undefined)
    handleSubmit(e)
  }

  return (
    <div
      className={cn(
        'relative flex h-full min-w-0 w-screen flex-1 flex-col',
        messages.length === 0 ? 'items-center justify-center' : ''
      )}
      data-testid="full-chat"
    >
      {/* header component */}
      <Header user={user} />

      {/* messages component */}
      <ChatMessages
        sections={sections}
        data={data}
        onQuerySelect={onQuerySelect}
        isLoading={isLoading}
        chatId={id}
        addToolResult={addToolResult}
        scrollContainerRef={scrollContainerRef}
        onUpdateMessage={handleUpdateAndReloadMessage}
        reload={handleReloadFrom}
      />

      {/* input component */}
      <ChatPanel
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        messages={messages}
        setMessages={setMessages}
        stop={stop}
        query={query}
        append={append}
        models={models}
        showScrollToBottomButton={!isAtBottom}
        scrollContainerRef={scrollContainerRef}
      />

      {/* {
        messages.length === 0 &&
        <div className='absolute bottom-2 flex flex-col justify-center items-center'>
          <div className='flex gap-2'>
            <Link href="" className='text-xs text-foreground/60 hover:text-foreground transition-colors'>Terms</Link>
            <Link href="" className='text-xs text-foreground/60 hover:text-foreground transition-colors'>Privacy</Link>
            <Link href="" className='text-xs text-foreground/60 hover:text-foreground transition-colors'>Contact</Link>
            <Link href="" className='text-xs text-foreground/60 hover:text-foreground transition-colors'>About</Link>
          </div>
          <div className='text-xs text-foreground/60'>
            © 2025 Cluezy. All Rights Reserved From CLUEZY
          </div>
        </div>
      } */}

      {/* rate limit dialog component */}
      <Dialog open={isRateLimitDialogOpen} onOpenChange={setisRateLimitDialogOpen}>
        <DialogContent className='w-[90%] bg-gradient-to-br from-card/75 via-card/55 to-card/65 shadow-inner shadow-card-foreground/10 backdrop-blur-sm'>
          <DialogHeader>
            <DialogTitle>Daily Limit Reached</DialogTitle>
            <DialogDescription>
              {rateLimitMessage ||
                "You’ve reached the daily limit. Please log in for unlimited access."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setisRateLimitDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => (window.location.href = '/auth/login')}>
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* history dialog component  */}
      {isHistoryDialogOpen && <HistoryDialog />}
    </div>
  )
}