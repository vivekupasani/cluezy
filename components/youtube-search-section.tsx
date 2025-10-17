"use client"

import { ToolInvocation } from "ai"
import { Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface YoutubeSearchSectionProps {
    tool: ToolInvocation
}

interface Video {
    description: string
    publishedDate: string
    thumbnail_url: string
    title: string
    url: string
    videoId: string
}

interface YoutubeData {
    results: Video[]
}

export const YoutubeSearchSection = ({ tool }: YoutubeSearchSectionProps) => {
    const data = tool.state === "result" ? (tool.result as YoutubeData) : undefined
    console.log("YouTube video search data: ", data)

    const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())

    const toggleDescription = (videoId: string) => {
        setExpandedDescriptions(prev => {
            const newSet = new Set(prev)
            if (newSet.has(videoId)) {
                newSet.delete(videoId)
            } else {
                newSet.add(videoId)
            }
            return newSet
        })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatDescription = (description: string, videoId: string, isExpanded: boolean) => {
        if (!description) return "No description available"

        const cleanDescription = description.replace(/\\n/g, "\n")

        if (!isExpanded && cleanDescription.length > 150) {
            return cleanDescription.slice(0, 150) + "..."
        }

        return cleanDescription
    }

    if (!data || !data.results || data.results.length === 0) {
        return (
            <div className="flex flex-col w-[99%] mx-2 justify-center items-center bg-card/30 px-5 py-2 rounded-2xl border border-border">
                <div className="flex w-full justify-between border-b border-border pt-2 pb-4">
                    <span className="text-sm">YOUTUBE SEARCH</span>
                    <span className="flex justify-center items-center">
                        <Play className="h-3" />
                        <p className="text-xs">N/A</p>
                    </span>
                </div>
                <div className="py-8 flex flex-col items-center">
                    <p>No videos found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-[98%] mx-3 justify-center items-center px-5 pt-2">
            <div className="w-full py-6">
                {/* Responsive grid: 1 column on mobile, 2 on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.results.map((video, index) => {
                        const isExpanded = expandedDescriptions.has(video.videoId)
                        const formattedDescription = formatDescription(video.description, video.videoId, isExpanded)
                        const shouldShowReadMore = video.description && video.description.replace(/\\n/g, "\n").length > 150

                        return (
                            <div
                                key={index}
                                className="rounded-lg flex flex-col border border-border overflow-hidden hover:bg-muted/50 transition-colors"
                            >
                                <Image
                                    src={video.thumbnail_url}
                                    height={200}
                                    width={400}
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="flex flex-col p-4 space-y-2">
                                    <span className="font-medium line-clamp-2">{video.title}</span>
                                    <span className="text-xs text-foreground/50">{formatDate(video.publishedDate)}</span>
                                    <p className="text-sm text-foreground/70 whitespace-pre-line">
                                        {formattedDescription}
                                    </p>
                                    {shouldShowReadMore && (
                                        <button
                                            onClick={() => toggleDescription(video.videoId)}
                                            className="text-xs text-blue-500 hover:underline self-start"
                                        >
                                            {isExpanded ? "Show less" : "Read more"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
