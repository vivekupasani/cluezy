import { NextRequest, NextResponse } from 'next/server'

import { deleteChat, renameChat } from '@/lib/actions/chat'
import { getCurrentUserId } from '@/lib/auth/get-current-user'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const enableSaveChatHistory = process.env.ENABLE_SAVE_CHAT_HISTORY === 'true'
  if (!enableSaveChatHistory) {
    return NextResponse.json(
      { error: 'Chat history saving is disabled.' },
      { status: 403 }
    )
  }

  const chatId = (await params).id
  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 })
  }

  const userId = await getCurrentUserId()

  try {
    const result = await deleteChat(chatId, userId)

    if (result.error) {
      const statusCode = result.error === 'Chat not found' ? 404 : 500
      return NextResponse.json({ error: result.error }, { status: statusCode })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(`API route error deleting chat ${chatId}:`, error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const enableSaveChatHistory = process.env.ENABLE_SAVE_CHAT_HISTORY === 'true'
  if (!enableSaveChatHistory) {
    return NextResponse.json(
      { error: 'Chat history saving is disabled.' },
      { status: 403 }
    )
  }

  const chatId = (await params).id
  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 })
  }

  const userId = await getCurrentUserId()
  const { title } = await request.json()

  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json(
      { error: 'Valid title is required' },
      { status: 400 }
    )
  }

  try {
    const result = await renameChat(chatId, title.trim(), userId)

    if (result.error) {
      const statusCode = result.error === 'Chat not found' ? 404 : 500
      return NextResponse.json({ error: result.error }, { status: statusCode })
    }

    return NextResponse.json({ ok: true, message: 'Chat title updated successfully.' })
  } catch (error) {
    console.error(`API route error updating chat title for ${chatId}:`, error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

