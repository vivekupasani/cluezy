'use client'

import { RotateCcw } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui'
import { Button } from './ui/button'

interface RetryButtonProps {
  reload: () => Promise<string | null | undefined>
  messageId: string
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  reload,
  messageId
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="rounded-full h-8 w-8 ring-0"
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => reload()}
          aria-label={`Retry from message ${messageId}`}
        >
          <RotateCcw size={14} className="text-foreground/70 hover:text-foreground transition-colors" />
          <span className="sr-only">Try again</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className='text-xs'>
        Try again
      </TooltipContent>
    </Tooltip>
  )
}
