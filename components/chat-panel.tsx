'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'

import { Message } from 'ai'
import {
  ArrowUp,
  ChevronDown,
  FileText,
  Loader2,
  MessageCirclePlus,
  Paperclip,
  Square,
  WandSparkles,
  X
} from 'lucide-react'

import { CONNECTOR_CONFIGS, ConnectorProvider } from '@/lib/connectors/types'
import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

import { PROVIDER_ICONS } from '@/lib/connectors/icons'
import { useArtifact } from './artifact/artifact-context'
import { useAuth } from './context/auth-context'
import { EmptyScreen } from './empty-screen'
import { MentionPopover } from './mention-popover'
import { ModelSelector } from './model-selector'
import { clearChatHistoryCache } from './sidebar/chat-history-client'
import { Button } from './ui/button'
import { useSidebar } from './ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

// Add FileAttachment interface
interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  content?: string
}

interface ChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  query?: string
  stop: () => void
  append: (message: any) => void
  models?: Model[]
  showScrollToBottomButton: boolean
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  // Add file upload props
  attachedFiles: FileAttachment[]
  isFileUploading: boolean
  uploadingCount?: number
  onFileUpload: (files: FileList | null) => void
  onRemoveFile: (fileId: string) => void
  // Add mention props
  selectedApps: ConnectorProvider[]
  onSelectApp: (app: ConnectorProvider) => void
  onRemoveApp: (app: ConnectorProvider) => void
}

