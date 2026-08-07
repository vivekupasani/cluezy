'use client'

import { useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import {
  FileSearch,
  Globe,
  Sparkles,
  X,
  Youtube
} from 'lucide-react'

import { cn } from '@/lib/utils'

const categories = [
  {
    id: 'web-research',
    label: 'Web & Research',
    icon: Globe,
    questions: [
      'What are the latest developments in quantum computing this year?',
      'Find recent Reddit discussions about the best productivity tools for developers.',
      'Search for peer-reviewed studies on the effects of intermittent fasting on longevity.',
      'Compare the economic policies of the top 5 fastest-growing economies.',
      'Summarize the current state of AI regulation across major countries.'
    ]
  },
  {
    id: 'documents',
    label: 'Documents & Files',
    icon: FileSearch,
    questions: [
      'Search for technical whitepapers about post-quantum cryptography in PDF format.',
      'Find recent PowerPoint presentations on climate change mitigation strategies.',
      'Look for research papers comparing transformer architectures in machine learning.',
      'Search for business case study documents on successful startup pivots.',
      'Find PDF reports on global renewable energy adoption rates for 2025.'
    ]
  },
  {
    id: 'video-media',
    label: 'Video & Media',
    icon: Youtube,
    questions: [
      'Summarize the key points from this video: https://youtu.be/Rni7Fz7208c',
      'Find the best tutorial videos on building a Next.js 15 application.',
      'Search for recent tech conference talks about WebAssembly.',
      'What are the most popular coding interview prep videos this month?',
      'Find documentary videos about the history of space exploration.'
    ]
  },
  // {
  //   id: 'apps-integrations',
  //   label: 'Apps & Integrations',
  //   icon: Plug,
  //   questions: [
  //     'Search my Gmail for any unread emails from the last 24 hours.',
  //     'Find recent files shared with me in Google Drive this week.',
  //     'Search GitHub for trending open-source AI agent repositories.',
  //     'Find the latest posts about web development on X (Twitter).',
  //     'Look through my Google Sheets for the Q4 budget spreadsheet.'
  //   ]
  // },
  {
    id: 'utilities',
    label: 'Utilities',
    icon: Sparkles,
    questions: [
      'What is the current weather forecast for San Francisco this weekend?',
      'Summarize the main content of this website: https://openai.com/research',
      'Give me a daily news briefing on technology and AI for today.',
      'Translate this paragraph to Japanese, French, and Spanish.',
      'Analyze the key financial metrics from Apple\'s latest earnings report.'
    ]
  }
]

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const activeData = categories.find(c => c.id === activeCategory)

  // Close on click outside
  useEffect(() => {
    if (!activeCategory) return

    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setActiveCategory(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeCategory])

  return (
    <div className={cn('w-full max-w-3xl mt-4', className)}>
      <div className="relative">
        {/* Category Pills — always in flow to preserve layout height */}
        <div
          className={cn(
            'flex flex-wrap mx-auto gap-2 mt-4 px-2 items-center justify-center transition-opacity duration-150',
            activeData ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 cursor-pointer border bg-transparent boring-light:bg-muted/30 text-accent-foreground/70 border-border/60 dark:border-sidebar-ring/10 hover:bg-secondary/50 hover:text-secondary-foreground"
            >
              <category.icon size={13} className="text-accent-foreground/60" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Questions Card — absolutely positioned so it doesn't shift the input */}
        <AnimatePresence>
          {activeData && (
            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              ref={cardRef}
              className="absolute top-0 left-0 right-0 mx-auto rounded-xl border border-border/60 dark:border-sidebar-ring/10 bg-accent/20 dark:bg-card overflow-hidden backdrop-blur-sm z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 dark:border-sidebar-ring/10">
                <div className="flex items-center gap-2">
                  <activeData.icon size={15} className="text-accent-foreground/80" />
                  <span className="text-sm font-medium text-foreground">
                    {activeData.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Questions */}
              <div className="flex flex-col py-1">
                {activeData.questions.map((question, index) => (
                  <motion.button
                    key={question}
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.15,
                      delay: index * 0.03
                    }}
                    onClick={() => {
                      submitMessage(question)
                      setActiveCategory(null)
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] leading-snug text-accent-foreground/70 hover:text-foreground hover:bg-secondary/40 dark:hover:bg-secondary/20 transition-colors duration-150 cursor-pointer"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

