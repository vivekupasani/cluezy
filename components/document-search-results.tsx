'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export interface DocumentData {
  link: string
  position: number
  snippet: string
  title: string
}

interface DocumentSearchResultsProps {
  results: DocumentData[]
  isArtifact?: boolean
}

export function DocumentSearchResults({
  results,
  isArtifact
}: DocumentSearchResultsProps) {
  const displayUrlName = (url: string) => {
    try {
      const hostname = new URL(url).hostname
      const parts = hostname.split('.')
      return parts.length > 2 ? parts.slice(1, -1).join('.') : parts[0]
    } catch {
      return 'unknown'
    }
  }

  return (
    <div
      className={`flex flex-col w-full gap-0 ${!isArtifact ? 'h-72 overflow-y-auto HiddenScrollbar' : 'h-full'}`}
    >
      {results.map((result, index) => (
        <Link
          key={index}
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="w-full bg-transparent hover:bg-muted/50 border-none border-b border-transparent">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 flex-shrink-0 rounded-md">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${new URL(result.link).hostname}`}
                    alt={displayUrlName(result.link)}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-md">
                    {displayUrlName(result.link)[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-xs text-foreground hover:underline">
                      {displayUrlName(result.link)}
                    </span>
                  </div>

                  {result.title && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {result.title}
                    </p>
                  )}

                  {result.snippet && (
                    <div className="text-xs text-foreground/80 line-clamp-1 prose prose-sm max-w-none">
                      {result.snippet}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
