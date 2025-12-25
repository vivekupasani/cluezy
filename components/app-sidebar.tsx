'use client'

import { useRouter } from 'next/navigation'

import { History, Plus, Settings } from 'lucide-react'

import { useAuth } from '@/components/context/auth-context'
import GuestMenu from '@/components/guest-menu'
import { useHistoryDialog } from '@/components/history-dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'
import UserMenu from '@/components/user-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function AppSidebar() {
  const router = useRouter()
  const { setHistoryDialogIsOpen } = useHistoryDialog()
  const { user } = useAuth()
  const { toggleSidebar, state } = useSidebar()

  return (
    <Sidebar collapsible="icon" className='border-r-0'>
      <SidebarHeader className="flex flex-row items-center justify-between pt-4 pb-2 px-4 gap-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className='dark:text-neutral-400' />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Toggle Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </SidebarHeader>

      <SidebarContent className="">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      router.push('/')
                      // Optional: Refresh or reset chat state if needed
                    }}
                    className="justify-start gap-2 data-[state=open]:px-2"
                  >
                    <Plus className="size-5" />
                    <span>New Chat</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">New Chat</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => setHistoryDialogIsOpen(true)}
                    className="justify-start gap-2 data-[state=open]:px-2"
                  >
                    <History className="size-5" />
                    <span>History</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">History</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    className="justify-start gap-2 data-[state=open]:px-2 cursor-not-allowed opacity-50"
                  >
                    <Settings className="size-5" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Settings (Coming Soon)</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='pl-2'>
        <div className="flex flex-col gap-2 items-start w-full">
          {user ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <UserMenu user={user} />
              </TooltipTrigger>
              <TooltipContent side="right">User Menu</TooltipContent>
            </Tooltip>
          ) : (
            <GuestMenu />
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
