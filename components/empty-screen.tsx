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
    { heading: 'Smart Search', message: 'What’s trending on the web right now?', icon: Search },
    { heading: 'Academic Research', message: 'Find recent papers on AI and machine learning.', icon: BookOpen },
    { heading: 'Document Insights', message: 'Retrieve key points from https://en.wikipedia.org/wiki/Agentic_AI', icon: FileSearch },
    { heading: 'Weather Update', message: 'What’s the weather like in Mumbai today?', icon: CloudSun },
  ]

  return (
    <div className={cn(
      "w-full max-w-3xl mx-auto",
      className
    )}>
      <div className="grid grid-cols-4 md:grid-cols-4 gap-3 p-4">
        {exampleMessages.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-2 flex flex-col items-start gap-2 whitespace-normal text-left min-h-[3rem] hover:bg-secondary/50 transition-colors border-border/60 shadow-sm"
            onClick={() => submitMessage(example.message)}
          >
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <example.icon size={16} className="text-primary" />
              {example.heading}
            </div>
            {/* <span className="text-xs text-muted-foreground line-clamp-2">
              {example.message}
            </span> */}
          </Button>
        ))}
      </div>
    </div>
  )
}