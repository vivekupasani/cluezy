'use client'

import { ChatLoadingSkeleton } from "@/components/default-skeleton"
import { Model } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { getCookie } from "@/lib/utils/cookies"
import { ArrowUp, ChevronDown, Paperclip, WandSparkles } from "lucide-react"
import { useEffect, useState } from "react"

export default function TestPage() {
  const [model, setModel] = useState<Model | null>(null)

  useEffect(() => {
    const savedModel = getCookie('selectedModel')
    if (savedModel) {
      try {
        const parsedModel = JSON.parse(savedModel) as Model
        setModel(parsedModel)
      } catch (e) {
        console.error('Failed to parse saved model:', e)
      }
    }
  }, [])

  return (
    <div className="relative flex h-screen min-w-0 w-full max-w-2xl mx-auto flex-1 flex-col justify-between">
      <div className="flex-1 flex flex-col items-center pt-14 md:pt-14 px-2 md:px-0">
        <ChatLoadingSkeleton />
      </div>

      <div className="w-full shrink-0 mx-auto max-w-2xl px-2 md:px-0 sticky bottom-0 pb-4 sm:pb-2">
        <div className="bg-background">
          <div className={cn(
            "relative flex flex-col w-full p-2.5 transition-all duration-300",
            "bg-card backdrop-blur-xl",
            "ring-1 ring-border/20 border border-foreground/5",
            "rounded-[20px]"
          )}>
            <div className="relative w-full">
              <div className="w-full bg-transparent text-muted-foreground/60 outline-none text-[15px] leading-relaxed pt-2 px-2 min-h-[53px] cursor-not-allowed">
                Ask follow up questions or type @ to mention
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 pb-0.5 mt-0 pl-1 pr-1">
              <div className="flex items-center gap-1 h-8 px-2 text-muted-foreground">
                <span className="text-xs font-medium">
                  {model?.name || 'Select model'}
                </span>
                <ChevronDown size={12} className="opacity-50" />
              </div>
              <div className="flex items-center gap-1.5 opacity-50">
                <div className="size-8 rounded-full flex items-center justify-center text-muted-foreground">
                  <WandSparkles size={16} />
                </div>
                <div className="size-8 rounded-full flex items-center justify-center text-muted-foreground">
                  <Paperclip size={16} />
                </div>
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <ArrowUp size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
