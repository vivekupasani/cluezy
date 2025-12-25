'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'

import { Message } from 'ai'
import {
  ArrowUp,
  ChevronDown,
  Loader2,
  Paperclip,
  Square,
  WandSparkles
} from 'lucide-react'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

import { useArtifact } from './artifact/artifact-context'
import { EmptyScreen } from './empty-screen'
import { ModelSelector } from './model-selector'
import { clearChatHistoryCache } from './sidebar/chat-history-client'
import { Button } from './ui/button'
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
  scrollContainerRef: React.RefObject<HTMLDivElement>
  // Add file upload props
  attachedFiles: FileAttachment[]
  isFileUploading: boolean
  onFileUpload: (files: FileList | null) => void
  onRemoveFile: (fileId: string) => void
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
  onFileUpload,
  onRemoveFile
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

  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => {
      setEnterDisabled(false)
    }, 300)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent submission if input is empty and no files attached
    if (input.trim().length === 0 && attachedFiles.length === 0) return;

    // Prevent submission during tool invocation
    if (isToolInvocationInProgress()) return;

    clearChatHistoryCache()

    handleSubmit(e);
  };

  const handleNewChat = () => {
    setMessages([])
    closeArtifact()
    router.push('/')
  }

  const handleEnhancePrompt = async () => {
    console.log("Clicked enhance prompt")
    setIsEnhancePromptLoading(true)
    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (!res.ok) {
        console.error("Enhance prompt failed:", res.statusText)
        return
      }

      const data = await res.json()
      // console.log("Enhanced prompt:", data)

      if (data?.enhancedPrompt) {
        handleInputChange({
          target: { value: data.enhancedPrompt },
        } as React.ChangeEvent<HTMLTextAreaElement>)
      }
      setIsEnhancePromptLoading(false)
    } catch (err) {
      setIsEnhancePromptLoading(false)
      console.error("Error enhancing prompt:", err)
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
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
        'w-full group/form-container shrink-0 mx-auto max-w-2xl px-2 md:px-0',
        messages.length > 0
          ? 'sticky bottom-0 pb-4 sm:pb-4'
          : 'px-0 sm:px-0'
      )}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-start mb-4 ml-4">
          <h1 className='text-2xl md:text-3xl tracking-tight mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/60'>Hello Vivek!</h1>
          <h1 className='text-3xl md:text-4xl tracking-tight mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/60'>How can i help you today?</h1>
        </div>
      )}



      {/* Display attached files */}
      {(attachedFiles.length > 0 || isFileUploading) && (
        <div className="flex flex-wrap gap-2 mb-3 ml-3 max-w-4xl mx-auto">
          {attachedFiles.map(file => (
            <div key={file.id} className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-lg border">
              <span className="text-xs text-foreground/80">
                <Link href={file.url} target='_blank'>{file.name}</Link>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!isFileUploading) {
                    onRemoveFile(file.id)
                  }
                }}
                className={cn(
                  "text-destructive hover:text-destructive/80 text-xs",
                  isFileUploading && "opacity-50 cursor-not-allowed"
                )}
                title={isFileUploading ? "Wait for upload to complete" : "Remove file"}
                disabled={isFileUploading}
              >
                ×
              </button>
            </div>
          ))}

          {/* File uploading placeholder */}
          {isFileUploading && (
            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-lg border-2 border-dotted border-primary animate-pulse">
              <Loader2 size={14} className="text-primary animate-spin" />
              <span className="text-xs text-foreground/80">
                Uploading file...
              </span>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className={cn('w-full mx-auto relative max-w-3xl')}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          multiple={false}
          accept=".pdf, .jpg, .jpeg"
          onChange={(e) => onFileUpload(e.target.files)}
          className="hidden"
          disabled={isFileUploading}
        />

        {/* Scroll to bottom button */}
        {showScrollToBottomButton && messages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -top-12 border border-border right-4 z-20 size-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background transition-all"
            onClick={handleScrollToBottom}
            title="Scroll to bottom"
          >
            <ChevronDown size={16} />
          </Button>
        )}

        <div className={cn(
          "relative flex flex-col w-full p-2.5 transition-all duration-300",
          "bg-card/80 backdrop-blur-xl",
          "border border-border",
          "ring-1 ring-border",
          "shadow-sm",
          isMobile ? (input.length > 30 ? "rounded-[24px]" : "rounded-[26px]") : "rounded-[12px]"
        )}>
          {/* Textarea Area */}
          <div className="flex items-start gap-2 min-h-[44px]">
            {/* Left Actions: Attach & Model Selector */}
            <div className="flex flex-col gap-1.5 shrink-0 pt-0.5 pl-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    size={'icon'}
                    variant={'ghost'}
                    className={cn(
                      'size-8 rounded-full text-muted-foreground/80 hover:text-foreground hover:bg-secondary/40 transition-colors',
                      isFileUploading && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={handleFileButtonClick}
                    disabled={isFileUploading}
                    title={isFileUploading ? "Uploading file..." : "Attach files"}
                  >
                    <Paperclip size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach files</TooltipContent>
              </Tooltip>
            </div>

            <Textarea
              ref={inputRef}
              name="input"
              rows={1}
              maxRows={12}
              tabIndex={0}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={messages.length === 0 ? "Ask anything..." : "Ask follow up questions..."}
              spellCheck={true}
              autoFocus={true}
              value={input}
              disabled={isToolInvocationInProgress()}
              className="flex-1 resize-none HiddenScrollbar bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-[15px] leading-relaxed py-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px]"
              onChange={e => {
                handleInputChange(e)
              }}
              onKeyDown={e => {
                // Only handle Enter key, ignore all other keys including spacebar
                if (e.key === 'Enter') {
                  if (
                    !e.shiftKey &&
                    !isComposing &&
                    !enterDisabled
                  ) {
                    if (input.trim().length === 0 && attachedFiles.length === 0) {
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
            <div className="flex flex-col gap-1.5 shrink-0 pt-0.5 pr-0.5">
              {/* Send button (always visible or condition based on your preference? Originally was mostly bottom right) */}
              {/* Let's put Enhance and Send stacked if needed, or side-by-side? Side-by-side seems better for height. */}
              {/* Actually, let's keep them in the bottom row if we want a big text area, OR right aligned.
                   The new standard is typically bottom right corner of the box. */}
            </div>
          </div>

          {/* Bottom Toolbar: Model Selector & Actions */}
          <div className="flex justify-between items-center pt-2 mt-1 border-t border-border pl-1 pr-1">
            <div className="flex items-center gap-2">
              <ModelSelector models={models ?? []} />
            </div>

            <div className="flex items-center gap-1.5">
              {/* Enhance prompt button */}
              {input.length !== 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type='button'
                      size={'icon'}
                      variant={'ghost'}
                      className={cn(
                        'size-8 rounded-full text-muted-foreground/80 hover:text-foreground hover:bg-secondary/40 transition-colors',
                        (isEnhancePromptLoading || isFileUploading) && 'animate-pulse bg-transparent opacity-50 cursor-not-allowed'
                      )}
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancePromptLoading || isFileUploading}
                      title={isFileUploading ? "Wait for file upload" : "Enhance prompt"}
                    >
                      <WandSparkles size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Enhance prompt</TooltipContent>
                </Tooltip>
              )}

              {/* Send button */}
              <Button
                type={isLoading ? 'button' : 'submit'}
                size={'icon'}
                variant={'ghost'}
                className={cn(
                  'size-8 rounded-2xl transition-all duration-200',
                  isLoading || input.length > 0
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground',
                  isLoading && 'animate-pulse'
                )}
                disabled={
                  (input.length === 0 && attachedFiles.length === 0 && !isLoading) ||
                  isToolInvocationInProgress() ||
                  isFileUploading
                }
                onClick={isLoading ? stop : undefined}
                title={isFileUploading ? "Wait for file upload" : (isLoading ? "Stop generating" : "Send message")}
              >
                {isLoading ? (
                  <Square size={14} className='fill-current' />
                ) : (
                  <ArrowUp size={16} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {messages.length === 0 && (
        <div className="mb-8 px-4">
          <EmptyScreen
            submitMessage={message => {
              handleInputChange({
                target: { value: message }
              } as React.ChangeEvent<HTMLTextAreaElement>)
            }}
            className={cn(showEmptyScreen ? 'visible' : 'invisible')}
          />
        </div>
      )}
    </div>
  )
}