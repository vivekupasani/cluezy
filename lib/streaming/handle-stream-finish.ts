import { CoreMessage, DataStreamWriter, JSONValue, Message } from 'ai'

import { getChat, saveChat } from '@/lib/actions/chat'
import { generateRelatedQuestions } from '@/lib/agents/generate-related-questions'
import { ExtendedCoreMessage } from '@/lib/types'
import { convertToExtendedCoreMessages } from '@/lib/utils'
import { UserPlanDetailsProps } from '../actions/user-premium'

interface HandleStreamFinishParams {
  responseMessages: CoreMessage[]
  originalMessages: Message[]
  model: string
  chatId: string
  dataStream: DataStreamWriter
  userId: string
  skipRelatedQuestions?: boolean
  annotations?: ExtendedCoreMessage[]
  selectedApps?: string[]
  userPlanDetails?: UserPlanDetailsProps | null
  isIncognito?: boolean
}

export async function handleStreamFinish({
  responseMessages,
  originalMessages,
  model,
  chatId,
  dataStream,
  userId,
  skipRelatedQuestions = false,
  annotations = [],
  selectedApps = [],
  userPlanDetails,
  isIncognito = false
}: HandleStreamFinishParams) {
  try {
    // Inject selected apps annotation as a separate data message before the user message
    const appsAnnotation: ExtendedCoreMessage | null =
      selectedApps && selectedApps.length > 0
        ? {
            role: 'data',
            content: {
              type: 'selected-apps',
              data: selectedApps
            } as JSONValue
          }
        : null

    const extendedCoreMessages = convertToExtendedCoreMessages(originalMessages)

    // If we have apps, find the last user message in the converted array and insert the annotation before it
    let finalHistory = [...extendedCoreMessages]
    if (appsAnnotation) {
      const lastUserIndex = finalHistory.findLastIndex(m => m.role === 'user')
      if (lastUserIndex !== -1) {
        finalHistory.splice(lastUserIndex, 0, appsAnnotation)
      } else {
        finalHistory.push(appsAnnotation)
      }
    }

    let allAnnotations = [...annotations]

    if (!skipRelatedQuestions) {
      // Notify related questions loading
      const relatedQuestionsAnnotation: JSONValue = {
        type: 'related-questions',
        data: { items: [] }
      }
      dataStream.writeMessageAnnotation(relatedQuestionsAnnotation)

      // Generate related questions
      const relatedQuestions = await generateRelatedQuestions(
        responseMessages,
        model
      )

      // Create and add related questions annotation
      const updatedRelatedQuestionsAnnotation: ExtendedCoreMessage = {
        role: 'data',
        content: {
          type: 'related-questions',
          data: relatedQuestions.object
        } as JSONValue
      }

      dataStream.writeMessageAnnotation(
        updatedRelatedQuestionsAnnotation.content as JSONValue
      )
      allAnnotations.push(updatedRelatedQuestionsAnnotation)
    }

    // Create the message to save
    const generatedMessages = [
      ...finalHistory,
      ...responseMessages.slice(0, -1),
      ...allAnnotations, // Add annotations before the last message
      ...responseMessages.slice(-1)
    ] as ExtendedCoreMessage[]

    // Helper to sanitize content by removing AI SDK protocol artifacts
    const sanitizeContent = (content: any): any => {
      // Regex to match AI SDK protocol markers like {"type":"step-start"}, {"type":"step-finish"}, etc.
      const protocolPattern = /\{"type":"step-(?:start|finish)"\}/g

      if (typeof content === 'string') {
        return content.replace(protocolPattern, '').trim()
      }

      if (Array.isArray(content)) {
        return content.map(part => {
          if (
            part &&
            typeof part === 'object' &&
            part.type === 'text' &&
            typeof part.text === 'string'
          ) {
            return {
              ...part,
              text: part.text.replace(protocolPattern, '').trim()
            }
          }
          return part
        })
      }

      return content
    }

    // Sanitize messages to remove protocol artifacts
    const sanitizedMessages = generatedMessages.map(msg => ({
      ...msg,
      content: sanitizeContent(msg.content)
    }))

    if (process.env.ENABLE_SAVE_CHAT_HISTORY !== 'true') {
      return
    }

    // Return from here if user is not authenticated or in incognito mode
    if (userId == 'anonymous' || isIncognito) {
      return
    }

    // Get the chat from the database if it exists, otherwise create a new one
    const savedChat = (await getChat(chatId, userId)) ?? {
      messages: [],
      createdAt: new Date(),
      userId: userId,
      path: `/search/${chatId}`,
      title: originalMessages[0].content,
      id: chatId
    }

    // Save chat with complete response and related questions
    await saveChat(
      {
        ...savedChat,
        messages: sanitizedMessages
      },
      userId,
      userPlanDetails
    ).catch(error => {
      console.error('Failed to save chat:', error)
      throw new Error('Failed to save chat history')
    })
  } catch (error) {
    console.error('Error in handleStreamFinish:', error)
    throw error
  }
}
