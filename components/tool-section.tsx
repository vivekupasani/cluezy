'use client'

import { ToolInvocation } from 'ai'

import { ConnectorSearchSection } from './connector-search-section'
import { DateTimeSection } from './datetime-section'
import { DocumentSection } from './doument-section'
import { QuestionConfirmation } from './question-confirmation'
import RetrieveSection from './retrieve-section'
import { SearchSection } from './search-section'
import { VideoSearchSection } from './video-search-section'
import { WeatherSection } from './weather-section'
import { YoutubeVideoAnalysisSection } from './youtube-video-analysis-section'

interface ToolSectionProps {
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  addToolResult?: (params: { toolCallId: string; result: any }) => void
  chatId?: string
}

export function ToolSection({
  tool,
  isOpen,
  onOpenChange,
  addToolResult,
  chatId
}: ToolSectionProps) {
  // Special handling for ask_question tool
  if (tool.toolName === 'ask_question') {
    // When waiting for user input
    if (tool.state === 'call' && addToolResult) {
      return (
        <QuestionConfirmation
          toolInvocation={tool}
          onConfirm={(toolCallId, approved, response) => {
            addToolResult({
              toolCallId,
              result: approved
                ? response
                : {
                  declined: true,
                  skipped: response?.skipped,
                  message: 'User declined this question'
                }
            })
          }}
        />
      )
    }

    // When result is available, display the result
    if (tool.state === 'result') {
      return (
        <div className='-mb-4'>
          <QuestionConfirmation
            toolInvocation={tool}
            isCompleted={true}
            onConfirm={() => { }} // Not used in result display mode
          />
        </div>
      )
    }
  }

  switch (tool.toolName) {
    case 'search':
      return (
        <div className='mt-0'>
          <SearchSection
            tool={tool}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            chatId={chatId || ''}
          />
        </div>
      )

    case 'acadamicSearch':
      return (
        <div className='mt-0'>
          <SearchSection
            tool={tool}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            chatId={chatId || ''}
          />
        </div>
      )

    case 'connectorSearch':
      return (
        <ConnectorSearchSection tool={tool} />
      )

    case 'videoSearch':
      return (
        <div className='mt-4'>
          <VideoSearchSection
            tool={tool}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            chatId={chatId || ''}
          />
        </div>
      )
    case 'youtubeVideoAnalysis':
      return (
        <div className='mt-0'>
          <YoutubeVideoAnalysisSection tool={tool} />
        </div>
      )
    case 'retrieve':
      return (
        <div className='mt-4'>
          <RetrieveSection
            tool={tool}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </div>
      )
    case 'weather':
      return (
        <WeatherSection tool={tool} />
      )
    case 'datetime':
      return (
        <DateTimeSection tool={tool} />
      )
    case 'pdfSearch':
    case 'pptSearch':
    case 'docSearch':
      return (
        <div className='mt-3'>
          <DocumentSection tool={tool} isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
      )
    default:
      return null
  }
}
