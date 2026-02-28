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
    <div
      className={`flex flex-col gap-0 ${!isArtifect ? 'h-64 overflow-y-auto HiddenScrollbar' : 'h-full'}`}
    >
      {results.map(result => (
        <Link
          key={result.id}
          href={
            result.url.startsWith('http') ? result.url : `https://${result.url}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="w-full bg-transparent hover:bg-muted/50 border-none shadow-none">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage
                    src={`https://unavatar.io/twitter/${result.author.replace('@', '')}`}
                    alt={result.author}
                  />
                  <AvatarFallback className="h-8 w-8">
                    {result.author[0]?.toUpperCase() || 'X'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-xs truncate">
                      {result.author}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(result.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 whitespace-pre-wrap break-words line-clamp-2">
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
