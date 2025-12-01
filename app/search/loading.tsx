'use client'

import { DefaultSkeleton } from '../../components/default-skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center mt-12">
      <div className="w-full max-w-2xl px-4">
        <DefaultSkeleton />
      </div>
    </div>
  )
}
