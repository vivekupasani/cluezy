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
import { ExternalLinkItems } from './external-link-items'
import { ThemeMenuItems } from './theme-menu-items'

export default function GuestMenu({ state }: { state: "expanded" | "collapsed" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`group flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-sidebar-accent transition ${state === 'collapsed' ? 'justify-center' : ''
          }`}
        >
          <Settings size={16} className=' text-foreground/80' />
          {state === 'expanded' && (
            <div className='text-sm txt-grad'>Settings & Help center</div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-b border-primary/8 ml-6" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/auth/login" className='cursor-pointer'>
            <LogIn className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='txt-grad text-sm'>Sign In</span>
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className='cursor-pointer'>
            <LucideBadgeAlert className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='txt-grad'>Company Info</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CompanyInfoItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}