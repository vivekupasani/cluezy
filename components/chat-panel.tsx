'use client'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'
import { Message } from 'ai'
import {
  ArrowUp,
  ChevronDown,
  Square
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { useArtifact } from './artifact/artifact-context'
import { EmptyScreen } from './empty-screen'
import { ModelSelector } from './model-selector'
import Shuffle from './Shuffle'
import { clearChatHistoryCache } from './sidebar/chat-history-client'
import { Button } from './ui/button'
import { TextLoop } from './ui/text-loop'

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
  scrollContainerRef
}: ChatPanelProps) {
  const [showEmptyScreen, setShowEmptyScreen] = useState(true)
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true)
  const [isComposing, setIsComposing] = useState(false)
  const [enterDisabled, setEnterDisabled] = useState(false)
  const { close: closeArtifact } = useArtifact()
  const [isEnhancePromptLoading, setIsEnhancePromptLoading] = useState(false)

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

    // Prevent submission if input is empty
    if (input.trim().length === 0) return;

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
      console.log("Enhanced prompt:", data)

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
        'w-full group/form-container shrink-0 mx-auto max-w-3xl',
        'pr-2 sm:pr-2 sm:px-0',
        messages.length > 0
          ? 'sticky bottom-0 pb-6 sm:pb-4 px-2'
          : 'px-2 sm:px-0'
      )}
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center mb-4">
          {/* <div className="hover:cursor-pointer animate-pulse">
            <svg
              width="47"
              height="47"
              viewBox="0 0 67 61"
              fill="#"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3005 0.699779C20.8082 -0.578424 23.588 0.143417 25.9499 1.42244L26.4167 1.68513L28.6023 2.96247L26.0466 7.33259L23.8611 6.05525L23.4987 5.85115C21.7476 4.90719 20.8945 5.06001 20.5993 5.21052L20.5974 5.2115C20.3386 5.34332 19.8126 5.80655 19.5027 7.36482C19.1998 8.88797 19.2017 11.0438 19.6101 13.7545C19.8211 15.1551 20.1361 16.6653 20.5495 18.2613C22.1931 18.0179 23.9047 17.8189 25.6706 17.6724C28.6264 12.8954 31.7867 8.83092 34.8327 5.83064C37.0075 3.68855 39.2282 1.98401 41.3718 0.994701C43.4163 0.0511988 45.7899 -0.409936 47.9665 0.59431L48.1765 0.696849L48.1814 0.698802L48.4763 0.859935C49.9147 1.69909 50.8447 3.04229 51.407 4.50447C51.9991 6.04486 52.2414 7.85058 52.2507 9.75837L52.2634 12.2896L47.2009 12.314L47.1882 9.78279L47.1765 9.22224C47.1288 7.95843 46.9419 6.99866 46.6814 6.32087C46.3936 5.57244 46.0779 5.31117 45.8825 5.20954L45.7644 5.16072C45.4399 5.05237 44.7574 5.00837 43.4939 5.59138C42.0827 6.24264 40.339 7.5129 38.3855 9.43708C36.2937 11.4974 34.0814 14.1905 31.903 17.3746C32.3463 17.3684 32.7917 17.3638 33.239 17.3638C41.8221 17.3638 49.699 18.5193 55.5173 20.4586C58.4131 21.4238 60.9394 22.6293 62.7937 24.0904C64.6193 25.5291 66.1451 27.514 66.1452 30.0201C66.1452 32.1797 65.0015 33.9608 63.5398 35.3121C62.0784 36.6629 60.0921 37.7913 57.8298 38.7252L55.49 39.691L53.5583 35.0113L55.8982 34.0455C57.8546 33.2379 59.2443 32.3883 60.1032 31.5943C60.9614 30.8009 61.0827 30.27 61.0827 30.0201C61.0826 29.7299 60.9082 29.0507 59.6599 28.067C58.4397 27.1056 56.5174 26.1292 53.9167 25.2623C48.7409 23.5372 41.4295 22.4263 33.239 22.4263C31.6757 22.4263 30.1445 22.4671 28.654 22.5445C27.9089 23.8362 27.1787 25.1813 26.4695 26.5728C25.8806 27.7282 25.329 28.8782 24.8103 30.0142C25.1254 30.7045 25.4506 31.401 25.7917 32.0992L26.4734 33.4635V33.4644L27.1775 34.8179C30.7282 41.5073 34.7419 47.0141 38.3855 50.6031C40.3387 52.527 42.0821 53.7973 43.4929 54.4478C44.7565 55.0304 45.4389 54.9853 45.7634 54.8765L45.8806 54.8277C46.1119 54.7092 46.5492 54.3381 46.8669 53.1383C47.184 51.9406 47.2892 50.2198 47.0779 47.9976C46.6831 43.8493 45.2356 38.449 42.7771 32.5592L42.2722 31.3746L41.2614 29.0543L45.9021 27.0318L46.9128 29.3531L47.445 30.5992C50.0387 36.8108 51.6614 42.7201 52.1179 47.5172C52.3603 50.0654 52.2884 52.4438 51.7614 54.4342C51.2685 56.2961 50.2944 58.0892 48.5407 59.1392L48.1794 59.3385L48.1775 59.3394C45.9445 60.4761 43.4838 60.018 41.3728 59.0445C39.2288 58.0558 37.0075 56.3526 34.8327 54.2105C30.5674 50.0092 26.0796 43.7193 22.2439 36.3052C20.9345 39.965 20.0488 43.3625 19.6091 46.2838C19.2012 48.9946 19.1986 51.1508 19.5017 52.6744C19.7732 54.0386 20.2106 54.5639 20.489 54.7623L20.5974 54.8287L20.5993 54.8306L20.6853 54.8668C21.1678 55.0413 22.4748 55.0383 24.9714 53.2681L27.0359 51.8043L29.9646 55.9342L27.8991 57.398C25.0405 59.4249 21.4555 60.9513 18.2976 59.3394V59.3385C16.0661 58.2007 14.9904 55.9417 14.5368 53.6627C14.0761 51.3471 14.148 48.5485 14.6023 45.5299C15.285 40.9934 16.8817 35.6297 19.2741 30.0142C18.41 27.9856 17.6525 25.9888 17.0017 24.0533C15.3928 24.4095 13.9055 24.8146 12.5622 25.2623C9.96118 26.1292 8.03827 27.1055 6.81808 28.067C5.56972 29.0507 5.39534 29.7299 5.39523 30.0201C5.39523 30.4715 5.88581 31.6987 8.77609 33.2105L11.0183 34.3843L8.67258 38.8697L6.42941 37.6968C3.31907 36.0699 0.332733 33.5647 0.332733 30.0201C0.332837 27.5141 1.85868 25.5291 3.6843 24.0904C5.53851 22.6293 8.06485 21.4238 10.9607 20.4586C12.3781 19.9861 13.9181 19.5612 15.5603 19.1871C15.1476 17.5531 14.8269 15.9866 14.6042 14.5084C14.1496 11.4905 14.0765 8.6927 14.5368 6.37751C14.9903 4.0976 16.0669 1.83699 18.3005 0.699779ZM22.2644 20.5894C20.7666 20.5894 19.5516 21.8036 19.5515 23.3013C19.5515 24.7992 20.7665 26.0133 22.2644 26.0133C23.7621 26.013 24.9763 24.7991 24.9763 23.3013C24.9762 21.8037 23.762 20.5896 22.2644 20.5894Z"
                fill="white"
              />
            </svg>
          </div> */}
          {/* <RotatingText /> */}
          <Shuffle
            text="Ask a question"
            shuffleDirection="right"
            duration={0.85}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
            loop={true}
          />
        </div>
      )}
      <form
        onSubmit={handleFormSubmit}
        className={cn('w-full mx-auto relative max-w-4xl')}
      >
        {/* Scroll to bottom button */}
        {showScrollToBottomButton && messages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -top-10 right-2 sm:right-4 z-20 size-7 sm:size-8 rounded-full bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-sm shadow-inner shadow-card-foreground/10"
            onClick={handleScrollToBottom}
            title="Scroll to bottom"
          >
            <ChevronDown size={14} className="sm:size-4" />
          </Button>
        )}

        <div className={cn(
          "relative flex flex-row items-start gap-3 px-4 py-3 w-full bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-sm shadow-inner shadow-card-foreground/10 rounded-[22px] border-b border-border/50 transition-colors"
        )}>
          {/* Icon */}
          <div className="flex-shrink-0">
            <svg
              width="28"
              height="28"
              viewBox="0 0 67 61"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3005 0.699779C20.8082 -0.578424 23.588 0.143417 25.9499 1.42244L26.4167 1.68513L28.6023 2.96247L26.0466 7.33259L23.8611 6.05525L23.4987 5.85115C21.7476 4.90719 20.8945 5.06001 20.5993 5.21052L20.5974 5.2115C20.3386 5.34332 19.8126 5.80655 19.5027 7.36482C19.1998 8.88797 19.2017 11.0438 19.6101 13.7545C19.8211 15.1551 20.1361 16.6653 20.5495 18.2613C22.1931 18.0179 23.9047 17.8189 25.6706 17.6724C28.6264 12.8954 31.7867 8.83092 34.8327 5.83064C37.0075 3.68855 39.2282 1.98401 41.3718 0.994701C43.4163 0.0511988 45.7899 -0.409936 47.9665 0.59431L48.1765 0.696849L48.1814 0.698802L48.4763 0.859935C49.9147 1.69909 50.8447 3.04229 51.407 4.50447C51.9991 6.04486 52.2414 7.85058 52.2507 9.75837L52.2634 12.2896L47.2009 12.314L47.1882 9.78279L47.1765 9.22224C47.1288 7.95843 46.9419 6.99866 46.6814 6.32087C46.3936 5.57244 46.0779 5.31117 45.8825 5.20954L45.7644 5.16072C45.4399 5.05237 44.7574 5.00837 43.4939 5.59138C42.0827 6.24264 40.339 7.5129 38.3855 9.43708C36.2937 11.4974 34.0814 14.1905 31.903 17.3746C32.3463 17.3684 32.7917 17.3638 33.239 17.3638C41.8221 17.3638 49.699 18.5193 55.5173 20.4586C58.4131 21.4238 60.9394 22.6293 62.7937 24.0904C64.6193 25.5291 66.1451 27.514 66.1452 30.0201C66.1452 32.1797 65.0015 33.9608 63.5398 35.3121C62.0784 36.6629 60.0921 37.7913 57.8298 38.7252L55.49 39.691L53.5583 35.0113L55.8982 34.0455C57.8546 33.2379 59.2443 32.3883 60.1032 31.5943C60.9614 30.8009 61.0827 30.27 61.0827 30.0201C61.0826 29.7299 60.9082 29.0507 59.6599 28.067C58.4397 27.1056 56.5174 26.1292 53.9167 25.2623C48.7409 23.5372 41.4295 22.4263 33.239 22.4263C31.6757 22.4263 30.1445 22.4671 28.654 22.5445C27.9089 23.8362 27.1787 25.1813 26.4695 26.5728C25.8806 27.7282 25.329 28.8782 24.8103 30.0142C25.1254 30.7045 25.4506 31.401 25.7917 32.0992L26.4734 33.4635V33.4644L27.1775 34.8179C30.7282 41.5073 34.7419 47.0141 38.3855 50.6031C40.3387 52.527 42.0821 53.7973 43.4929 54.4478C44.7565 55.0304 45.4389 54.9853 45.7634 54.8765L45.8806 54.8277C46.1119 54.7092 46.5492 54.3381 46.8669 53.1383C47.184 51.9406 47.2892 50.2198 47.0779 47.9976C46.6831 43.8493 45.2356 38.449 42.7771 32.5592L42.2722 31.3746L41.2614 29.0543L45.9021 27.0318L46.9128 29.3531L47.445 30.5992C50.0387 36.8108 51.6614 42.7201 52.1179 47.5172C52.3603 50.0654 52.2884 52.4438 51.7614 54.4342C51.2685 56.2961 50.2944 58.0892 48.5407 59.1392L48.1794 59.3385L48.1775 59.3394C45.9445 60.4761 43.4838 60.018 41.3728 59.0445C39.2288 58.0558 37.0075 56.3526 34.8327 54.2105C30.5674 50.0092 26.0796 43.7193 22.2439 36.3052C20.9345 39.965 20.0488 43.3625 19.6091 46.2838C19.2012 48.9946 19.1986 51.1508 19.5017 52.6744C19.7732 54.0386 20.2106 54.5639 20.489 54.7623L20.5974 54.8287L20.5993 54.8306L20.6853 54.8668C21.1678 55.0413 22.4748 55.0383 24.9714 53.2681L27.0359 51.8043L29.9646 55.9342L27.8991 57.398C25.0405 59.4249 21.4555 60.9513 18.2976 59.3394V59.3385C16.0661 58.2007 14.9904 55.9417 14.5368 53.6627C14.0761 51.3471 14.148 48.5485 14.6023 45.5299C15.285 40.9934 16.8817 35.6297 19.2741 30.0142C18.41 27.9856 17.6525 25.9888 17.0017 24.0533C15.3928 24.4095 13.9055 24.8146 12.5622 25.2623C9.96118 26.1292 8.03827 27.1055 6.81808 28.067C5.56972 29.0507 5.39534 29.7299 5.39523 30.0201C5.39523 30.4715 5.88581 31.6987 8.77609 33.2105L11.0183 34.3843L8.67258 38.8697L6.42941 37.6968C3.31907 36.0699 0.332733 33.5647 0.332733 30.0201C0.332837 27.5141 1.85868 25.5291 3.6843 24.0904C5.53851 22.6293 8.06485 21.4238 10.9607 20.4586C12.3781 19.9861 13.9181 19.5612 15.5603 19.1871C15.1476 17.5531 14.8269 15.9866 14.6042 14.5084C14.1496 11.4905 14.0765 8.6927 14.5368 6.37751C14.9903 4.0976 16.0669 1.83699 18.3005 0.699779ZM22.2644 20.5894C20.7666 20.5894 19.5516 21.8036 19.5515 23.3013C19.5515 24.7992 20.7665 26.0133 22.2644 26.0133C23.7621 26.013 24.9763 24.7991 24.9763 23.3013C24.9762 21.8037 23.762 20.5896 22.2644 20.5894Z"
                fill="#888888"
              />
            </svg>
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
              placeholder=""
              spellCheck={true}
              autoFocus={true}
              value={input}
              disabled={isToolInvocationInProgress()}
              className="flex-1 resize-none HiddenScrollbar bg-transparent text-foreground placeholder:text-neutral-500 outline-none text-sm disabled:cursor-not-allowed disabled:opacity-50 min-h-6"
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
                    if (input.trim().length === 0) {
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

            {
              input.length === 0 && (
                <TextLoop className='absolute -z-20'>
                  {[
                    "What is Agentic AI and why is it trending in 2025?",
                    "Which AI tools are best for coding tasks in 2025?",
                  ].map((text) => (
                    <span key={text} className="block text-left text-card-foreground opacity-40 text-xs sm:text-sm select-none pointer-events-none">
                      {text}
                    </span>
                  ))}
                </TextLoop>
              )
            }

            {/* {messages.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleNewChat}
                className="flex-shrink-0 text-foreground bg-transparent border-none hover:text-forground hover:bg-neutral-800 disabled:opacity-50 transition-colors rounded-full size-8"
                type="button"
                disabled={isLoading || isToolInvocationInProgress()}
              >
                <MessageCirclePlus size={18} />
              </Button>
            )} */}

            {/* Send button */}
            <Button
              type={isLoading ? 'button' : 'submit'}
              size={'icon'}
              variant={'ghost'}
              className={cn(
                'flex-shrink-0 text-foreground hover:text-forground hover:bg-neutral-800 disabled:opacity-50 transition-colors rounded-full size-8',
                isLoading && 'animate-pulse'
              )}
              disabled={
                (input.length === 0 && !isLoading) ||
                isToolInvocationInProgress()
              }
              onClick={isLoading ? stop : undefined}
            >
              {isLoading ? (
                <Square size={18} />
              ) : (
                <ArrowUp size={18} />
              )}
            </Button>
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
                "items-center mt-4 justify-center",
                messages.length === 0 ? "flex" : "hidden sm:flex"
              )}
            >
              <ModelSelector models={models ?? []} />
            </div>
          )
        }

      </form>
    </div>
  )
}