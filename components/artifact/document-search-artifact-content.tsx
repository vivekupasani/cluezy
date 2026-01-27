'use client'

import { DocumentData, DocumentSearchResults } from '@/components/document-search-results'
import { Section } from '@/components/section'
import type { ToolInvocation } from 'ai'

export function DocumentSearchArtifactContent({ tool }: { tool: ToolInvocation }) {
    const data: DocumentData[] =
        tool.state === 'result' ? tool.result.result.organic : []
    const query = tool.args?.query as string | undefined
    const toolName = tool.toolName || ""

    const sectionTitle = {
        pdfSearch: "PDFs",
        docSearch: "Documents",
        pptSearch: "Presentations"
    }[toolName] || "Search"

    if (!data || data.length === 0) {
        return <div className="p-4">No results found</div>
    }

    return (
        <div className="space-y-4">
            <Section title={sectionTitle}>
                <DocumentSearchResults results={data} isArtifact={true} />
            </Section>
        </div>
    )
}
