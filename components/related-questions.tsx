'use client'

import React from 'react'

import { useChat } from '@ai-sdk/react'
import { JSONValue } from 'ai'

import { Plus } from 'lucide-react'
import { CollapsibleMessage } from './collapsible-message'
import { Section } from './section'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export interface RelatedQuestionsProps {
  annotations: JSONValue[]
  onQuerySelect: (query: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  chatId: string
}

interface RelatedQuestionsAnnotation extends Record<string, JSONValue> {
  type: 'related-questions'
  data: {
    items: Array<{ query: string }>
  }
}

export const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({
  annotations,
  onQuerySelect,
  isOpen,
  onOpenChange,
  chatId
}) => {
  const { status } = useChat({
    id: chatId
  })
  const isLoading = status === 'submitted' || status === 'streaming'

  if (!annotations) {
    return null
  }

  const lastRelatedQuestionsAnnotation = annotations[
    annotations.length - 1
  ] as RelatedQuestionsAnnotation

  const relatedQuestions = lastRelatedQuestionsAnnotation?.data
  if ((!relatedQuestions || !relatedQuestions.items) && !isLoading) {
    return null
  }

  if (relatedQuestions.items.length === 0 && isLoading) {
    return (
      <CollapsibleMessage
        role="assistant"
        isCollapsible={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        showIcon={false}
      >
        <Skeleton className="w-full h-6" />
      </CollapsibleMessage>
    )
  }

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showIcon={false}
      showBorder={false}
    >
      <Section title="Related" className="pt-0 pb-4 mx-4">
        <div className="flex flex-col">
          {Array.isArray(relatedQuestions.items) ? (
            relatedQuestions.items
              ?.filter(item => item?.query !== '')
              .map((item, index) => (
                <div
                  key={index}
                  className="group flex items-start w-full py-2 border-b border-border hover:text-foreground"
                >
                  <Button
                    className="flex-1 justify-start px-0 py-1 h-fit bg-transparent hover:bg-transparent font-semibold text-accent-foreground/50 group-hover:text-foreground whitespace-normal text-left"
                    type="submit"
                    name="related_query"
                    value={item?.query}
                    onClick={() => onQuerySelect(item?.query)}
                  >
                    {item?.query}
                  </Button>
                  <Plus className="hidden sm:visible h-4 w-4 mr-2 mt-1 flex-shrink-0 text-accent-foreground/50 group-hover:text-foreground" />
                </div>
              ))
          ) : (
            <div>Not an array</div>
          )}
        </div>
      </Section>
    </CollapsibleMessage>
  )
}
export default RelatedQuestions
