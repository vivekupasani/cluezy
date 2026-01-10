/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'

import { PlusCircle, Search } from 'lucide-react'

import { SearchResultImage } from '@/lib/types'

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

interface SearchResultsImageSectionProps {
  images: SearchResultImage[]
  query?: string
  displayMode?: 'preview' | 'full'
}

export const SearchResultsImageSection: React.FC<
  SearchResultsImageSectionProps
> = ({ images, query, displayMode = 'preview' }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Calculate convertedImages first, before any hooks that might depend on it or early returns
  let convertedImages: { url: string; description: string }[] = []
  if (images && images.length > 0) {
    // Check images array before accessing its elements
    if (typeof images[0] === 'string') {
      convertedImages = (images as string[]).map(image => ({
        url: image,
        description: ''
      }))
    } else {
      convertedImages = images as { url: string; description: string }[]
    }
  }

  // Update the current and count state when the carousel api is available
  useEffect(() => {
    if (!api) {
      return
    }

    // Set initial count from scroll snaps, current from selected snap
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }
    api.on('select', handleSelect)

    // Cleanup listener on unmount or when api changes
    return () => {
      api.off('select', handleSelect)
    }
  }, [api])

  // Update count based on the actual number of converted images
  // This ensures the count reflects the data, even if the carousel API is slow
  useEffect(() => {
    setCount(convertedImages.length)
  }, [convertedImages.length])

  // Scroll to the selected index when it changes or api becomes available
  useEffect(() => {
    if (api && convertedImages.length > 0) {
      const actualIndex = Math.min(
        selectedIndex,
        Math.max(0, convertedImages.length - 1) // Ensure index is not negative
      )
      api.scrollTo(actualIndex, false) // Use false for instant scroll on open
    }
    // Add convertedImages.length as dep: scroll might need adjustment if images load async
  }, [api, selectedIndex, convertedImages.length])

  // Early return AFTER all hooks if there are no images to display
  if (convertedImages.length === 0) {
    return <div className="text-muted-foreground">No images found</div>
  }

  const renderImageGrid = (
    imageSubset: { url: string; description: string }[],
    gridClasses: string,
    startIndex: number = 0,
    isFullMode: boolean = false // Add flag to indicate full mode for corner rounding
  ) => (
    <div className={gridClasses}>
      {imageSubset.map((image, index) => {
        const actualIndex = startIndex + index
        // Determine corner rounding based on index in full mode 2x3 layout
        let cornerClasses = '' // Default to no rounding
        if (isFullMode) {
          if (actualIndex === 0)
            cornerClasses = 'rounded-tl-lg' // Top-left
          else if (actualIndex === 1)
            cornerClasses = 'rounded-tr-lg' // Top-right
          else if (actualIndex === 2)
            cornerClasses = 'rounded-bl-lg' // Bottom-left
          // Index 3 (bottom-middle) gets no rounding
          else if (actualIndex === 4) cornerClasses = 'rounded-br-lg' // Bottom-right
        } else {
          cornerClasses = 'rounded-lg' // Default for preview mode
        }

        return (
          <Dialog key={actualIndex}>
            {/* main images grid */}
            <DialogTrigger asChild>
              <div
                className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-muted/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
                onClick={() => setSelectedIndex(actualIndex)}
              >
                <div className="h-full w-full">
                  {image ? (
                    <img
                      src={image.url}
                      alt={`Image ${actualIndex + 1}`}
                      // Apply specific or default rounding
                      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${cornerClasses}`}
                      onError={e =>
                      (e.currentTarget.src =
                        '/images/placeholder-image.png')
                      }
                    />
                  ) : (
                    <div className="w-full h-full animate-pulse bg-muted" />
                  )}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                  <div className="scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    <div className="rounded-full bg-white/20 p-2 backdrop-blur-md">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>

                {displayMode === 'preview' &&
                  actualIndex === 3 &&
                  convertedImages.length > 4 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white backdrop-blur-[2px] transition-colors group-hover:bg-black/50">
                      <PlusCircle className="mb-1 h-6 w-6" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        +{convertedImages.length - 4} More
                      </span>
                    </div>
                  )}
              </div>
            </DialogTrigger>

            {/* full image preview mode */}
            <DialogContent className="max-h-[90vh] w-[95%] border-border/50 bg-background/80 p-0 backdrop-blur-2xl sm:w-full sm:max-w-4xl overflow-hidden shadow-2xl">
              <div className="flex flex-col h-full max-h-[90vh]">
                <DialogHeader className="p-6 pb-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <DialogTitle className="text-xl text-start font-semibold tracking-tight">
                        Image Preview
                      </DialogTitle>
                      <DialogDescription className="line-clamp-1 text-sm text-start text-muted-foreground">
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

                <div className="relative flex flex-1 items-center justify-center p-4 min-h-0 bg-black/5">
                  <Carousel
                    setApi={setApi}
                    opts={{
                      startIndex: selectedIndex,
                      loop: convertedImages.length > 1
                    }}
                    className="w-full h-full max-w-3xl"
                  >
                    <CarouselContent className="h-full">
                      {convertedImages.map((img, idx) => (
                        <CarouselItem key={idx} className="flex items-center justify-center h-[50vh] sm:h-[60vh]">
                          <div className="relative h-full w-full p-2 group">
                            <img
                              src={img.url}
                              alt={img.description || `Image ${idx + 1}`}
                              className="h-full w-full rounded-lg object-contain drop-shadow-2xl transition-all duration-500"
                              onError={e =>
                              (e.currentTarget.src =
                                '/images/placeholder-image.png')
                              }
                            />
                            {img.description && (
                              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[80%] rounded-full bg-black/60 px-4 py-2 text-center text-xs text-white backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
                                {img.description}
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {convertedImages.length > 1 && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-between p-4">
                        <CarouselPrevious className="pointer-events-auto h-12 w-12 rounded-full border-none bg-background/20 text-foreground backdrop-blur-xl transition-all hover:bg-background/40 active:scale-95 disabled:hidden sm:-left-16" />
                        <CarouselNext className="pointer-events-auto h-12 w-12 rounded-full border-none bg-background/20 text-foreground backdrop-blur-xl transition-all hover:bg-background/40 active:scale-95 disabled:hidden sm:-right-16" />
                      </div>
                    )}
                  </Carousel>
                </div>

                {/* Thumbnail strip or additional controls could go here */}
                <div className="p-4 bg-muted/20 border-t border-border/50">
                  <div className="flex justify-center gap-1">
                    {convertedImages.slice(0, 10).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => api?.scrollTo(idx)}
                        className={`h-1 rounded-full transition-all duration-300 ${current === idx + 1 ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                          }`}
                      />
                    ))}
                    {convertedImages.length > 10 && <span className="text-[10px] text-muted-foreground px-1">...</span>}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      })}
    </div>
  )

  if (displayMode === 'full') {
    // Original 2 rows: 2 images + 3 images
    const firstRowImages = convertedImages.slice(0, 2)
    const secondRowImages = convertedImages.slice(2, 5)

    // Render two rows, passing isFullMode=true to apply specific rounding
    return (
      <div className="flex flex-col gap-2">
        {renderImageGrid(
          firstRowImages,
          'grid grid-cols-2 gap-2',
          0,
          true // Pass true for isFullMode
        )}
        {secondRowImages.length > 0 && // Only render second row if images exist
          renderImageGrid(
            secondRowImages,
            'grid grid-cols-3 gap-2',
            2,
            true // Pass true for isFullMode
          )}
      </div>
    )
  }

  // Default to preview mode (2x2 or 4 wide grid)
  const previewImages = convertedImages.slice(0, 4)
  // Preview mode uses default rounding (rounded-lg), so isFullMode=false
  return renderImageGrid(
    previewImages,
    'grid grid-cols-2 md:grid-cols-4 gap-2',
    0,
    false
  )
}
