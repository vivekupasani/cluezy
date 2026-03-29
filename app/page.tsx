import { generateId } from 'ai'
import { Suspense } from 'react'

import { Chat } from '@/components/chat'

import { headers } from 'next/headers'

export default async function Page() {
  await headers()
  const id = generateId()
  return (
    <Suspense fallback={null}>
      <Chat key={id} id={id} />
    </Suspense>
  )
}
