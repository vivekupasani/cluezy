'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CreditCard, Crown, FileText, GlobeLock, Info, LayoutGrid, PanelLeftClose, PanelRightClose, Search, ShieldCheck, SquarePen } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '@/components/context/auth-context'
import GuestMenu from '@/components/guest-menu'
import { useHistoryDialog } from '@/components/history-dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import UserMenu from '@/components/user-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { CluezyLogo } from '@/lib/utils/cluezy-logo'
import { useEffect } from 'react'
import { BillingDialog } from './billing-dialog'
import { ExcludedDomainsDialog } from './excluded-domains-dialog'
import { PricingDialog } from './pricing-dialog'

export function AppSidebar() {
  const router = useRouter()
  const { setHistoryDialogIsOpen } = useHistoryDialog()
  const { user, userPlanDetails } = useAuth()
  const { toggleSidebar, setOpenMobile, setOpen, state } = useSidebar()
  const pathName = usePathname()
  const isMobile = useIsMobile()
  const pages = [
    '/pricing',
    '/playbook',
    '/premium',
    '/payment-successful'
  ]

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'O' && e.ctrlKey && e.shiftKey) {
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
    <Sidebar collapsible="offcanvas" variant='sidebar' className='border-none'>
      <SidebarHeader className="flex flex-row items-center justify-between pt-4 pb-4 gap-0">
        <SidebarMenuButton onClick={toggleSidebar}>
          <div className='flex justify-between w-full items-center'>
            <div className="flex h-8 w-7 items-center object-cover justify-center rounded-md overflow-hidden">
              <CluezyLogo />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {state === 'collapsed' ? <PanelRightClose size={16} className='text-foreground' /> : <PanelLeftClose size={16} className='text-foreground' />}
              </motion.div>
            </AnimatePresence>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="gap-0 mx-[7.6px]">
        <SidebarMenu>
          <SidebarMenuItem>
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
              <SquarePen className="size-5 text-foreground font-normal" />
              <span className='text-foreground font-normal'>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                setHistoryDialogIsOpen(true)
                if (isMobile) {
                  setOpenMobile(false)
                }
              }}
              className="justify-start gap-2 data-[state=open]:px-2"
            >
              <Search className="size-5 text-foreground font-normal" />
              <span className='text-foreground font-normal'>Search chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <ExcludedDomainsDialog
              trigger={
                <SidebarMenuButton
                  className="justify-start gap-2 data-[state=open]:px-2">
                  <GlobeLock className="size-5 text-foreground font-normal" />
                  <span className='text-foreground font-normal'>Exclude Sources</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  router.push('/connectors')
                  if (isMobile) {
                    setOpenMobile(false)
                  }
                }}
                className="justify-start gap-2 data-[state=open]:px-2"
              >
                <LayoutGrid className="size-5 font-normal text-foreground" />
                <span className='text-foreground font-normal'>Connectors</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {
            userPlanDetails?.planName != "Free" && user ? (
              <SidebarMenuItem>
                <BillingDialog
                  trigger={
                    <SidebarMenuButton
                      className="justify-start gap-2 data-[state=open]:px-2"
                    >
                      <CreditCard className="size-5 text-foreground font-normal" />
                      <span className='text-foreground font-normal'>Manage Billing</span>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <PricingDialog
                  trigger={
                    <SidebarMenuButton
                      className="justify-start gap-2 data-[state=open]:px-2"
                    >
                      <Crown className="size-5 text-foreground font-normal" />
                      <span className='text-foreground font-normal'>Subscription</span>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>
            )
          }

        </SidebarMenu>

        {state !== 'collapsed' && (
          <motion.div
          // initial={{
          //   opacity: 0,
          //   x: 0
          // }}
          // animate={{
          //   opacity: 1,
          //   x: 1,
          //   transition: {
          //     duration: 0.2,
          //     ease: 'easeInOut'
          //   }
          // }}
          >
            <SidebarHeader className='text-[10px] mt-2 uppercase text-foreground font-normal'>Company</SidebarHeader>
            <SidebarMenu className='transition-opacity'>
              <SidebarMenuItem>
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
                  <Info className="size-5 text-foreground font-normal" />
                  <span className='text-foreground font-normal'>About Us</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
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
                  <ShieldCheck className="size-5 text-foreground font-normal" />
                  <span className='text-foreground font-normal'>Privacy Policy</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
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
                  <FileText className="size-5 text-foreground font-normal" />
                  <span className='text-foreground font-normal'>Terms & Service</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </motion.div>
        )}
      </SidebarContent>

      <SidebarFooter className='pl-2 pb-4 md:pb-2'>
        <SidebarMenuItem className="flex flex-col gap-2 items-start w-full">
          {user ? (
            <UserMenu user={user} state={state} />
          ) : (
            <GuestMenu state={state} />
          )}
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar >
  )
}
