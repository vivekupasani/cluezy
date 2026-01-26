'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { ExaSearchResultItem } from '@/lib/types'
import { Book, Github, Hash, User } from 'lucide-react'
import Link from 'next/link'

interface GithubSearchResultsProps {
    results: ExaSearchResultItem[]
    isArtifect?: boolean
}

export function GithubSearchResults({ results, isArtifect }: GithubSearchResultsProps) {

    const getRepoInfo = (url: string, author?: string, title?: string) => {
        try {
            const urlObj = new URL(url)
            const pathParts = urlObj.pathname.split('/').filter(Boolean)

            if (pathParts[0] === 'topics') {
                return { type: 'topic', owner: 'Topic', name: pathParts[1] || 'Topic', icon: Hash }
            }
            if (pathParts.length >= 2) {
                return { type: 'repo', owner: pathParts[0], name: pathParts[1], icon: Book }
            }
            if (pathParts.length === 1) {
                return { type: 'user', owner: 'User', name: pathParts[0], icon: User }
            }
        } catch (e) {
            // fallthrough
        }
        return { type: 'unknown', owner: author || 'GitHub', name: title || url, icon: Github }
    }

    const cleanText = (text?: string) => {
        if (!text) return null
        if (text.includes('Navigation Menu') || text.includes('Sign in') || text.includes('Skip to content')) {
            const meaningfulStart = text.indexOf('## Here are')
            if (meaningfulStart !== -1) {
                return text.slice(meaningfulStart).replace(/## Here are\n\d+ public repositories\nmatching this topic.../, '').trim()
            }
            const parts = text.split('Search or jump to...')
            if (parts.length > 1) {
                return parts[1].slice(0, 300).trim() + '...'
            }
        }
        return text
    }

    return (
        <div className={`flex flex-col gap-2 ${!isArtifect ? 'h-96 overflow-y-auto HiddenScrollbar' : 'h-full'}`}>
            {results.map((result, index) => {
                const info = getRepoInfo(result.url, result.author, result.title)
                const cleanedText = cleanText(result.text)
                // @ts-ignore - image property exists in the result
                const repoImage = result.image
                // @ts-ignore - favicon property exists in the result
                const favicon = result.favicon

                return (
                    <Link
                        key={result.id}
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <Card className="w-full hover:bg-muted/50 transition-colors border-border/50">
                            <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                    <Avatar className="h-8 w-8 flex-shrink-0 rounded-md">
                                        <AvatarImage
                                            src={favicon || `https://github.com/${info.owner}.png`}
                                            alt={info.owner}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="rounded-md">
                                            <Github className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className="font-semibold text-xs text-foreground hover:underline">
                                                {result.author || info.owner}
                                            </span>
                                            <span className="text-muted-foreground text-xs">/</span>
                                            <span className="font-semibold text-xs text-foreground hover:underline">
                                                {info.name}
                                            </span>
                                        </div>

                                        {result.title && (
                                            <p className="text-xs text-muted-foreground mb-1">
                                                {result.title}
                                            </p>
                                        )}

                                        {cleanedText && (
                                            <div className="text-xs text-foreground/80 line-clamp-2 prose prose-sm max-w-none">
                                                {cleanedText}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}
