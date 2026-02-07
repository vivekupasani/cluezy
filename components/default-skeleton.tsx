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

export function SearchSkeleton() {
  return (
    <div className="flex flex-wrap">
      {[...Array(4)].map((_, index) => (
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
