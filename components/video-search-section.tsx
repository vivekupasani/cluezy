'use client'

import { useChat } from '@ai-sdk/react'
import { ToolInvocation } from 'ai'

import type { SerperSearchResults } from '@/lib/types'

import { useArtifact } from '@/components/artifact/artifact-context'

import { useIsMobile } from '@/hooks/use-mobile'
import { CollapsibleMessage } from './collapsible-message'
import { VideoSearchSkeleton } from './default-skeleton'
import { Section, ToolArgsSection } from './section'
import { VideoSearchResults } from './video-search-results'

interface VideoSearchSectionProps {
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  chatId: string
}

export function VideoSearchSection({
  tool,
  isOpen,
  onOpenChange,
  chatId
}: VideoSearchSectionProps) {
  const { status } = useChat({
    id: chatId
  })
  const isLoading = status === 'submitted' || status === 'streaming'

  const isToolLoading = tool.state === 'call'
  const videoResults: SerperSearchResults =
    tool.state === 'result' ? tool.result : undefined
  const query = !useIsMobile ? (tool.args?.query as string | undefined) : (tool.args?.query as string | undefined)?.slice(0, 50) + '...'

  const { open } = useArtifact()
  const header = (
    <button
      type="button"
      onClick={() => open({ type: 'tool-invocation', toolInvocation: tool })}
      className="flex items-center justify-between w-full text-left rounded-md p-1 -ml-1"
      title="Open details"
    >
      <ToolArgsSection tool="videoSearch" number={videoResults?.videos?.length}>
        {query}
      </ToolArgsSection>
    </button>
  )

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showIcon={false}
    >
      {!isToolLoading && videoResults ? (
        <Section title="Videos">
          <VideoSearchResults results={videoResults} />
        </Section>
      ) : (
        <div>
          <Section title="Videos">
            <VideoSearchSkeleton />
          </Section>
        </div>
      )}
    </CollapsibleMessage>
  )
}
