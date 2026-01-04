'use client'

import Link from 'next/link'

import {
  Link2,
  LogIn,
  LucideBadgeAlert,
  Palette,
  Settings
} from 'lucide-react'

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

import { CompanyInfoItems } from './company-info'
import { useAuth } from './context/auth-context'
import { ExternalLinkItems } from './external-link-items'
import { ThemeMenuItems } from './theme-menu-items'

export default function GuestMenu({ state }: { state: "expanded" | "collapsed" }) {
  const { user } = useAuth()
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    'User'

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture

  const getInitials = (name: string, email?: string) => {
    if (name && name !== 'User') {
      const parts = name.split(' ')
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`
        : name.slice(0, 2).toUpperCase()
    }
    return email?.slice(0, 2).toUpperCase() || 'U'
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`group flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-sidebar-accent transition`}
        >
          <div className="relative flex shrink-0 overflow-hidden">
            <Settings size={16} />
          </div>

          <div className="flex flex-col text-left truncate text-sm">
            Settings & Help center
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-b border-primary/8 ml-6" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/auth/login" className='cursor-pointer'>
            <LogIn className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium text-sm'>Sign In</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <Palette className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium'>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ThemeMenuItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <Link2 className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium'>Links</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ExternalLinkItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <LucideBadgeAlert className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium'>Company Info</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CompanyInfoItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}