'use client'

import Link from 'next/link'
import { useState } from 'react'

import { ToolInvocation } from "ai"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'


import { useArtifact } from './artifact/artifact-context'
import { CollapsibleMessage } from './collapsible-message'
import { SearchSkeleton } from "./default-skeleton"
import { Section, ToolArgsSection } from "./section"

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
                <SearchSkeleton />
            </CollapsibleMessage>
        )
    }

    // No results → don't show anything
    if (!data || data.length === 0) return null

    return <SectionTile data={data} sectionTitle={sectionTitle} header={header} isOpen={isOpen} onOpenChange={onOpenChange} />
}

interface SectionTileProps {
    data: DocumentData[]
    sectionTitle: string
    header: React.ReactNode
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const SectionTile = ({ data, sectionTitle, header, isOpen, onOpenChange }: SectionTileProps) => {

    const displayUrlName = (url: string) => {
        try {
            const hostname = new URL(url).hostname
            const parts = hostname.split('.')
            return parts.length > 2 ? parts.slice(1, -1).join('.') : parts[0]
        } catch {
            return "unknown"
        }
    }

    const [showAll, setShowAll] = useState(false)

    const displayed = showAll ? data : data.slice(0, 3)
    const extraCount = data.length > 3 ? data.length - 3 : 0
    return (
        <CollapsibleMessage
            role='assistant'
            isCollapsible={true}
            header={header}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            showIcon={false}
        >
            <Section title={sectionTitle}>
                <div className="flex flex-wrap -m-1">
                    {displayed.map((item, index) => (
                        <div className="w-1/2 md:w-1/4 p-1" key={index}>
                            <Link href={item.link} target="_blank">
                                <div className="flex-1 h-full hover:bg-muted/50 transition-colors bg-gradient-to-br from-card/55 via-card/70 to-card/45 backdrop-blur-sm drop-shadow-sm border border-border rounded-lg">
                                    <div className="p-2 flex flex-col justify-between h-full">

                                        <p className="text-xs line-clamp-2 min-h-[2rem] txt-grad">
                                            {item.title || item.snippet}
                                        </p>

                                        <div className="mt-2 flex items-center space-x-1">
                                            <Avatar className="h-4 w-4">
                                                <AvatarImage
                                                    src={`https://www.google.com/s2/favicons?domain=${new URL(item.link).hostname}`}
                                                />
                                                <AvatarFallback>
                                                    {new URL(item.link).hostname[0]}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="text-xs opacity-60 truncate txt-grad">
                                                {`${displayUrlName(item.link)} - ${item.position}`}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}

                    {!showAll && extraCount > 0 && (
                        <div className="w-1/2 md:w-1/4 p-1">
                            <div className="flex-1 flex justify-center items-center h-full hover:bg-muted/50 transition-colors bg-gradient-to-br from-card/55 via-card/70 to-card/45 backdrop-blur-sm drop-shadow-sm border border-border rounded-lg">
                                <Button
                                    variant={'link'}
                                    className="txt-grad hover:text-primary"
                                    onClick={() => setShowAll(true)}>
                                    View {extraCount} more
                                </Button>
                            </div>
                        </div>
                    )}

                    {showAll && extraCount > 0 && (
                        <div className="w-1/2 md:w-1/4 p-1">
                            <div className="flex-1 flex justify-center items-center h-full hover:bg-muted/50 transition-colors bg-gradient-to-br from-card/55 via-card/70 to-card/45 backdrop-blur-sm drop-shadow-sm border border-border rounded-lg">
                                <Button
                                    variant={'link'}
                                    className="txt-grad hover:text-primary"
                                    onClick={() => setShowAll(false)}>
                                    View less
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </Section>
        </CollapsibleMessage>
    )
}
