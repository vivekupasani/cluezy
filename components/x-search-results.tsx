'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { ExaSearchResultItem } from '@/lib/types'
import Link from 'next/link'

interface XSearchResultsProps {
    results: ExaSearchResultItem[]
    isArtifect?: boolean
}

export function XSearchResults({ results, isArtifect }: XSearchResultsProps) {
    return (
        <div className={`flex flex-col gap-2 ${!isArtifect ? 'h-96 overflow-y-auto HiddenScrollbar' : 'h-full'}`}>
            {results.map((result) => (
                <Link
                    key={result.id}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <Card className="w-full hover:bg-muted/50 transition-colors border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage
                                        src={`https://unavatar.io/twitter/${result.author.replace('@', '')}`}
                                        alt={result.author}
                                    />
                                    <AvatarFallback>{result.author[0]?.toUpperCase() || 'X'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-semibold text-xs truncate">{result.author}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(result.publishedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground/90 whitespace-pre-wrap break-words line-clamp-4">
                                        {result.text}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}