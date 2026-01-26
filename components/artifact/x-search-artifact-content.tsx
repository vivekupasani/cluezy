'use client'

import { SearchResultsImageSection } from '@/components/search-results-image'
import { Section, ToolArgsSection } from '@/components/section'
import { XSearchResults } from '@/components/x-search-results'
import type { SearchResults as TypeSearchResults } from '@/lib/types'
import type { ToolInvocation } from 'ai'

export function XSearchArtifactContent({ tool }: { tool: ToolInvocation }) {
    const searchResults: TypeSearchResults =
        tool.state === 'result' ? tool.result : undefined
    const query = tool.args?.query as string | undefined

    if (!searchResults?.results) {
        return <div className="p-4">No search results</div>
    }

    return (
        <div className="space-y-4">
            <ToolArgsSection tool="xSearch">{`${query}`}</ToolArgsSection>

            {searchResults.images && searchResults.images.length > 0 && (
                <SearchResultsImageSection
                    images={searchResults.images}
                    query={query}
                    displayMode="full"
                />
            )}

            <Section title="X (Twitter) Search Results">
                {/* @ts-ignore */}
                <XSearchResults results={searchResults.results} />
            </Section>
        </div>
    )
}
