import { generateId } from 'ai'
import { Suspense } from 'react'

import { getModels } from '@/lib/config/models'

import { Chat } from '@/components/chat'

export default async function Page() {
  const models = await getModels()
  const id = generateId()
  return (
    <Suspense fallback={null}>
      <Chat key={id} id={id} models={models} />
    </Suspense>
  )
}
