'use client'

import { GithubSearchResults } from '@/components/github-search-results'
import { SearchResultsImageSection } from '@/components/search-results-image'
import { Section } from '@/components/section'
import type { SearchResults as TypeSearchResults } from '@/lib/types'
import type { ToolInvocation } from 'ai'

export function GithubSearchArtifactContent({ tool }: { tool: ToolInvocation }) {
    const searchResults: TypeSearchResults =
        tool.state === 'result' ? tool.result : undefined
    const query = tool.args?.query as string | undefined

    if (!searchResults?.results) {
        return <div className="p-4">No search results</div>
    }

    return (
        <div className="space-y-4">
            {/* <ToolArgsSection tool="githubSearch">{`${query}`}</ToolArgsSection> */}

            {searchResults.images && searchResults.images.length > 0 && (
                <SearchResultsImageSection
                    images={searchResults.images}
                    query={query}
                    displayMode="full"
                />
            )}

            <Section title="Github Search Results">
                {/* @ts-ignore */}
                <GithubSearchResults results={searchResults.results} isArtifect={true} />
            </Section>
        </div>
    )
}
