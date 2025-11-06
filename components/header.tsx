'use client'

// import Link from 'next/link' // No longer needed directly here for Sign In button
import React from 'react';


import { cn } from '@/lib/utils';


// import { Button } from './ui/button' // No longer needed directly here for Sign In button
import { Model } from '@/lib/types/models';
import { Cross, TextSearch } from 'lucide-react';
import Link from 'next/link';
import GuestMenu from './guest-menu'; // Import the new GuestMenu component
import { useHistoryDialog } from './history-dialog';
import { ModelSelector } from './model-selector';
import { SearchModeToggle } from './search-mode-toggle';
import UserMenu from './user-menu';

interface HeaderProps {
  user: any;
  models: Model[]
}

export const Header: React.FC<HeaderProps> = ({ user, models }) => {
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
        <Link href="/" className="group flex gap-1 bg-gradient-to-tr from-card/55 via-card/70 to-card/45 backdrop-blur-sm drop-shadow-sm shadow-inner shadow-primary-foreground border border-border/80 rounded-full px-2 py-2 cursor-pointer items-center">
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
        <SearchModeToggle />
        <span onClick={() => setHistoryDialogIsOpen(true)} className='hover:cursor-pointer bg-gradient-to-tr from-card/55 via-card/70 to-card/45 backdrop-blur-sm drop-shadow-sm shadow-inner shadow-primary-foreground border border-border/80 rounded-full px-2 py-2 hover:text-foreground/80 transition-colors'><TextSearch size={18} /></span>
        <ModelSelector models={models} />
        {user ? <UserMenu user={user} /> : <GuestMenu />}
      </div>
    </header>
  )
}

export default Header
