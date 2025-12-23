'use client'

import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Message } from 'ai'
import {
  ArrowUp,
  ChevronDown,
  Loader2,
  Paperclip,
  Search,
  Square,
  WandSparkles
} from 'lucide-react'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

import { useArtifact } from './artifact/artifact-context'
import { clearChatHistoryCache } from './sidebar/chat-history-client'
import { Button } from './ui/button'
import { EmptyScreen } from './empty-screen'

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
        'w-full group/form-container shrink-0 mx-auto max-w-2xl',
        'pr-2 sm:pr-2 sm:px-0',
        messages.length > 0
          ? 'sticky bottom-0 pb-4 sm:pb-4 px-2'
          : 'px-2 sm:px-0'
      )}
    >
      {/* <div className='w-full'>
        <Image
          src="/cluezy-logo.png"
          alt="Cluezy Logo"
          width={50}
          height={20}
          className="mx-auto"
        />
      </div> */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center mb-4">
          <h1 className='text-4xl md:text-5xl tracking-tight mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/60'>ask a question</h1>
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
                  "text-red-500 hover:text-red-700 text-xs",
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
        className={cn('w-full mx-auto relative max-w-4xl')}
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
            className="absolute -top-10 border border-border right-2 sm:right-4 z-20 size-7 sm:size-8 rounded-full bg-gradient-to-tr from-card/55 via-card/70 to-card/45 backdrop-blur-sm drop-shadow-sm"
            onClick={handleScrollToBottom}
            title="Scroll to bottom"
          >
            <ChevronDown size={14} className="sm:size-4" />
          </Button>
        )}

        <div className={cn(
          'bg-background',
          isMobile ? (input.length > 30 ? "rounded-3xl" : "rounded-full") : (input.length > 66 ? "rounded-3xl" : "rounded-full")
        )}>
          <div className={cn(
            "relative flex flex-row items-start gap-3 px-3 py-[10px] w-full bg-card border border-border/80 transition-colors drop-shadow-sm",
            isMobile ? (input.length > 30 ? "rounded-3xl" : "rounded-full") : (input.length > 66 ? "rounded-3xl" : "rounded-full")
          )}>
            {/* Icon */}
            <div className="flex justify-center items-center pt-[6px] rounded-xl">
              <Search className='text-foreground/70' size={18} />
            </div>
            <div className="flex-1 flex flex-row items-center gap-3">
              <Textarea
                ref={inputRef}
                name="input"
                rows={1}
                maxRows={12}
                tabIndex={0}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="Ask anything, find anything..."
                spellCheck={true}
                autoFocus={true}
                value={input}
                disabled={isToolInvocationInProgress()}
                className="flex-1 resize-none HiddenScrollbar bg-transparent text-foreground/90 placeholder:text-neutral-500 outline-none text-sm disabled:cursor-not-allowed disabled:opacity-50 min-h-6"
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

              <div className="flex items-center gap-1">
                {/* File upload button */}
                <Button
                  type='button'
                  size={'icon'}
                  variant={'ghost'}
                  className={cn(
                    'flex-shrink-0 text-foreground/70 hover:bg-transparent hover:text-forground disabled:opacity-50 transition-colors rounded-full size-8',
                    isFileUploading && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={handleFileButtonClick}
                  disabled={isFileUploading}
                  title={isFileUploading ? "Uploading file..." : "Attach files"}
                >
                  <Paperclip size={18} className='hover:text-foreground' />
                </Button>

                {/* Enhance prompt button */}
                {input.length !== 0 && (
                  <Button
                    type='button'
                    size={'icon'}
                    variant={'ghost'}
                    className={cn(
                      'flex-shrink-0 text-foreground/70 hover:bg-transparent hover:text-forground disabled:opacity-50 transition-colors rounded-full size-8',
                      (isEnhancePromptLoading || isFileUploading) && 'animate-pulse bg-transparent opacity-50 cursor-not-allowed'
                    )}
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancePromptLoading || isFileUploading}
                    title={isFileUploading ? "Wait for file upload" : "Enhance prompt"}
                  >
                    <WandSparkles size={18} className='hover:text-foreground' />
                  </Button>
                )}

                {/* Send button */}
                <Button
                  type={isLoading ? 'button' : 'submit'}
                  size={'icon'}
                  variant={'ghost'}
                  className={cn(
                    'flex-shrink-0 text-foreground/70 hover:text-forground hover:bg-transparent disabled:opacity-50 transition-colors rounded-full size-8',
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
                    <Square size={18} className='hover:text-foreground' />
                  ) : (
                    <ArrowUp size={18} className='hover:text-foreground' />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {messages.length === 0 && (
          <EmptyScreen
            submitMessage={message => {
              handleInputChange({
                target: { value: message }
              } as React.ChangeEvent<HTMLTextAreaElement>)
            }}
            className={cn(showEmptyScreen ? 'visible' : 'invisible')}
          />
        )}

        {
          messages.length === 0 && (
            <div
              className={cn(
                "items-center mt-4 justify-center h-10",
                messages.length === 0 ? "flex" : "hidden sm:flex"
              )}
            >
              {/* <ModelSelector models={models ?? []} /> */}
            </div>
          )
        }
      </form>
    </div>
  )
}