import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible'
import { Separator } from './ui/separator'

interface CollapsibleMessageProps {
  children: React.ReactNode
  role: 'user' | 'assistant'
  isCollapsible?: boolean
  isOpen?: boolean
  header?: React.ReactNode
  onOpenChange?: (open: boolean) => void
  showBorder?: boolean
  showIcon?: boolean
}

export function CollapsibleMessage({
  children,
  role,
  isCollapsible = false,
  isOpen = true,
  header,
  onOpenChange,
  showBorder = true,
  showIcon = true
}: CollapsibleMessageProps) {
  const content = <div className="flex-1">{children}</div>

  return (
    <div className="flex px-2 sm:px-0">
      {/* {showIcon && (
        <div className="relative flex flex-col items-center">
          <div className="w-5">
            {role === 'assistant' ? (
              <IconLogo className="size-5" />
            ) : (
              <CurrentUserAvatar />
            )}
          </div>
        </div>
      )} */}

      {isCollapsible ? (
        <div
          className={cn(
            'flex-1 rounded-2xl py-4 bg-transparent dark:bg-transparent text-secondary-foreground dark:text-foreground/90',
            showBorder && 'border border-border dark:border-border/50'
          )}
        >
          <Collapsible
            open={isOpen}
            onOpenChange={onOpenChange}
            className="w-full"
          >
            <div className="flex items-center justify-between h-4 w-full gap-2 px-4">
              {header && <div className="text-sm w-full">{header}</div>}
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="rounded-md p-1 hover:bg-accent group"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
              <Separator orientation='horizontal' className="my-4 border border-border/60 dark:border-border/40" />
              <div className="px-4">
                {content}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : (
        <div
          className={cn(
            'flex-1 rounded-2xl',
            role === 'assistant' ? 'px-0' : 'px-0'
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}