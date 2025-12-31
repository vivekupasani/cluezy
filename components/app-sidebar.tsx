'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Search, SquarePen } from 'lucide-react'

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
import Image from 'next/image'
import { useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function AppSidebar() {
  const router = useRouter()
  const { setHistoryDialogIsOpen } = useHistoryDialog()
  const { user } = useAuth()
  const { toggleSidebar, state } = useSidebar()
  const pathName = usePathname()

  const pages = [
    '/about',
    '/privacy',
    '/terms',
    '/settings'
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'o' && e.shiftKey) {
        e.preventDefault()
        router.push('/')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Don't render the header on the /auth/* pages
  if (pathName.startsWith('/auth/') || pages.includes(pathName)) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" className='border-r-0'>
      <SidebarHeader className="flex flex-row items-center justify-between pt-4 pb-2 px-4 gap-0">
        <Tooltip>
          <TooltipTrigger asChild>
            {
              state == "expanded" &&
              <div className='flex justify-between w-full items-center'>

                <div className='opacity-0 flex gap-2 justify-between items-center'>
                  <div className="flex h-7 w-7 items-center object-cover justify-center rounded-full overflow-hidden bg-primary text-primary-foreground">
                    <Image src="/cluezy-logo.png" alt="Cluezy" width={28} height={28} className='' />
                  </div>
                  <div className="grid flex-1 text-left text-lg text-primary">
                    <span className="truncate font-medium">CLUEZY</span>
                  </div>
                </div>
                <SidebarTrigger className='dark:text-neutral-400' />
              </div>
            }
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Toggle Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </SidebarHeader>

      <SidebarContent className="mt-2">
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
                    <SquarePen className="size-5" />
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
                    <Search className="size-5" />
                    <span>Search chats</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Search chats</TooltipContent>
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
                <UserMenu user={user} state={state} />
              </TooltipTrigger>
              <TooltipContent side="right">User Menu</TooltipContent>
            </Tooltip>
          ) : (
            <GuestMenu state={state} />
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
