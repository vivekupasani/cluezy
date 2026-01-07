'use client'

import React, { useEffect, useState } from 'react'

import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { cn } from '@/lib/utils'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

import { InspectorDrawer } from '@/components/inspector/inspector-drawer'
import { InspectorPanel } from '@/components/inspector/inspector-panel'

import { usePathname } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui'
import { useArtifact } from './artifact-context'
export function ChatArtifactContainer({
  children
}: {
  children: React.ReactNode
}) {
  const { state } = useArtifact()
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
    '/about',
    '/privacy',
    '/terms',
    '/settings',
    '/pricing',
    '/playbook'
  ]

  return (
    <div className="flex-1 min-h-0 h-screen flex">
      <div className="absolute p-2 md:p-4 z-50 bg-background/50 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none w-full">
        {(!open || isMobileSidebar) && !pages.includes(pathName) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className='mt-2 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent side="right" className='text-xs'>
              Toggle Sidebar
            </TooltipContent>
          </Tooltip>
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