'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { FileText, GlobeLock, Info, LayoutGrid, PanelLeftClose, PanelRightClose, Search, ShieldCheck, SquarePen } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '@/components/context/auth-context'
import GuestMenu from '@/components/guest-menu'
import { useHistoryDialog } from '@/components/history-dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import UserMenu from '@/components/user-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { useEffect } from 'react'
import { ExcludedDomainsDialog } from './excluded-domains-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function AppSidebar() {
  const router = useRouter()
  const { setHistoryDialogIsOpen } = useHistoryDialog()
  const { user } = useAuth()
  const { toggleSidebar, setOpenMobile, setOpen, state } = useSidebar()
  const pathName = usePathname()
  const isMobile = useIsMobile()
  const pages = [
    '/pricing',
    '/playbook'
  ]

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'o' && e.shiftKey && e.ctrlKey) {
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
    <Sidebar collapsible="icon" variant='sidebar' className='border border-border/70 dark:border-none'>
      <SidebarHeader className="flex flex-row items-center justify-between pt-4 pb-2 gap-0">
        <SidebarMenuButton onClick={toggleSidebar}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex justify-end w-full items-center'>
                {/* <div className="flex h-7 w-7 items-center object-cover justify-center rounded-full overflow-hidden">
                  <CluezyLogo />
                </div> */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={state}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {state === 'collapsed' ? <PanelRightClose size={16} className='text-muted-foreground' /> : <PanelLeftClose size={16} className='text-muted-foreground' />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className='text-xs'>Toggle Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
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

            <SidebarMenu>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => {
                        router.push('/apps')
                        if (isMobile) {
                          setOpenMobile(false)
                        }
                      }}
                      className="justify-start gap-2 data-[state=open]:px-2"
                    >
                      <LayoutGrid className="size-5 font-bold text-muted-foreground" />
                      <span className='text-foreground/80'>Apps</span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" className='text-xs'>Apps</TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenuItem>
              <ExcludedDomainsDialog
                trigger={
                  <SidebarMenuButton
                    className="justify-start gap-2 data-[state=open]:px-2">
                    <GlobeLock className="size-5 text-muted-foreground" />
                    <span className='text-foreground/80'>Exclude Sources</span>
                  </SidebarMenuButton>
                }
              />
            </SidebarMenuItem>
            <SidebarMenu>
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
                      <span className='text-foreground/80'>About</span>
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
                      <span className='text-foreground/80'>Terms & Service</span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" className='text-xs'>
                    Terms & Service
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarMenu>
        </SidebarGroup>

        {state !== 'collapsed' && (
          <SidebarGroup>
            <SidebarGroupLabel></SidebarGroupLabel>
          </SidebarGroup>
        )}
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

        {state !== 'collapsed' && (
          <div className="hidden" />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
