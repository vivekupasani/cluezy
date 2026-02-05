import { generateId } from 'ai'
import { Suspense } from 'react'

import { Chat } from '@/components/chat'
import { getModels } from '@/lib/config/models'

export default async function Page() {
  const models = await getModels()
  const id = generateId()
  return (
    <Suspense fallback={null}>
      <Chat key={id} id={id} models={models} />
    </Suspense>
  )
}
