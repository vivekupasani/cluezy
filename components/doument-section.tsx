'use client'

import { useState } from 'react'
import Link from 'next/link'

import { ToolInvocation } from "ai"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { SearchSkeleton } from "./default-skeleton"
import { Section } from "./section"

interface DateTimeSectionProps {
    tool: ToolInvocation
}

export interface DocumentData {
    link: string
    position: number
    snippet: string
    title: string
}

export const DocumentSection = ({ tool }: DateTimeSectionProps) => {
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

    // Loading state
    if (isToolLoading) {
        return <SearchSkeleton />
    }

    // No results → don't show anything
    if (!data || data.length === 0) return null

    return <SectionTile data={data} sectionTitle={sectionTitle} />
}

interface SectionTileProps {
    data: DocumentData[]
    sectionTitle: string
}

const SectionTile = ({ data, sectionTitle }: SectionTileProps) => {

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
        <div className="mx-6">
            <Section title={sectionTitle}>
                <div className="flex flex-wrap -m-1">

                    {displayed.map((item, index) => (
                        <div className="w-1/2 md:w-1/4 p-1" key={index}>
                            <Link href={item.link} target="_blank">
                                <div className="flex-1 h-full hover:bg-muted/50 transition-colors bg-gradient-to-br from-primary-foreground/55 via-primary-foreground/70 to-primary-foreground/45 backdrop-blur-sm drop-shadow-sm border border-border rounded-lg">
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
                            <div className="flex-1 flex h-full items-center justify-center bg-gradient-to-br from-primary-foreground/55 via-primary-foreground/70 to-primary-foreground/45 backdrop-blur-sm border border-border rounded-lg">
                                <Button variant="link" onClick={() => setShowAll(true)}>
                                    View {extraCount} more
                                </Button>
                            </div>
                        </div>
                    )}

                    {showAll && extraCount > 0 && (
                        <div className="w-1/2 md:w-1/4 p-1">
                            <div className="flex-1 flex h-full items-center justify-center bg-gradient-to-br from-primary-foreground/55 via-primary-foreground/70 to-primary-foreground/45 backdrop-blur-sm border border-border rounded-lg">
                                <Button variant="link" onClick={() => setShowAll(false)}>
                                    View less
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </Section>
        </div>
    )
}
