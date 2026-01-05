import { BookOpen, CloudSun, FileSearch, Search } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './ui';

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  const exampleMessages = [
    { heading: 'Web Search', message: 'What’s trending on the web right now?', icon: Search },
    { heading: 'Academic Research', message: 'Find recent papers on AI and machine learning.', icon: BookOpen },
    { heading: 'Document Insights', message: 'Retrieve key points from https://en.wikipedia.org/wiki/Agentic_AI', icon: FileSearch },
    { heading: 'Weather Update', message: 'What’s the weather like in Mumbai today?', icon: CloudSun },
  ]

  return (
    <div className={cn(
      "w-full max-w-3xl",
      className
    )}>
      <div className="flex flex-wrap mx-auto gap-3 mt-4 items-center justify-center">
        {exampleMessages.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto px-2 py-1 flex flex-col rounded-2xl items-start gap-2 whitespace-normal text-left hover:bg-secondary/50 transition-colors border-border/60"
            onClick={() => submitMessage(example.message)}
          >
            <div className="flex items-center gap-2 txt-act font-medium text-xs">
              <example.icon size={16} className="text-primary" />
              {example.heading}
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}