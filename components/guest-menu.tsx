'use client'

import Link from 'next/link'

import {
  Link2,
  LogIn,
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

import { ExternalLinkItems } from './external-link-items'
import { ThemeMenuItems } from './theme-menu-items'

export default function GuestMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='group hover:bg-muted rounded-full px-2 py-2 cursor-pointer items-center border border-border'>
          <Settings2 size={16} className=' text-foreground/80' /> {/* Choose an icon */}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background border-b border-primary/8" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/auth/login" className='cursor-pointer'>
            <LogIn className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='txt-grad'>Sign In</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <Palette className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='txt-grad'>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ThemeMenuItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <Link2 className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='txt-grad'>Links</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ExternalLinkItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <LucideBadgeAlert className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='txt-grad'>Company Info</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CompanyInfoItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
