'use client'

// import Link from 'next/link' // No longer needed directly here for Sign In button
import React from 'react';


import { cn } from '@/lib/utils';


// import { Button } from './ui/button' // No longer needed directly here for Sign In button
import { Cross, TextSearch } from 'lucide-react';
import Link from 'next/link';
import GuestMenu from './guest-menu'; // Import the new GuestMenu component
import { useHistoryDialog } from './history-dialog';
import { SearchModeToggle } from './search-mode-toggle';
import UserMenu from './user-menu';

interface HeaderProps {
  user: any;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { setHistoryDialogIsOpen } = useHistoryDialog();
  return (
    <header
      className={cn(
        'absolute top-0 right-0 p-2 flex justify-between items-center z-10 backdrop-blur lg:backdrop-blur bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear',
        'w-full'
      )}
    >
      {/* This div can be used for a logo or title on the left if needed */}
      <div className='flex items-center gap-2'>
        <Link href="/" className="group flex gap-1 bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-sm shadow-inner shadow-card-foreground/10 border-b border-primary/8 rounded-full px-2 py-2 cursor-pointer items-center">
          <Cross
            size={18}
            className="group-hover:rotate-90 group-hover:opacity-95 transition-transform duration-100 text-foreground"
          />
          <span className="text-sm font-medium text-foreground hidden group-hover:inline-block transition-all duration-200">
            New
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <span onClick={() => setHistoryDialogIsOpen(true)} className='hover:cursor-pointer bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-sm shadow-inner shadow-card-foreground/10 border-b border-primary/8 rounded-full px-2 py-2 hover:text-foreground/80 transition-colors'><TextSearch size={18} /></span>
        <SearchModeToggle />
        {user ? <UserMenu user={user} /> : <GuestMenu />}
      </div>
    </header>
  )
}

export default Header
