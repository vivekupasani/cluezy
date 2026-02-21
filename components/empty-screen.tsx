import { BookOpen, FileSearch, LineChart, Youtube, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';


export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  const exampleMessages = [
    {
      heading: 'Research',
      message: 'Analyze the long-term economic effects of remote work on urban real estate markets.',
      icon: Zap
    },
    {
      heading: 'YouTube',
      message: 'Summarize the key points and timestamps from this video: https://youtu.be/Rni7Fz7208c?si=9RbVNY4latcHrxIP',
      icon: Youtube
    },
    {
      heading: 'Academic',
      message: 'Find recent studies on the impact of oceanic warming on deep-sea biodiversity.',
      icon: BookOpen
    },
    {
      heading: 'File Search',
      message: 'Search for technical whitepapers about post-quantum cryptography in PDF format.',
      icon: FileSearch
    },
    {
      heading: 'Market Data',
      message: 'Compare the market performance of the top 5 semiconductor companies over the last 12 months.',
      icon: LineChart
    }
  ]

  return (
    <div className={cn(
      "w-full max-w-3xl mt-4",
      className
    )}>
      <div className="flex flex-wrap mx-auto gap-3 mt-4 items-center justify-center">
        {exampleMessages.map((example, index) => (
          <div
            key={index}
            className="h-auto py-1 flex flex-col rounded-lg cursor-pointer items-start gap-2 whitespace-normal text-left hover:bg-secondary/50 hover:text-secondary-foreground transition-colors border border-border/60 dark:border-card"
            onClick={() => submitMessage(example.message)}
          >
            <div className="flex items-center gap-2 px-4 py-0.5 text-accent-foreground/70 font-medium text-xs">
              <example.icon size={14} className='text-accent-foreground/70' />
              {example.heading}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}