'use client'

import Image from 'next/image'

import { Play, PlusCircle } from 'lucide-react'

import { SerperSearchResultItem } from '@/lib/types'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

import { VideoCarouselDialog } from './video-carousel-dialog'

interface VideoResultGridProps {
  videos: SerperSearchResultItem[]
  query: string
  displayMode: 'chat' | 'artifact'
}

export function VideoResultGrid({
  videos,
  query,
  displayMode
}: VideoResultGridProps) {
  const containerClasses =
    displayMode === 'chat'
      ? 'flex flex-wrap'
      : 'grid grid-cols-1 sm:grid-cols-2 gap-4'

  const itemsToMap = displayMode === 'chat' ? videos.slice(0, 4) : videos

  return (
    <div className={containerClasses}>
      {itemsToMap.map((video, index) => {
        const baseUrl = video.imageUrl ? video.imageUrl.split('?')[0] : ''
        const showOverlay =
          displayMode === 'chat' && index === 3 && videos.length > 4
        const cardClasses = displayMode === 'chat' ? 'w-1/2 md:w-1/4 p-1' : ''

        return (
          <VideoCarouselDialog
            key={video.link || index}
            videos={videos} // Pass all filtered videos for the dialog
            query={query}
            initialIndex={index}
          >
            <div className={`group relative cursor-pointer ${cardClasses}`}>
              <Card className="flex-1 bg-card/60 backdrop-blur-sm min-h-40 overflow-hidden rounded-xl border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]">
                <CardContent className="p-0">
                  {baseUrl && (
                    <div className="relative w-full aspect-video bg-muted overflow-hidden">
                      <Image
                        src={video.imageUrl}
                        alt={`Thumbnail for ${video.title}`}
                        fill
                        sizes={
                          displayMode === 'chat'
                            ? '(max-width: 768px) 50vw, 25vw'
                            : '(max-width: 639px) 300px, 250px'
                        } // Different sizes per mode
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={index < 4}
                        onError={e => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/placeholder-image.png'
                        }}
                      />
                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                        <div className="scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                          <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                            <Play className="h-6 w-6 text-white fill-current" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-xs line-clamp-2 mb-2 font-semibold tracking-tight">
                      {video.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-4 w-4 border border-border/50">
                        <AvatarImage
                          src={`https://www.google.com/s2/favicons?domain=${new URL(video.link).hostname
                            }`}
                          alt={video.channel || video.source}
                        />
                        <AvatarFallback className="text-[8px]">
                          {new URL(video.link).hostname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-wider opacity-80">
                        {video.channel ||
                          video.source ||
                          new URL(video.link).hostname}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {showOverlay && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white backdrop-blur-[0.5px] transition-colors group-hover:bg-black/50 rounded-xl">
                  <PlusCircle className="mb-1 h-6 w-6" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    +{videos.length - 4} More
                  </span>
                </div>
              )}
            </div>
          </VideoCarouselDialog>
        )
      })}
    </div>
  )
}
