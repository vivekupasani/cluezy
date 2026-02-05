import {
  convertToCoreMessages,
  createDataStreamResponse,
  DataStreamWriter,
  JSONValue,
  streamText
} from 'ai'

import { manualResearcher } from '../agents/manual-researcher'
import { ExtendedCoreMessage } from '../types'
import { getMaxAllowedTokens, truncateMessages } from '../utils/context-window'

import { handleStreamFinish } from './handle-stream-finish'
import { executeToolCall } from './tool-execution'
import { BaseStreamConfig } from './types'

export function createManualToolStreamResponse(config: BaseStreamConfig) {
  console.log("Menual tool calling")
  return createDataStreamResponse({
    execute: async (dataStream: DataStreamWriter) => {
      const { messages, model, chatId, searchMode, userId, selectedApps } = config

      // Write selected apps to data stream for live UI update
      if (selectedApps && selectedApps.length > 0) {
        dataStream.writeMessageAnnotation({
          type: 'selected-apps',
          data: selectedApps
        })
      }
      const modelId = `${model.providerId}:${model.id}`
      let toolCallModelId = model.toolCallModel
        ? `${model.providerId}:${model.toolCallModel}`
        : modelId

      try {
        const coreMessages = convertToCoreMessages(messages)
        const truncatedMessages = truncateMessages(
          coreMessages,
          getMaxAllowedTokens(model)
        )

        const { toolCallDataAnnotation, toolCallMessages } =
          await executeToolCall(
            truncatedMessages,
            dataStream,
            toolCallModelId,
            searchMode
          )

        const researcherConfig = manualResearcher({
          messages: [...truncatedMessages, ...toolCallMessages],
          model: modelId,
          isSearchEnabled: searchMode
        })

        // Variables to track the reasoning timing.
        let reasoningStartTime: number | null = null
        let reasoningDuration: number | null = null

        const result = streamText({
          ...researcherConfig,
          onFinish: async result => {
            const annotations: ExtendedCoreMessage[] = [
              ...(toolCallDataAnnotation ? [toolCallDataAnnotation] : []),
              {
                role: 'data',
                content: {
                  type: 'reasoning',
                  data: {
                    time: reasoningDuration ?? 0,
                    reasoning: result.reasoning
                  }
                } as JSONValue
              }
            ]

            await handleStreamFinish({
              responseMessages: result.response.messages,
              originalMessages: messages,
              model: modelId,
              chatId,
              dataStream,
              userId,
              skipRelatedQuestions: false, //true
              annotations,
              selectedApps: config.selectedApps
            })
          },
          onChunk(event) {
            const chunkType = event.chunk?.type

            if (chunkType === 'reasoning') {
              if (reasoningStartTime === null) {
                reasoningStartTime = Date.now()
              }
            } else {
              if (reasoningStartTime !== null) {
                const elapsedTime = Date.now() - reasoningStartTime
                reasoningDuration = elapsedTime
                dataStream.writeMessageAnnotation({
                  type: 'reasoning',
                  data: { time: elapsedTime }
                } as JSONValue)
                reasoningStartTime = null
              }
            }
          }
        })

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true
        })
      } catch (error) {
        console.error('Stream execution error:', error)
      }
    },
    onError: error => {
      console.error('Stream error:', error)
      return error instanceof Error ? error.message : String(error)
    }
  })
}
