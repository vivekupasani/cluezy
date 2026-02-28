'use client'

import { useEffect, useRef, useState } from 'react'

import { SerperSearchResultItem } from '@/lib/types'

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface VideoCarouselDialogProps {
  children: React.ReactNode
  videos: SerperSearchResultItem[]
  query: string
  initialIndex?: number // Add initialIndex prop
}

export function VideoCarouselDialog({
  children,
  videos,
  query,
  initialIndex = 0 // Default to 0
}: VideoCarouselDialogProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(initialIndex + 1) // Initialize with initialIndex
  const [count, setCount] = useState(0)
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([])

  // Update the current and count state when the carousel api is available
  useEffect(() => {
    if (api) {
      setCount(api.scrollSnapList().length)
      // Initialize current based on initialIndex
      setCurrent(api.selectedScrollSnap() + 1)

      api.on('select', () => {
        const newCurrent = api.selectedScrollSnap() + 1
        if (current !== undefined && videoRefs.current[current - 1]) {
          const prevVideo = videoRefs.current[current - 1]
          prevVideo?.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          )
        }
        setCurrent(newCurrent)
      })
    }
  }, [api, current]) // Keep dependency on current to stop previous video

  // Scroll to the initial index when the dialog opens and API is ready
  useEffect(() => {
    if (api) {
      api.scrollTo(initialIndex, false) // Scroll instantly
    }
  }, [api, initialIndex])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95%] border-border/50 bg-popover p-0 backdrop-blur-2xl sm:w-full sm:max-w-4xl overflow-hidden shadow-2xl">
        <div className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-xl text-start font-semibold tracking-tight">
                  Video Preview
                </DialogTitle>
                <DialogDescription className="line-clamp-1 text-sm text-start text-foreground">
                  {query}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground border border-border/50">
                <span className="text-foreground">{current}</span>
                <span className="opacity-50">/</span>
                <span>{count}</span>
              </div>
            </div>
          </DialogHeader>

          <div className="relative flex flex-1 items-center justify-center p-4 min-h-0">
            <Carousel
              setApi={setApi}
              opts={{
                startIndex: initialIndex,
                loop: videos.length > 1
              }}
              className="w-full h-full max-w-3xl"
            >
              <CarouselContent className="h-full rounded-2xl">
                {videos.map((video, idx) => {
                  const videoId = video.link.split('v=')[1]
                  return (
                    <CarouselItem
                      key={idx}
                      className="flex items-center justify-center h-[50vh] sm:h-[60vh]"
                    >
                      <div className="relative h-full w-full p-2">
                        <div className="h-full w-full overflow-hidden rounded-xl shadow-2xl drop-shadow-2xl">
                          <iframe
                            ref={el => {
                              videoRefs.current[idx] = el
                            }}
                            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                            className="w-full h-full"
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>

              {videos.length > 1 && (
                <div className="absolute inset-0 mx-2 pointer-events-none flex items-center justify-between p-4">
                  <CarouselPrevious className="pointer-events-auto h-12 w-12 rounded-full border-none bg-background/20 text-foreground backdrop-blur-xl transition-all hover:bg-background/40 active:scale-95 disabled:hidden sm:-left-16" />
                  <CarouselNext className="pointer-events-auto h-12 w-12 rounded-full border-none bg-background/20 text-foreground backdrop-blur-xl transition-all hover:bg-background/40 active:scale-95 disabled:hidden sm:-right-16" />
                </div>
              )}
            </Carousel>
          </div>

          <div className="p-4 border-t border-border/50">
            <div className="flex justify-center gap-1">
              {videos.slice(0, 10).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => api?.scrollTo(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    current === idx + 1
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
              {videos.length > 10 && (
                <span className="text-[10px] text-muted-foreground px-1">
                  ...
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
