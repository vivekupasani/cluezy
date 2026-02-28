'use client'

import Link from 'next/link'

import { ExternalLink, LogIn, Palette, Settings } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { useIsMobile } from '@/hooks/use-mobile'
import { SiInstagram, SiLinkedin, SiX } from 'react-icons/si'
import { useAuth } from './context/auth-context'
import { ThemeMenuItems } from './theme-menu-items'
import { useSidebar } from './ui/sidebar'

export default function GuestMenu({
  state
}: {
  state: 'expanded' | 'collapsed'
}) {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const { setOpenMobile } = useSidebar()
  const userName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  const getInitials = (name: string, email?: string) => {
    if (name && name !== 'User') {
      const parts = name.split(' ')
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`
        : name.slice(0, 2).toUpperCase()
    }
    return email?.slice(0, 2).toUpperCase() || 'U'
  }

  const externalLinks = [
    {
      name: 'X',
      href: 'https://x.com/v1vekupasani',
      icon: <SiX className="mr-2 h-4 w-4 text-foreground" />
    },
    {
      name: 'Linkedin',
      href: 'https://www.linkedin.com/company/cluezy',
      icon: <SiLinkedin className="mr-2 h-4 w-4 text-foreground" />
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/v1vekupasani/',
      icon: <SiInstagram className="mr-2 h-4 w-4 text-foreground" />
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`group flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-sidebar-accent transition`}
        >
          <div className="relative flex shrink-0 overflow-hidden">
            <Settings size={16} className="text-foreground font-normal" />
          </div>

          <div className="flex flex-col text-foreground text-left truncate text-sm font-normal">
            Settings & Help center
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 dark:border-border/50 ml-6 rounded-lg"
        align="end"
        forceMount
      >
        <DropdownMenuItem asChild>
          <Link
            onClick={() => {
              if (isMobile) {
                setOpenMobile(false)
              }
            }}
            href="/auth/login"
            className="cursor-pointer"
          >
            <LogIn className="mr-2 h-4 w-4 text-foreground" />
            <span className="text-foreground font-normal text-sm">Sign In</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4 text-foreground" />
            <span className="text-foreground font-normal">Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ThemeMenuItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <Link2 className="mr-2 h-4 w-4 text-foreground" />
            <span className='text-foreground font-normal'>Links</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ExternalLinkItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <LucideBadgeAlert className="mr-2 h-4 w-4 text-foreground" />
            <span className='text-foreground font-normal'>Company Info</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CompanyInfoItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}

        {externalLinks.map((link, idx) => (
          <DropdownMenuItem key={idx}>
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between"
            >
              {link.icon}
              <span className="text-foreground font-normal text-sm">
                {link.name}
              </span>
            </Link>
            <ExternalLink className="ml-auto h-4 w-4 text-foreground" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
