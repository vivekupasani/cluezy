'use client'

import React, { useEffect, useState } from 'react'

import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { Ghost } from 'lucide-react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

import { InspectorDrawer } from '@/components/inspector/inspector-drawer'
import { InspectorPanel } from '@/components/inspector/inspector-panel'

import { usePathname } from 'next/navigation'
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '../ui'
import { useArtifact } from './artifact-context'
export function ChatArtifactContainer({
  children
}: {
  children: React.ReactNode
}) {
  const { state, setIsIncognito } = useArtifact()
  const isMobile = useMediaQuery('(max-width: 767px)') // Below md breakpoint
  const [renderPanel, setRenderPanel] = useState(state.isOpen)
  const { open, openMobile, isMobile: isMobileSidebar } = useSidebar()
  const pathName = usePathname()

  useEffect(() => {
    if (state.isOpen) {
      setRenderPanel(true)
    } else {
      setRenderPanel(false)
    }
  }, [state.isOpen])

  const pages = [
    '/pricing',
    '/playbook',
    '/payment-successful',
    "/auth/login",
    "/auth/sign-up",
    "/auth/sign-up-success",
    "/auth/update-password",
    "/auth/forgot-password",
    "/auth/confirm",
    "/auth/error",
    isMobile && '/privacy', '/about', '/terms', '/premium'
  ]

  return (
    <div className="flex-1 min-h-0 h-screen flex relative">
      <div className="absolute p-2 md:p-2 z-50 bg-background/50 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none w-full flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {(!open || isMobileSidebar) && !pages.includes(pathName) && !pathName.includes("/connectors") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className='text-muted-foreground md:hidden' />
              </TooltipTrigger>
              <TooltipContent side="right" className='text-xs'>
                Toggle Sidebar
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {!pages.includes(pathName) && !pathName.includes("/connectors") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "size-9 rounded-full transition-all duration-300",
                    state.isIncognito
                      ? "bg-accent text-primary border-secondary/30 dark:bg-secondary dark:text-secondary-foreground hover:bg-accent/90 hover:text-background/50"
                      : "bg-transparent hover:bg-background/50"
                  )}
                  onClick={() => {
                    const newValue = !state.isIncognito
                    setIsIncognito(newValue)
                  }}
                >
                  <Ghost size={18} className={cn("text-muted-foreground", state.isIncognito && "text-accent-foreground")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className='mr-3 opacity-0 md:opacity-100'>
                <p className="text-xs w-56">{state.isIncognito ? "Disable" : "Enable"} incognito: create anonymous threads that aren't saved to your history</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {state.isIncognito && (
          <div className="absolute top-16 md:top-12 left-1/2 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 z-30 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 dark:bg-secondary/50 border border-primary/10 dark:border-secondary/60 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500 fade-out slide-out-to-top-4">
              <Ghost size={14} className="text-accent-foreground dark:text-secondary-foreground" />
              <span className="text-[10px] md:text-[11px] font-medium text-accent-foreground dark:text-secondary-foreground uppercase tracking-wider">Incognito Mode Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Resizable panels (Do not render on mobile) */}
      {!isMobile && (
        <ResizablePanelGroup
          direction="horizontal"
          className="flex flex-1 min-w-0 h-full" // Responsive classes removed
        >
          <ResizablePanel
            className={cn(
              'min-w-0',
              state.isOpen && 'transition-[flex-basis] duration-200 ease-out'
            )}
          >
            {children}
          </ResizablePanel>

          {renderPanel && (
            <>
              <ResizableHandle />
              <ResizablePanel
                className={cn('overflow-hidden', {
                  'animate-slide-in-right': state.isOpen
                })}
                maxSize={50}
                minSize={30}
                defaultSize={40}
              >
                <InspectorPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      )}

      {/* Mobile: full-width chat + drawer (Do not render on desktop) */}
      {isMobile && (
        <div className="flex-1 h-full">
          {' '}
          {/* Responsive classes removed */}
          {children}
          {/* ArtifactDrawer checks isMobile internally, no double check needed */}
          <InspectorDrawer />
        </div>
      )}
    </div>
  )
}