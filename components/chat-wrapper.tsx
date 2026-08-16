'use client'

import { generateId } from 'ai'
import { useEffect, useState } from 'react'
import { Chat } from './chat'

export function ChatWrapper() {
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    setId(generateId())
  }, [])

  if (!id) {
    return null // or a loading skeleton if preferred
  }

  return <Chat key={id} id={id} />
}
