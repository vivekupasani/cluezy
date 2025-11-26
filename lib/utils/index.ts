import {
  CoreMessage,
  CoreToolMessage,
  generateId,
  JSONValue,
  Message,
  ToolInvocation
} from 'ai'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { type Model } from '@/lib/types/models'

import { ExtendedCoreMessage } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Takes an array of AIMessage and modifies each message where the role is 'tool'.
 * Changes the role to 'assistant' and converts the content to a JSON string.
 * Returns the modified messages as an array of CoreMessage.
 *
 * @param aiMessages - Array of AIMessage
 * @returns modifiedMessages - Array of modified messages
 */
export function transformToolMessages(messages: CoreMessage[]): CoreMessage[] {
  return messages.map(message =>
    message.role === 'tool'
      ? {
        ...message,
        role: 'assistant',
        content: JSON.stringify(message.content),
        type: 'tool'
      }
      : message
  ) as CoreMessage[]
}

/**
 * Sanitizes a URL by replacing spaces with '%20'
 * @param url - The URL to sanitize
 * @returns The sanitized URL
 */
export function sanitizeUrl(url: string): string {
  return url.replace(/\s+/g, '%20')
}

export function createModelId(model: Model): string {
  return `${model.providerId}:${model.id}`
}

export function getDefaultModelId(models: Model[]): string {
  if (!models.length) {
    throw new Error('No models available')
  }
  return createModelId(models[0])
}

function addToolMessageToChat({
  toolMessage,
  messages
}: {
  toolMessage: CoreToolMessage
  messages: Array<Message>
}): Array<Message> {
  return messages.map(message => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map(toolInvocation => {
          const toolResult = toolMessage.content.find(
            tool => tool.toolCallId === toolInvocation.toolCallId
          )

          if (toolResult) {
            return {
              ...toolInvocation,
              state: 'result',
              result: toolResult.result
            }
          }

          return toolInvocation
        })
      }
    }

    return message
  })
}

export function convertToUIMessages(
  messages: Array<ExtendedCoreMessage>
): Array<Message> {
  let pendingAnnotations: JSONValue[] = []
  let pendingReasoning: string | undefined = undefined
  let pendingReasoningTime: number | undefined = undefined

  return messages.reduce((chatMessages: Array<Message>, message) => {
    // Handle tool messages
    if (message.role === 'tool') {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages
      })
    }

    // Data messages are used to capture annotations, including reasoning.
    if (message.role === 'data') {
      if (
        message.content !== null &&
        message.content !== undefined &&
        typeof message.content !== 'string'
      ) {
        const content = message.content as JSONValue
        if (
          content &&
          typeof content === 'object' &&
          'type' in content &&
          'data' in content
        ) {
          if (content.type === 'reasoning') {
            if (typeof content.data === 'object' && content.data !== null) {
              pendingReasoning = (content.data as any).reasoning
              pendingReasoningTime = (content.data as any).time as number | undefined
            } else {
              pendingReasoning = content.data as string
              pendingReasoningTime = 0
            }
          } else {
            pendingAnnotations.push(content)
          }
        }
      }
      return chatMessages
    }

    // Build the text content, tool invocations, and file attachments from message.content.
    let textContent = ''
    let toolInvocations: Array<ToolInvocation> = []
    let fileParts: Array<any> = []

    if (message.content) {
      if (typeof message.content === 'string') {
        textContent = message.content
      } else if (Array.isArray(message.content)) {
        for (const content of message.content) {
          if (content && typeof content === 'object' && 'type' in content) {
            if (content.type === 'text' && 'text' in content) {
              textContent += content.text
            } else if (
              content.type === 'tool-call' &&
              'toolCallId' in content &&
              'toolName' in content
            ) {
              // FIX: More flexible handling of tool-call, args might be optional or in different format
              const toolInvocation: ToolInvocation = {
                state: 'call',
                toolCallId: content.toolCallId as string,
                toolName: content.toolName as string,
                args: content.args || {} // Ensure args always exists
              }

              // Debug logging for specific tools
              if (content.toolName === 'retrieval' || content.toolName === 'ask_question') {
                console.log(`Processing ${content.toolName} tool:`, {
                  toolCallId: content.toolCallId,
                  args: content.args,
                  fullContent: content
                })
              }

              toolInvocations.push(toolInvocation)
            } else if (
              content.type === 'tool-result' &&
              'toolCallId' in content &&
              'toolName' in content
            ) {
              // Convert tool-result to proper tool invocation with result state
              const existingInvocation = toolInvocations.find(
                inv => inv.toolCallId === content.toolCallId
              )

              if (!existingInvocation) {
                toolInvocations.push({
                  state: 'result',
                  toolCallId: content.toolCallId,
                  toolName: content.toolName,
                  result: (content as any).result || {},
                  args: (content as any).args || {} // Include args for context
                } as ToolInvocation)
              }
            } else if (
              content.type === 'file' &&
              'url' in content &&
              'name' in content &&
              'mimeType' in content
            ) {
              const fileContent = {
                type: 'file' as const,
                url: content.url as string,
                name: content.name as string,
                mimeType: content.mimeType as string,
                size: typeof content.size === 'number' ? content.size : 0,
                data: content.data as string || content.url as string
              }
              fileParts.push(fileContent)
            }
          }
        }
      }
    }

    // Rest of your function remains the same...
    let annotations: JSONValue[] | undefined = undefined
    if (message.role === 'assistant') {
      if (pendingAnnotations.length > 0 || pendingReasoning !== undefined) {
        annotations = [
          ...pendingAnnotations,
          ...(pendingReasoning !== undefined
            ? [
              {
                type: 'reasoning',
                data: {
                  reasoning: pendingReasoning,
                  time: pendingReasoningTime ?? 0
                }
              } as JSONValue
            ]
            : [])
        ]
      }
    }

    const newMessage: Message = {
      id: generateId(),
      role: message.role,
      content: textContent,
      toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined,
      annotations: annotations
    }

    if (message.role === 'user' && (fileParts.length > 0 || textContent)) {
      const parts: any[] = []

      if (textContent) {
        parts.push({
          type: 'text',
          text: textContent
        })
      }

      parts.push(...fileParts)
        ; (newMessage as any).parts = parts
    }

    chatMessages.push(newMessage)

    if (message.role === 'assistant') {
      pendingAnnotations = []
      pendingReasoning = undefined
      pendingReasoningTime = undefined
    }

    return chatMessages
  }, [])
}

