import {
  CoreMessage,
  createDataStreamResponse,
  DataStreamWriter,
  streamText
} from 'ai'

import { researcher } from '@/lib/agents/researcher'

import { getMaxAllowedTokens, truncateMessages } from '../utils/context-window'
import { isReasoningModel } from '../utils/registry'

import { handleStreamFinish } from './handle-stream-finish'
import { BaseStreamConfig } from './types'

// Type for file content (compatible with Vercel AI SDK)
interface FileContent {
  type: 'file'
  url: string
  name: string
  mimeType: string
  size: number
  data?: string
}

type TextContentType = {
  type: 'text'
  text: string
}

// Custom conversion function that preserves file attachments
function convertMessagesWithFiles(messages: any[]): CoreMessage[] {
  return messages.map((message: any): CoreMessage => {
    const coreMessage: CoreMessage = {
      role: message.role,
      content: []
    }

    // Handle messages with 'parts' array (contains files and other content types)
    if (message.parts && Array.isArray(message.parts)) {
      coreMessage.content = message.parts.map((part: any): any => {
        if (part.type === 'text') {
          return {
            type: 'text',
            text: part.text
          }
        } else if (part.type === 'file') {
          return {
            type: 'file',
            url: part.url,
            name: part.name,
            mimeType: part.mimeType,
            size: typeof part.size === 'number' ? part.size : 0,
            data: part.data || part.url
          }
        } else if (part.type === 'tool-call') {
          return {
            type: 'tool-call',
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            args: part.args
          }
        } else if (part.type === 'tool-result') {
          return {
            type: 'tool-result',
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            result: part.result
          }
        }
        // Fallback for unknown part types - convert to text
        return {
          type: 'text',
          text: String(part)
        }
      })
    }
    // Handle tool invocations from the message object
    else if (message.toolInvocations && Array.isArray(message.toolInvocations)) {
      const contentParts: any[] = []

      // Add text content if it exists
      if (message.content && typeof message.content === 'string') {
        contentParts.push({
          type: 'text',
          text: message.content
        })
      }

      // Convert tool invocations to content parts
      message.toolInvocations.forEach((invocation: any) => {
        if (invocation.state === 'call') {
          contentParts.push({
            type: 'tool-call',
            toolCallId: invocation.toolCallId,
            toolName: invocation.toolName,
            args: invocation.args
          })
        } else if (invocation.state === 'result') {
          contentParts.push({
            type: 'tool-result',
            toolCallId: invocation.toolCallId,
            toolName: invocation.toolName,
            result: invocation.result
          })
        }
      })

      coreMessage.content = contentParts
    }
    // Handle legacy format: plain content string
    else if (typeof message.content === 'string') {
      coreMessage.content = [{
        type: 'text',
        text: message.content
      }]
    }
    // Handle already converted content array
    else if (Array.isArray(message.content)) {
      coreMessage.content = message.content.map((content: any) => {
        if (content && typeof content === 'object' && 'type' in content) {
          return content
        }
        // Convert unknown content to text
        return {
          type: 'text',
          text: typeof content === 'object' ? JSON.stringify(content) : String(content)
        }
      })
    }
    // Handle empty content
    else {
      coreMessage.content = []
    }

    return coreMessage
  })
}
// Function to check if a message contains ask_question tool invocation
function containsAskQuestionTool(message: CoreMessage): boolean {
  // For CoreMessage format, we check the content array
  if (message.role !== 'assistant' || !Array.isArray(message.content)) {
    return false
  }

  // Check if any content item is a tool-call with ask_question tool
  return message.content.some(
    item =>
      item.type === 'tool-call' &&
      'toolName' in item &&
      item.toolName === 'ask_question'
  )
}

export function createToolCallingStreamResponse(config: BaseStreamConfig) {
  console.log("🔧 Tool calling stream initiated")

  return createDataStreamResponse({
    execute: async (dataStream: DataStreamWriter) => {
      const { messages, model, chatId, searchMode, userId, selectedApps, isIncognito } = config
      const modelId = `${model.providerId}:${model.id}`

      // Write selected apps to data stream for live UI update
      if (selectedApps && selectedApps.length > 0) {
        dataStream.writeMessageAnnotation({
          type: 'selected-apps',
          data: selectedApps
        })
      }

      try {
        // ✅ Custom conversion that PRESERVES file attachments
        const coreMessages = convertMessagesWithFiles(messages)

        // Truncate messages while preserving file content
        const truncatedMessages = truncateMessages(
          coreMessages,
          getMaxAllowedTokens(model)
        )

        // Pass to researcher agent
        console.log("🤖 Calling researcher with model:", modelId)
        let researcherConfig = await researcher({
          messages: truncatedMessages,
          model: modelId,
          searchMode,
          userId,
          excludeDomains: config.excludeDomains,
          selectedApps: config.selectedApps
        })

        const result = streamText({
          ...researcherConfig,
          onFinish: async (result) => {
            console.log("✅ Stream finished, checking tool calls...")

            // Check if the last message contains an ask_question tool invocation
            const lastMessage = result.response.messages[result.response.messages.length - 1]
            const shouldSkipRelatedQuestions =
              isReasoningModel(modelId) ||
              (result.response.messages.length > 0 &&
                containsAskQuestionTool(lastMessage as CoreMessage))

            console.log("❓ Skip related questions:", shouldSkipRelatedQuestions)

            await handleStreamFinish({
              responseMessages: result.response.messages,
              originalMessages: messages,
              model: modelId,
              chatId,
              dataStream,
              userId,
              skipRelatedQuestions: true,
              selectedApps: config.selectedApps,
              userPlanDetails: config.userPlanDetails,
              isIncognito
            })
          }
        })

        // Merge stream into data stream
        result.mergeIntoDataStream(dataStream)

      } catch (error) {
        console.error('❌ Stream execution error:', error)
        throw error
      }
    },
    onError: (error) => {
      console.error('💥 Stream error:', error)
      return error instanceof Error ? error.message : String(error)
    }
  })
}