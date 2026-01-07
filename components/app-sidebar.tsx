'use client'

import { usePathname, useRouter } from 'next/navigation'

import { BookOpen, FileText, Info, PanelLeftClose, PanelRightClose, Search, ShieldCheck, SquarePen } from 'lucide-react'

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
  useSidebar
} from '@/components/ui/sidebar'
import UserMenu from '@/components/user-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import Image from 'next/image'
import { useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function AppSidebar() {
  const router = useRouter()
  const { setHistoryDialogIsOpen } = useHistoryDialog()
  const { user } = useAuth()
  const { toggleSidebar, setOpenMobile, state } = useSidebar()
  const pathName = usePathname()
  const isMobile = useIsMobile()
  const pages = [
    '/about',
    '/privacy',
    '/terms',
    '/settings',
    '/pricing',
    '/playbook'
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
      <SidebarHeader className="flex flex-row items-center justify-between pt-4 pb-2 gap-0">
        <SidebarMenuButton onClick={toggleSidebar}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex justify-between w-full items-center'>
                <div className='opacity-0 flex gap-2 justify-between items-center'>
                  <div className="flex h-7 w-7 items-center object-cover justify-center rounded-full overflow-hidden bg-primary text-primary-foreground">
                    <Image src="/cluezy-logo.png" alt="Cluezy" width={28} height={28} className='' />
                  </div>
                  <div className="grid flex-1 text-left text-lg text-primary">
                    <span className="truncate font-medium">CLUEZY</span>
                  </div>
                </div>
                {
                  state === 'collapsed' ? <PanelRightClose size={16} className='text-muted-foreground' /> : <PanelLeftClose size={16} className='text-muted-foreground' />
                }
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className='text-xs'>Close Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </SidebarMenuButton>
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
                      if (isMobile) {
                        setOpenMobile(false)
                      }
                    }}
                    className="justify-start gap-2 data-[state=open]:px-2"
                  >
                    <SquarePen className="size-5 text-muted-foreground" />
                    <span className='text-foreground/80'>New Chat</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className='text-xs'>
                  New Chat
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      setHistoryDialogIsOpen(true)
                      if (isMobile) {
                        setOpenMobile(false)
                      }
                    }}
                    className="justify-start gap-2 data-[state=open]:px-2"
                  >
                    <Search className="size-5 text-muted-foreground" />
                    <span className='text-foreground/80'>Search chats</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className='text-xs'>Search chats</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      router.push('/playbook')
                      // Optional: Refresh or reset chat state if needed
                      if (isMobile) {
                        setOpenMobile(false)
                      }
                    }}
                    className="justify-start gap-2 data-[state=open]:px-2"
                  >
                    <BookOpen className="size-5 text-muted-foreground" />
                    <span className='text-foreground/80'>Playbook</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className='text-xs'>
                  Playbook
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      router.push('/about')
                      // Optional: Refresh or reset chat state if needed
                      if (isMobile) {
                        setOpenMobile(false)
                      }
                    }}
                    className="justify-start gap-2 data-[state=open]:px-2"
                  >
                    <Info className="size-5 text-muted-foreground" />
                    <span className='text-foreground/80'>About Us</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className='text-xs'>
                  About
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      router.push('/privacy')
                      // Optional: Refresh or reset chat state if needed
                      if (isMobile) {
                        setOpenMobile(false)
                      }
                    }}
                    className="justify-start gap-2 data-[state=open]:px-2"
                  >
                    <ShieldCheck className="size-5 text-muted-foreground" />
                    <span className='text-foreground/80'>Privacy Policy</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className='text-xs'>
                  Privacy Policy
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      router.push('/terms')
                      // Optional: Refresh or reset chat state if needed
                      if (isMobile) {
                        setOpenMobile(false)
                      }
                    }}
                    className="justify-start gap-2 data-[state=open]:px-2"
                  >
                    <FileText className="size-5 text-muted-foreground" />
                    <span className='text-foreground/80'>Terms of Service</span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className='text-xs'>
                  Terms of Service
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='pl-2 pb-4 md:pb-2'>
        <SidebarMenuItem className="flex flex-col gap-2 items-start w-full">
          {user ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <UserMenu user={user} state={state} />
              </TooltipTrigger>
              <TooltipContent side="right" className='text-xs'>User Menu</TooltipContent>
            </Tooltip>
          ) : (
            <GuestMenu state={state} />
          )}
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  )
}