export function ChatPanel({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  query,
  stop,
  append,
  models,
  showScrollToBottomButton,
  scrollContainerRef,
  // Add file upload props
  attachedFiles,
  isFileUploading,
  uploadingCount = 0,
  onFileUpload,
  onRemoveFile,
  // Add mention props
  selectedApps,
  onSelectApp,
  onRemoveApp
}: ChatPanelProps) {
  const [showEmptyScreen, setShowEmptyScreen] = useState(true)
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isFirstRender = useRef(true)
  const [isComposing, setIsComposing] = useState(false)
  const [enterDisabled, setEnterDisabled] = useState(false)
  const { close: closeArtifact } = useArtifact()
  const [isEnhancePromptLoading, setIsEnhancePromptLoading] = useState(false)
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { state } = useArtifact()
  const { open } = useSidebar()
  const pathName = usePathname()
  const [isDragging, setIsDragging] = useState(false)

  // Mention Popover State
  const [mentionOpen, setMentionOpen] = useState(false)
  const [mentionSearch, setMentionSearch] = useState('')
  const [mentionRect, setMentionRect] = useState<DOMRect | null>(null)
  const [mentionStartIndex, setMentionStartIndex] = useState(-1)
  const chipsRef = useRef<HTMLDivElement>(null)
  const [chipsWidth, setChipsWidth] = useState(0)

  // Measure chips width whenever selectedApps changes or window resizes
  useEffect(() => {
    if (!chipsRef.current) {
      setChipsWidth(0)
      return
    }

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setChipsWidth(entry.contentRect.width + 6) // Add some gap
      }
    })

    observer.observe(chipsRef.current)
    return () => observer.disconnect()
  }, [selectedApps])

  if (pathName.startsWith('/share/')) {
    return null
  }

  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => {
      setEnterDisabled(false)
    }, 300)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Prevent submission if input is empty and no files attached
    if (input.trim().length === 0 && attachedFiles.length === 0) return

    // Prevent submission during tool invocation
    if (isToolInvocationInProgress()) return

    clearChatHistoryCache()

    handleSubmit(e)
  }

  const handleNewChat = () => {
    setMessages([])
    closeArtifact()
    router.push('/')
  }

  const handleEnhancePrompt = async () => {
    // console.log("Clicked enhance prompt")
    setIsEnhancePromptLoading(true)
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: input })
      })

      if (!res.ok) {
        console.error('Enhance prompt failed:', res.statusText)
        return
      }

      const data = await res.json()
      // console.log("Enhanced prompt:", data)

      if (data?.enhancedPrompt) {
        handleInputChange({
          target: { value: data.enhancedPrompt }
        } as React.ChangeEvent<HTMLTextAreaElement>)
      }
      setIsEnhancePromptLoading(false)
    } catch (err) {
      setIsEnhancePromptLoading(false)
      console.error('Error enhancing prompt:', err)
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files)
    }
  }

  const isToolInvocationInProgress = () => {
    if (!messages.length) return false
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'assistant' || !lastMessage.parts) return false
    const parts = lastMessage.parts
    const lastPart = parts[parts.length - 1]
    return (
      lastPart?.type === 'tool-invocation' &&
      lastPart?.toolInvocation?.state === 'call'
    )
  }

  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      append({
        role: 'user',
        content: query
      })
      isFirstRender.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'O' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        handleNewChat()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleScrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div
      className={cn(
        'w-full group/form-container mx-auto max-w-2xl px-2 md:px-0',
        messages.length > 0 ? 'sticky bottom-0 pb-4 sm:pb-2' : 'px-2 sm:px-0'
      )}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center mb-1 md:mt-10">
          <h1 className="text-2xl sm:text-3xl md:text-3xl pb-2 font-medium txt-grad">
            How can i help you today?
          </h1>
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className={cn('w-full mx-auto relative max-w-2xl')}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          multiple={false}
          accept=".pdf, .jpg, .jpeg, .png, .gif, .webp"
          onChange={e => onFileUpload(e.target.files)}
          className="hidden"
          disabled={isFileUploading}
        />

        {/* Scroll to bottom button */}
        {showScrollToBottomButton && messages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -top-12 border border-foreground/5 right-4 z-20 size-8 rounded-full bg-accent/20 dark:bg-card boring-dark:bg-card backdrop-blur-sm shadow-sm hover:bg-accent/60 hover:dark:bg-card/70 transition-all"
            onClick={handleScrollToBottom}
            title="Scroll to bottom"
          >
            <ChevronDown size={16} />
          </Button>
        )}

        <div className="bg-background">
          {!user && messages.length > 0 && (
            <div className="bg-accent text-accent-foreground mx-4 py-2 text-sm rounded-t-2xl text-center px-4">
              You haven't logged in yet. Please{' '}
              <Link href="/auth/login" className="text-primary font-semibold">
                login
              </Link>{' '}
              to increase your chat limits and save your chat history.
            </div>
          )}

          <div
            className={cn(
              'relative flex flex-col w-full p-2.5 transition-all duration-300',
              'bg-accent/20 dark:bg-card boring-dark:bg-accent backdrop-blur-xl',
              'ring-1 ring-border/20 border border-border dark:border-sidebar-ring/10 dark:ring-sidebar-ring/5',
              // "shadow-sm",
              'rounded-[20px]',
              isDragging &&
              'ring-2 ring-primary bg-primary/5 border-primary/50',
              state.isIncognito &&
              'border border-dashed border-primary dark:border-primary/60'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Display attached files within the container */}
            {(attachedFiles.length > 0 || isFileUploading) && (
              <div className="flex flex-wrap gap-2 px-2 pt-2">
                {attachedFiles.map(file => (
                  <div
                    key={file.id}
                    className="group relative flex items-center gap-2 bg-muted/40 hover:bg-muted/60 pl-2 pr-1 py-1.5 rounded-lg border border-border/40 transition-colors max-w-[200px]"
                  >
                    <div className="shrink-0 flex items-center justify-center size-8 rounded-md bg-background border border-border/50">
                      <FileText size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-medium text-foreground truncate pr-2">
                        <Link
                          href={file.url}
                          target="_blank"
                          className="hover:underline"
                        >
                          {file.name}
                        </Link>
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate uppercase">
                        {file.type.split('/')[1] || 'FILE'} •{' '}
                        {(file.size / 1024).toFixed(0)}KB
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isFileUploading) {
                          onRemoveFile(file.id)
                        }
                      }}
                      className={cn(
                        'absolute -top-1.5 -right-1.5 size-5 bg-background border border-border text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10',
                        isFileUploading && 'hidden'
                      )}
                      title="Remove file"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {/* File uploading placeholder */}
                {isFileUploading && (
                  <div className="flex items-center gap-2 bg-muted/40 px-3 py-2 rounded-lg border border-border/40 animate-pulse">
                    <Loader2 size={14} className="text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground">
                      {uploadingCount > 1
                        ? `Uploading ${uploadingCount} files...`
                        : uploadingCount === 1
                          ? 'Uploading file...'
                          : 'Uploading...'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Textarea Area */}
            <div className="relative w-full">
              {/* Inline Selected Apps (Mentions) */}
              {selectedApps.length > 0 && (
                <div
                  ref={chipsRef}
                  className="absolute left-2 top-2 flex flex-wrap gap-1.5 z-10 pointer-events-none"
                >
                  {selectedApps.map(app => {
                    const config = CONNECTOR_CONFIGS[app]
                    const Icon = config ? PROVIDER_ICONS[config.icon] : null

                    return (
                      <div
                        key={app}
                        className="inline-flex items-center gap-1 bg-muted/80 px-2 py-1 rounded-lg border border-border/50 text-[11px] font-medium text-foreground/80 pointer-events-auto"
                      >
                        <div className="shrink-0 flex items-center justify-center size-3.5">
                          {Icon && <Icon className="size-full" />}
                        </div>
                        <span className="truncate max-w-[100px]">
                          {config?.name || app}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              <Textarea
                ref={inputRef}
                name="input"
                rows={1}
                maxRows={12}
                tabIndex={0}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder={
                  selectedApps.length > 0
                    ? ''
                    : messages.length === 0
                      ? 'Ask a question or type @ to mention'
                      : 'Ask follow up questions or type @ to mention'
                }
                spellCheck={true}
                autoFocus={true}
                value={input}
                disabled={isToolInvocationInProgress()}
                style={{
                  textIndent:
                    selectedApps.length > 0 ? `${chipsWidth}px` : '0px'
                }}
                className="w-full resize-none HiddenScrollbar bg-transparent text-foreground placeholder:text-foreground/60 outline-none text-[15px] leading-relaxed py-2 px-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]"
                onChange={e => {
                  const newValue = e.target.value
                  const selectionStart = e.target.selectionStart || 0
                  handleInputChange(e)

                  // Check for @ mention
                  const lastAtIndex = newValue.lastIndexOf(
                    '@',
                    selectionStart - 1
                  )
                  if (lastAtIndex !== -1) {
                    const charBefore =
                      lastAtIndex > 0 ? newValue[lastAtIndex - 1] : null
                    const isCorrectContext =
                      lastAtIndex === 0 ||
                      charBefore === ' ' ||
                      charBefore === '\n'

                    const textAfterAt = newValue.slice(
                      lastAtIndex + 1,
                      selectionStart
                    )
                    // Ensure it's not a multi-word or has spaces
                    if (isCorrectContext && !textAfterAt.includes(' ')) {
                      setMentionOpen(true)
                      setMentionSearch(textAfterAt)
                      setMentionStartIndex(lastAtIndex)

                      // Calculate position
                      if (inputRef.current) {
                        const rect = inputRef.current.getBoundingClientRect()
                        setMentionRect(rect)
                      }
                    } else {
                      setMentionOpen(false)
                    }
                  } else {
                    setMentionOpen(false)
                  }
                }}
                onKeyDown={e => {
                  // Handle mention popover navigation
                  if (mentionOpen) {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      // We'll let the Command component handle it
                    }
                    if (e.key === 'Escape') {
                      setMentionOpen(false)
                      return
                    }
                  }

                  // Handle Backspace to remove last selected app if input is empty
                  if (
                    e.key === 'Backspace' &&
                    input === '' &&
                    selectedApps.length > 0
                  ) {
                    onRemoveApp(selectedApps[selectedApps.length - 1])
                  }

                  // Only handle Enter key, ignore all other keys including spacebar
                  if (e.key === 'Enter') {
                    if (!e.shiftKey && !isComposing && !enterDisabled) {
                      if (
                        input.trim().length === 0 &&
                        attachedFiles.length === 0
                      ) {
                        e.preventDefault()
                        return
                      }
                      e.preventDefault()
                      const textarea = e.target as HTMLTextAreaElement
                      textarea.form?.requestSubmit()
                    }
                  }
                }}
                onFocus={() => setShowEmptyScreen(true)}
                onBlur={() => setShowEmptyScreen(true)}
              />

              {/* Right Actions: Send & Enhance */}
              <div className="flex flex-col gap-1.5 shrink-0 pt-0.5 pr-0.5"></div>
            </div>

            {/* Bottom Toolbar: Model Selector & Actions */}
            <div className="flex justify-between items-center pt-2 mt-0 pl-1 pr-1">
              <div className="flex items-center gap-2">
                <ModelSelector models={models ?? []} />
              </div>

              <div className="flex items-center gap-1.5">
                {/* Enhance prompt button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size={'icon'}
                      variant={'ghost'}
                      className={cn(
                        'size-8 rounded-full bg-transparent hover:bg-muted/60 border-border text-foreground hover:text-foreground transition-all duration-200 border-0',
                        (isEnhancePromptLoading || isFileUploading) &&
                        'animate-pulse duration-1000 bg-transparent opacity-50 cursor-not-allowed'
                      )}
                      onClick={handleEnhancePrompt}
                      disabled={
                        isEnhancePromptLoading ||
                        isFileUploading ||
                        input.length === 0
                      }
                      title={
                        isFileUploading
                          ? 'Wait for file upload'
                          : 'Enhance prompt'
                      }
                    >
                      {isEnhancePromptLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <WandSparkles size={16} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Enhance prompt
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {messages.length > 0 && (
                      <Button
                        type="button"
                        size={'icon'}
                        variant={'ghost'}
                        onClick={handleNewChat}
                        className={cn(
                          ' size-8 rounded-full bg-transparent hover:bg-muted/60 border-border text-foreground hover:text-foreground transition-opacity duration-200 ease-in-out border-0',
                          open && !isMobile && 'hidden'
                        )}
                        disabled={isLoading || isToolInvocationInProgress()}
                      >
                        <MessageCirclePlus size={18} />
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    <p>New chat</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size={'icon'}
                      variant={'ghost'}
                      className={cn(
                        'size-8 rounded-full bg-transparent hover:bg-muted/60 border-border text-foreground hover:text-foreground transition-all duration-200 border-0',
                        isFileUploading && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={handleFileButtonClick}
                      disabled={isFileUploading}
                      title={
                        isFileUploading ? 'Uploading file...' : 'Attach files'
                      }
                    >
                      <Paperclip size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Attach files
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type={isLoading ? 'button' : 'submit'}
                      size={'icon'}
                      variant={'ghost'}
                      disabled={
                        !isLoading && (input.length === 0 || isFileUploading)
                      }
                      className={cn(
                        'size-8 transition-all duration-200 rounded-lg',
                        'bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'
                      )}
                      onClick={isLoading ? stop : undefined}
                    >
                      {isLoading ? (
                        <Square size={16} className="fill-current" />
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {isLoading ? 'Stop generating' : 'Send message'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </form>

      {messages.length === 0 && (
        // 80px
        <div className="mb-8 md:mb-[34px]">
          <EmptyScreen
            submitMessage={message => {
              handleInputChange({
                target: { value: message }
              } as React.ChangeEvent<HTMLTextAreaElement>)
            }}
            className={cn(
              showEmptyScreen ? 'visible' : 'invisible',
              input.length !== 0
                ? 'opacity-0 transition-opacity duration-200'
                : 'opacity-100 transition-opacity duration-200'
            )}
          />
        </div>
      )}

      {mentionOpen && (
        <MentionPopover
          open={mentionOpen}
          onOpenChange={setMentionOpen}
          searchQuery={mentionSearch}
          onSearchQueryChange={setMentionSearch}
          anchorRect={mentionRect}
          onSelect={item => {
            if (inputRef.current) {
              // Get the text before the @
              const before = input.slice(0, mentionStartIndex)
              // Get the text after the current cursor position (search query)
              const after = input.slice(inputRef.current.selectionStart || 0)

              // Trigger app selection
              onSelectApp(item.id)

              // Clear the @mentions query from the input text
              const newValue = `${before}${after}`

              handleInputChange({
                target: { value: newValue }
              } as React.ChangeEvent<HTMLTextAreaElement>)

              setMentionOpen(false)
              // Restore focus
              setTimeout(() => {
                inputRef.current?.focus()
                const newPos = before.length
                inputRef.current?.setSelectionRange(newPos, newPos)
              }, 0)
            }
          }}
        />
      )}
    </div>
  )
}