// Custom conversion function that preserves file attachments and handles all content types
function convertMessagesWithFiles(messages: any[]): CoreMessage[] {
  return messages.map((message: any) => {
    const coreMessage: CoreMessage = {
      role: message.role,
      content: []
    }

    // console.log("Processing message:", JSON.stringify(message, null, 2));

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
        } else if (part.type === 'tool-invocation') {
          // Handle tool-invocation type specifically with safe access
          const toolInvocation = part.toolInvocation;

          if (!toolInvocation) {
            return {
              type: 'text',
              text: 'Invalid tool invocation: missing toolInvocation property'
            }
          }

          // console.log("=============================")
          // console.log("tool invocation : ", toolInvocation)
          // console.log("=============================")

          // Safe access to args with fallback
          const args = toolInvocation.args || {};
          const result = toolInvocation.result || {};

          if (toolInvocation.state === 'result') {
            return {
              type: 'tool-result',
              toolCallId: toolInvocation.toolCallId,
              toolName: toolInvocation.toolName,
              args: args, // Include args for context
              result: result
            }
          } else if (toolInvocation.state === 'call') {
            return {
              type: 'tool-call',
              toolCallId: toolInvocation.toolCallId,
              toolName: toolInvocation.toolName,
              args: args
            }
          } else {
            // Unknown state, fallback to text
            return {
              type: 'text',
              text: `Tool invocation with state: ${toolInvocation.state}`
            }
          }
        }
        // Fallback for unknown part types - convert to text
        return {
          type: 'text',
          text: typeof part === 'object' ? JSON.stringify(part) : String(part)
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
        // console.log("=============================")
        // console.log("tool invocation : ", JSON.stringify(invocation, null, 2))
        // console.log("=============================")
        if (invocation.state === 'call') {
          contentParts.push({
            type: 'tool-call',
            toolCallId: invocation.toolCallId,
            toolName: invocation.toolName,
            args: invocation.args || {} // Safe fallback
          })
        } else if (invocation.state === 'result') {
          contentParts.push({
            type: 'tool-result',
            toolCallId: invocation.toolCallId,
            toolName: invocation.toolName,
            result: invocation.result || {}, // Safe fallback
            args: invocation.args || {} // Safe fallback
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
          text: String(content)
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

export function convertToExtendedCoreMessages(
  messages: Message[]
): ExtendedCoreMessage[] {
  const result: ExtendedCoreMessage[] = []

  for (const message of messages) {
    // Convert annotations to data messages
    if (message.annotations && message.annotations.length > 0) {
      message.annotations.forEach(annotation => {
        result.push({
          role: 'data',
          content: annotation
        })
      })
    }

    // Convert reasoning to data message with unified structure (including time)
    if (message.reasoning) {
      const reasoningTime = (message as any).reasoningTime ?? 0
      const reasoningData =
        typeof message.reasoning === 'string'
          ? { reasoning: message.reasoning, time: reasoningTime }
          : {
            ...(message.reasoning as Record<string, unknown>),
            time:
              (message as any).reasoningTime ??
              (message.reasoning as any).time ??
              0
          }
      result.push({
        role: 'data',
        content: {
          type: 'reasoning',
          data: reasoningData
        } as JSONValue
      })
    }

    // Convert current message
    const converted = convertMessagesWithFiles([message])
    result.push(...converted)
  }

  return result
}