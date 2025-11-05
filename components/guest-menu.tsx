'use client'

import Link from 'next/link'

import {
  Link2,
  LogIn,
  LucideBadgeAlert,
  Palette,
  Settings2 // Or EllipsisVertical, etc.
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
import { ExternalLinkItems } from './external-link-items'
import { ThemeMenuItems } from './theme-menu-items'

export default function GuestMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='bg-gradient-to-tr from-card/55 via-card/70 to-card/45 backdrop-blur-sm drop-shadow-sm shadow-inner shadow-foreground/5 border border-border/80 rounded-full px-2 py-2 cursor-pointer items-center'>
          <Settings2 size={18} /> {/* Choose an icon */}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-muted/20 shadow-inner shadow-muted-foreground/10 border-b border-primary/8" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/auth/login" className='cursor-pointer'>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ThemeMenuItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <Link2 className="mr-2 h-4 w-4" />
            <span>Links</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ExternalLinkItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <LucideBadgeAlert className="mr-2 h-4 w-4" />
            <span>Company Info</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CompanyInfoItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
