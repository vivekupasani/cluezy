'use client'

import { useState } from 'react'

import { useChat } from '@ai-sdk/react'
import { ToolInvocation } from 'ai'

import type { SearchResults as TypeSearchResults } from '@/lib/types'

import { useArtifact } from '@/components/artifact/artifact-context'

import { useIsMobile } from '@/hooks/use-mobile'
import { CollapsibleMessage } from './collapsible-message'
import { SearchSkeleton } from './default-skeleton'
import { SearchResults } from './search-results'
import { ToolArgsSection } from './section'
// import { XSearchResults } from './x-search-results' // This line is removed as per instruction

interface SearchSectionProps {
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  chatId: string
}

export function SearchSection({
  tool,
  isOpen,
  onOpenChange,
  chatId
}: SearchSectionProps) {
  const { status } = useChat({
    id: chatId
  })
  const isLoading = status === 'submitted' || status === 'streaming'
  const isMobile = useIsMobile()
  const isToolLoading = tool.state === 'call'
  const searchResults: TypeSearchResults =
    tool.state === 'result' ? tool.result : undefined
  const query = !isMobile ? (tool.args?.query as string | undefined) : (tool.args?.query as string | undefined)?.slice(0, 40) + '...'
  const includeDomains = tool.args?.includeDomains as string[] | undefined
  const includeDomainsString = includeDomains
    ? ` [${includeDomains.join(', ')}]`
    : ''

  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false)

  const { open } = useArtifact()
  const header = (
    <button
      type="button"
      onClick={() => open({ type: 'tool-invocation', toolInvocation: tool })}
      className="flex items-center justify-between w-full text-left rounded-md p-1"
      title="Open details"
    >
      <ToolArgsSection
        tool="search"
        number={searchResults?.results?.length}
      >{`${query}${includeDomainsString}`}</ToolArgsSection>
    </button>
  )

  return (
    <div className='mt-4'>
      <CollapsibleMessage
        role="assistant"
        isCollapsible={true}
        header={header}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        showIcon={false}
      >
        {isLoading && isToolLoading ? (
          <div>
            <SearchSkeleton />
            {/* <Section title="Images">
              <ImageSkeleton />
            </Section> */}
          </div>
        ) : searchResults?.results ? (
          <SearchResults results={searchResults.results} />
        ) : null}

        {/* {searchResults &&
          searchResults.images &&
          searchResults.images.length > 0 && (
            <Section title='Images'>
              <SearchResultsImageSection
                images={searchResults.images}
                query={query}
              />
            </Section>
          )} */}
      </CollapsibleMessage>
    </div>
  )
}
