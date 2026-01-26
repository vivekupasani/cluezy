'use client'

import { useArtifact } from '@/components/artifact/artifact-context'
import type { SearchResults as TypeSearchResults } from '@/lib/types'
import { useChat } from '@ai-sdk/react'
import { ToolInvocation } from 'ai'
import { CollapsibleMessage } from './collapsible-message'
import { XSearchSkeleton } from './default-skeleton'
import { Section, ToolArgsSection } from './section'
import { XSearchResults } from './x-search-results'

interface XSearchSectionProps {
    tool: ToolInvocation
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    chatId: string
}

export function XSearchSection({
    tool,
    isOpen,
    onOpenChange,
    chatId
}: XSearchSectionProps) {
    const { status } = useChat({
        id: chatId
    })
    const isLoading = status === 'submitted' || status === 'streaming'

    const isToolLoading = tool.state === 'call'
    const searchResults: TypeSearchResults =
        tool.state === 'result' ? tool.result : undefined
    const query = tool.args?.query as string | undefined

    const { open } = useArtifact()
    const header = (
        <button
            type="button"
            onClick={() => open({ type: 'tool-invocation', toolInvocation: tool })}
            className="flex items-center justify-between w-full text-left rounded-md p-1"
            title="Open details"
        >
            <ToolArgsSection
                tool="xSearch"
                number={searchResults?.results?.length}
            >{`${query}`}</ToolArgsSection>
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
                        <Section title="X (Twitter) Search Results">
                            <XSearchSkeleton />
                        </Section>
                    </div>
                ) : searchResults?.results ? (
                    <Section title="X (Twitter) Search Results">
                        {/* @ts-ignore */}
                        <XSearchResults results={searchResults.results} />
                    </Section>
                ) : null}
            </CollapsibleMessage>
        </div>
    )
}
