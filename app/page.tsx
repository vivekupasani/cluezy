import { Suspense } from 'react'

import { ChatWrapper } from '@/components/chat-wrapper'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ChatWrapper />
    </Suspense>
  )
}
