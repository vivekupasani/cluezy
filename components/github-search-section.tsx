'use client'

import { useArtifact } from '@/components/artifact/artifact-context'
import type { SearchResults as TypeSearchResults } from '@/lib/types'
import { useChat } from '@ai-sdk/react'
import { ToolInvocation } from 'ai'
import { CollapsibleMessage } from './collapsible-message'
import { GithubSearchSkeleton } from './default-skeleton'
import { GithubSearchResults } from './github-search-results'
import { Section, ToolArgsSection } from './section'

interface GithubSearchSectionProps {
    tool: ToolInvocation
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    chatId: string
}

export function GithubSearchSection({
    tool,
    isOpen,
    onOpenChange,
    chatId
}: GithubSearchSectionProps) {
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
                tool="githubSearch"
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
                        <Section title="Github Search Results">
                            <GithubSearchSkeleton />
                        </Section>
                    </div>
                ) : searchResults?.results ? (
                    <Section title="Github Search Results">
                        {/* @ts-ignore */}
                        <GithubSearchResults results={searchResults.results} />
                    </Section>
                ) : null}
            </CollapsibleMessage>
        </div>
    )
}
