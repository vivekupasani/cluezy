import { BookOpen, LineChart, Unplug, Youtube, Zap } from 'lucide-react';

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
    {
      heading: 'Research',
      message: 'Deeply analyze the impact of room-temperature superconductors on global energy grids.',
      icon: Zap
    },
    {
      heading: 'YouTube',
      message: 'Summarize the key points and timestamps from this video: https://youtu.be/Rni7Fz7208c?si=9RbVNY4latcHrxIP',
      icon: Youtube
    },
    {
      heading: 'Academic',
      message: 'Find peer-reviewed papers on the evolution of Transformer architectures in LLMs.',
      icon: BookOpen
    },
    {
      heading: 'Connectors',
      message: 'Search my Google Drive and Notion for any documents related to the 2025 Project Roadmap.',
      icon: Unplug
    },
    // {
    //   heading: 'File Search',
    //   message: 'Search for recent technical whitepapers about AI safety in PDF format.',
    //   icon: FileSearch
    // },
    {
      heading: 'Market Data',
      message: 'What is NVIDIA\'s current stock price, market cap, and recent analyst ratings?',
      icon: LineChart
    },
    // {
    //   heading: 'Product ID',
    //   message: 'What product is this and where can I buy it? https://m.media-amazon.com/images/I/71K7602I-EL.jpg',
    //   icon: ShoppingBag
    // },
    // {
    //   heading: 'Weather',
    //   message: 'What is the 5-day weather forecast for Mumbai including temperature and precipitation?',
    //   icon: CloudSun
    // }
  ]

  return (
    <div className={cn(
      "w-full max-w-3xl mt-5",
      className
    )}>
      <div className="flex flex-wrap mx-auto gap-3 mt-4 items-center justify-center">
        {exampleMessages.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-1 flex flex-col rounded-lg items-start gap-2 whitespace-normal text-left hover:bg-secondary/50 transition-colors border-border/60"
            onClick={() => submitMessage(example.message)}
          >
            <div className="flex items-center gap-2 txt-act font-medium text-xs">
              <example.icon size={16} className='text-accent-foreground/70' />
              {example.heading}
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}