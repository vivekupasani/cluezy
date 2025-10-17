'use client'

import { DefaultSkeleton } from "@/components/default-skeleton"


export default function Loading() {
  return (
    <div className="w-screen flex flex-col flex-1 items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        <DefaultSkeleton />
      </div>
    </div>
  )
}
