import Link from 'next/link'
import { Suspense } from 'react'



import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'

import { ChatHistorySection } from './sidebar/chat-history-section'
import { ChatHistorySkeleton } from './sidebar/chat-history-skeleton'

export default function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="flex flex-row items-center justify-center">
        <div className='absolute left-3 top-5'>
          <SidebarTrigger />
        </div>
        <Link href="/" className="flex-1 items-center gap-1 px-2 py-3">
          {/* <IconLogo className={cn('size-5')} /> */}
          <span className="font-semibold text-sm flex justify-center items-center">Cluezy</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col px-2 py-4 h-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="w-full bg-primary text-primary-foreground px-4 py-[18px] rounded-md text-sm"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                {/* You can uncomment and replace with your actual icon component */}
                {/* <PenSquareIcon className="size-4" /> */}
                New chat
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<ChatHistorySkeleton />}>
            <ChatHistorySection />
          </Suspense>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
