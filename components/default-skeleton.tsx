'use client'

import { Skeleton } from './ui/skeleton'

export const DefaultSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 pb-4 pt-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="w-full h-6" />
    </div>
  )
}

export const ChatLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 pb-4 w-full">
      {/* User message block */}
      <div className="flex justify-end w-full">
        <div className="bg-secondary dark:bg-muted/40 rounded-t-2xl rounded-tbr-sm rounded-bl-2xl p-4 max-w-[80%] w-full flex flex-col gap-2">
          <Skeleton className="h-4 w-[100%] rounded-full opacity-60 bg-secondary-foreground/10 dark:bg-muted" />
          <Skeleton className="h-4 w-[15%] rounded-full opacity-40 self-end bg-secondary-foreground/10 dark:bg-muted" />
        </div>
      </div>

      {/* AI Response Section */}
      <div className="flex flex-col gap-6">
        {/* Intro text */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-[96%] rounded-md" />
          <Skeleton className="h-4 w-[75%] rounded-md" />
        </div>

        {/* Section Header */}
        <Skeleton className="h-5 w-32 rounded-md mt-2" />

        {/* List items with icons */}
        <div className="flex flex-col gap-5 mt-1 ml-1">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="size-2 rounded-full mt-2 shrink-0" />
              <div className="flex flex-col gap-2.5 w-full">
                <Skeleton className="h-4 w-[88%] rounded-md" />
                <div className="flex gap-2 items-center">
                  <Skeleton className="size-1.5 rounded-full shrink-0 ml-1 opacity-30" />
                  <Skeleton className="h-3.5 w-[65%] rounded-md opacity-60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SearchSkeleton({ sourcesLength = 4 }: { sourcesLength?: number }) {
  return (
    <div className="flex flex-wrap">
      {[...Array(sourcesLength)].map((_, index) => (
        <div key={index} className="w-1/2 md:w-1/4 p-1">
          <div className="flex flex-col justify-between h-full min-h-[4.5rem] bg-card/40 backdrop-blur-sm border border-border/60 rounded-lg p-2 gap-2">
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-2 mt-auto">
              <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ImageSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 pb-0.5 mt-3">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="w-[calc(50%-0.5rem)] md:w-[calc(25%-0.5rem)]"
        >
          <Skeleton className="h-20 w-full bg-card/40" />
        </div>
      ))}
    </div>
  )
}

export function VideoSearchSkeleton() {
  return (
    <div className="flex flex-wrap">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="w-1/2 md:w-1/4 p-1">
          <div className="flex flex-col h-full bg-card/40 backdrop-blur-sm border border-border/60 rounded-xl overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <div className="p-3 gap-2 flex flex-col">
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function XSearchSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-full h-full">
          <div className="flex flex-col h-full p-4 border-none rounded-lg bg-transparent text-card-foreground shadow-sm">
            <div className="flex items-start space-x-3 mb-2">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0 bg-accent" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-24 bg-accent" />
                  <Skeleton className="h-3 w-16 bg-accent" />
                </div>
              </div>
            </div>
            <div className="space-y-1 mt-auto">
              <Skeleton className="h-3 w-full bg-accent" />
              <Skeleton className="h-3 w-[90%] bg-accent" />
              <Skeleton className="h-3 w-[80%] bg-accent" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function GithubSearchSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-full">
          <div className="flex items-start space-x-3 p-4 border-none rounded-lg bg-transparent text-card-foreground shadow-sm">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0 bg-accent" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-24 bg-accent" />
                <Skeleton className="h-3 w-16 bg-accent" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-full bg-accent" />
                <Skeleton className="h-3 w-[90%] bg-accent" />
                <Skeleton className="h-3 w-[80%] bg-accent" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DocumentSearchSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-full">
          <div className="flex items-start gap-2 p-3 border-none rounded-lg bg-transparent text-card-foreground shadow-sm">
            <Skeleton className="h-8 w-8 rounded-md flex-shrink-0 bg-accent" />
            <div className="flex-1 min-w-0 space-y-1">
              <Skeleton className="h-3 w-3/4 bg-accent" />
              <Skeleton className="h-3 w-24 bg-accent" />
              <div className="space-y-1 mt-1">
                <Skeleton className="h-3 w-full bg-accent" />
                <Skeleton className="h-3 w-[85%] bg-accent" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
