
import { ToolInvocation } from "ai"

import { useArtifact } from './artifact/artifact-context'
import { CollapsibleMessage } from './collapsible-message'
import { DocumentSearchSkeleton } from './default-skeleton'
import { DocumentSearchResults } from './document-search-results'
import { ToolArgsSection } from "./section"

interface DocumentSectionProps {
    tool: ToolInvocation
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export interface DocumentData {
    link: string
    position: number
    snippet: string
    title: string
}

export const DocumentSection = ({ tool, isOpen, onOpenChange }: DocumentSectionProps) => {
    const isToolLoading = tool.state === "call"
    const data: DocumentData[] =
        tool.state === "result" ? tool.result.result.organic : []

    const toolName = tool.toolName || ""

    // Map name → clean title
    const sectionTitle = {
        pdfSearch: "PDFs",
        docSearch: "Documents",
        pptSearch: "Presentations"
    }[toolName] || "Search"  // default

    const query = tool.args?.query as string | undefined

    const { open } = useArtifact()

    // Header for collapsible
    const header = (
        <button
            type="button"
            onClick={() => open({ type: 'tool-invocation', toolInvocation: tool })}
            className="flex items-center justify-between w-full text-left rounded-md p-1"
            title="Open details"
        >
            <ToolArgsSection
                tool={toolName}
                number={data?.length}
            >{`${query}`}</ToolArgsSection>
        </button>
    )

    // Loading state
    if (isToolLoading) {
        return (
            <CollapsibleMessage
                role="assistant"
                isCollapsible={true}
                header={header}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                showIcon={false}
            >
                <DocumentSearchSkeleton />
            </CollapsibleMessage>
        )
    }

    // No results → don't show anything
    if (!data || data.length === 0) return null

    return (
        <CollapsibleMessage
            role='assistant'
            isCollapsible={true}
            header={header}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            showIcon={false}
        >
            <DocumentSearchResults results={data} />
        </CollapsibleMessage>
    )
}
