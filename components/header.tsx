'use client'

// import Link from 'next/link' // No longer needed directly here for Sign In button
import React from 'react'


import { cn } from '@/lib/utils'

import { useSidebar } from '@/components/ui/sidebar'

// import { Button } from './ui/button' // No longer needed directly here for Sign In button
import { Cross, TextSearch } from 'lucide-react'
import GuestMenu from './guest-menu'; // Import the new GuestMenu component
import { useHistoryDialog } from './history-dialog'
import UserMenu from './user-menu'

interface HeaderProps {
  user: any
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { open } = useSidebar()
  const { setHistoryDialogIsOpen } = useHistoryDialog();
  return (
    <header
      className={cn(
        'absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10 backdrop-blur lg:backdrop-blur bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear',
        open ? 'md:w-[calc(100%-var(--sidebar-width))]' : 'md:w-full',
        'w-full'
      )}
    >
      {/* This div can be used for a logo or title on the left if needed */}
      <div>
        <div className="group flex gap-1 bg-muted rounded-full px-2 py-2 cursor-pointer items-center">
          <Cross
            size={20}
            className="group-hover:rotate-90 transition-transform duration-100 text-foreground"
          />
          <span className="text-sm font-bold text-foreground hidden group-hover:inline-block transition-all duration-200">
            New
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span onClick={() => setHistoryDialogIsOpen(true)} className='hover:cursor-pointer'><TextSearch /></span>
        {user ? <UserMenu user={user} /> : <GuestMenu />}
      </div>
    </header>
  )
}

export default Header
