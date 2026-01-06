'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useChat } from '@ai-sdk/react'
import { User } from '@supabase/supabase-js'
import { ChatRequestOptions } from 'ai'
import { Message } from 'ai/react'
import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'
import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'

import { CircleDollarSign } from 'lucide-react'
import { ChatMessages } from './chat-messages'
import { ChatPanel } from './chat-panel'
import { HistoryDialog, useHistoryDialog } from './history-dialog'
import { Button } from './ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

// Define section structure
interface ChatSection {
  id: string // User message ID
  userMessage: Message
  assistantMessages: Message[]
}

// Define file attachment type
interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  content?: string // For text-based files
}

// Define message part types that match the AI SDK expectations
type MessagePart =
  | { type: 'text'; text: string }
  | {
    type: 'file';
    url: string;
    name: string;
    mimeType: string;
    size: number;
    data: string; // Add the required data property
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
  models: Model[]
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const { isHistoryDialogOpen } = useHistoryDialog();
  const [user, setUser] = useState<User | null>(null)
  const [isRateLimitDialogOpen, setisRateLimitDialogOpen] = useState(false)
  const [rateLimitMessage, setRateLimitMessage] = useState('')
  const [isRateLimitDialogControlVisible, setIsRateLimitDialogControlVisible] = useState(true)
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([])
  const [isFileUploading, setIsFileUploading] = useState(false)
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
    id: id,
    body: {
      id
    },
    onFinish: () => {
      if (window.location.pathname === '/') {
        window.history.replaceState({}, '', `/search/${id}`)
      }
      window.dispatchEvent(new CustomEvent('chat-history-updated'))
    },
    onError: async (error) => {
      console.log(error)
      const message = error?.message || "Something went wrong."
      if (message.includes("limit of") && message.includes("wait until")) {
        if (message.includes("unauthenticated")) {
          try {
            setRateLimitMessage(message)
            setisRateLimitDialogOpen(true)
            return
          } catch {
            setRateLimitMessage(error.message)
            setisRateLimitDialogOpen(true)
            return
          }
        }
        else {
          try {
            setRateLimitMessage(message)
            setisRateLimitDialogOpen(true)
            setIsRateLimitDialogControlVisible(false)
            return
          } catch {
            setRateLimitMessage(error.message)
            setisRateLimitDialogOpen(true)
            setIsRateLimitDialogControlVisible(false)
            return
          }
        }
      } else {
        toast.error(`Error in chat: ${error.message}`)
        // console.log("Error in chat: ", error.message)
      }
    },
    sendExtraMessageFields: false,
    experimental_throttle: 100
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  // Convert messages array to sections array
  const sections = useMemo<ChatSection[]>(() => {
    const result: ChatSection[] = []
    let currentSection: ChatSection | null = null
    for (const message of messages) {
      if (message.role === 'user') {
        if (currentSection) {
          result.push(currentSection)
        }
        currentSection = {
          id: message.id,
          userMessage: message,
          assistantMessages: []
        }
      } else if (currentSection && message.role === 'assistant') {
        currentSection.assistantMessages.push(message)
      }
    }

    if (currentSection) {
      result.push(currentSection)
    }

    return result
  }, [messages])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (attachedFiles.length >= 1) {
      toast.error("Only one file can be attached at a time");
      return;
    }

    console.log("Starting file upload...", files.length, "files")
    setIsFileUploading(true)

    const newAttachments: FileAttachment[] = []
    const uploadPromises: Promise<void>[] = []

    for (const file of Array.from(files)) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
        continue
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ]

      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type ${file.type} is not supported.`)
        continue
      }

      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create upload promise for each file
      const uploadPromise = uploadFileToStorage(file)
        .then((fileUrl) => {
          console.log("File uploaded successfully:", file.name, fileUrl)

          const attachment: FileAttachment = {
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            url: fileUrl
          }

          newAttachments.push(attachment)
          toast.success(`File ${file.name} uploaded successfully`)
        })
        .catch((error) => {
          console.error('Error uploading file:', file.name, error)
          toast.error(`Failed to upload file ${file.name}`)
        })

      uploadPromises.push(uploadPromise)
    }

    // Wait for all uploads to complete
    try {
      await Promise.all(uploadPromises)
      console.log("All file uploads completed")

      // Update attachments only after all files are processed
      if (newAttachments.length > 0) {
        setAttachedFiles(prev => [...prev, ...newAttachments])
      }
    } catch (error) {
      console.error('Error in file upload process:', error)
    } finally {
      // Always set loading to false when done
      setIsFileUploading(false)
      console.log("File upload loading state set to false")
    }
  }

  // function for file upload to storage
  const uploadFileToStorage = async (file: File): Promise<string> => {
    try {
      // console.log("Uploading file:", file.name, file.type, file.size)

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || `Upload failed with status ${res.status}`)
      }

      const data = await res.json()
      // console.log("Upload response:", data)

      if (!data.url) {
        throw new Error('No URL returned from upload')
      }

      return data.url
    } catch (error) {
      console.error('Upload file error:', error)
      throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Remove attached file
  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  // Modified submit handler to include files in parts
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (input.trim() === '' && attachedFiles.length === 0) {
      return
    }

    // Don't allow submission while files are uploading
    if (isFileUploading) {
      toast.error("Please wait for file upload to complete")
      return
    }

    const messageParts: MessagePart[] = []

    // Add text part if there's input
    if (input.trim()) {
      messageParts.push({
        type: 'text',
        text: input
      })
    }

    // Add file parts for each attached file
    attachedFiles.forEach(file => {
      messageParts.push({
        type: 'file',
        url: file.url,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        data: file.url // Use the URL as data, or you can use file content if available
      })
    })

    // Create the message with parts
    append({
      role: 'user',
      content: input, // Keep the original content for compatibility
      parts: messageParts
    })

    // Clear input and attached files
    handleInputChange({ target: { value: '' } } as any)
    setAttachedFiles([])
    setData(undefined)
  }

  // Detect if scroll container is at the bottom
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const threshold = 50
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        setIsAtBottom(true)
      } else {
        setIsAtBottom(false)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to the section when a new user message is sent
  useEffect(() => {
    const isCurrentChat =
      window.location.pathname === `/search/${id}` ||
      (window.location.pathname === '/' && sections.length > 0)

    if (isCurrentChat && sections.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.role === 'user') {
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
      content: query,
      parts: [{ type: 'text', text: query }]
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

  // console.log("messgaes", messages)

  return (
    <div
      className={cn(
        'relative flex h-full min-w-0 w-full flex-1 flex-col',
        messages.length === 0 ? 'items-center justify-center' : ''
      )}
      data-testid="full-chat"
    >
      {/* <Header /> */}

      {/* Upgrade button */}
      <div className='opacity-0 absolute top-2 right-2 flex items-center border border-primary bg-sidebar-accent drop-shadow-sm shadow-primary gap-2 px-3 py-1.5 rounded-lg cursor-pointer'>
        <CircleDollarSign size={14} className='text-primary' />
        <p className='text-xs'>Upgrade</p>
      </div>

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
        attachedFiles={attachedFiles}
        isFileUploading={isFileUploading}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
      />

      {/* {messages.length === 0 && (
        <div className='absolute bottom-2 flex gap-1 justify-center items-center'>
          <div className='flex gap-2 bg-clip-text text-transparent bg-gradient-to-tr from-foreground/90 to-foreground/60'>
            <Link href="/terms" className='text-xs hover:text-foreground transition-colors'>Terms</Link>
            <Link href="/privacy" className='text-xs hover:text-foreground transition-colors'>Privacy</Link>
            <Link href="/contact" className='text-xs hover:text-foreground transition-colors'>Contact</Link>
            <Link href="/about" className='text-xs hover:text-foreground transition-colors'>About</Link>
          </div>
        </div>
      )} */}

      <Dialog open={isRateLimitDialogOpen} onOpenChange={setisRateLimitDialogOpen}>
        <DialogContent className='w-[90%] bg-gradient-to-br from-card/75 via-card/55 to-card/65 rounded-2xl backdrop-blur-sm'>
          <DialogHeader>
            <DialogTitle className='txt-grad'>Daily Limit Reached</DialogTitle>
            <DialogDescription className='txt-mut'>
              {rateLimitMessage ||
                "You've reached the daily limit. Please log in for unlimited access."}
            </DialogDescription>
          </DialogHeader>
          {isRateLimitDialogControlVisible &&
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" className='txt-grad' onClick={() => setisRateLimitDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => (window.location.href = '/auth/login')}>
                Login
              </Button>
            </div>
          }
        </DialogContent>
      </Dialog>

      <HistoryDialog />
    </div>
  )
}