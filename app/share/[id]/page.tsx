import { notFound } from 'next/navigation'

import { getSharedChat } from '@/lib/actions/chat'
import { convertToUIMessages } from '@/lib/utils'

import { Chat } from '@/components/chat'

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const chat = await getSharedChat(id)

  if (!chat || !chat.sharePath) {
    return notFound()
  }

  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SharePage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const chat = await getSharedChat(id)

  if (!chat || !chat.sharePath) {
    return notFound()
  }

  return (
    <Chat
      id={chat.id}
      savedMessages={convertToUIMessages(chat.messages)}
    />
  )
}
