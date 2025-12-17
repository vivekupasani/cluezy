'use client'

// import Link from 'next/link' // No longer needed directly here for Sign In button
import React from 'react';


import { cn } from '@/lib/utils';


// import { Button } from './ui/button' // No longer needed directly here for Sign In button
import { Model } from '@/lib/types/models';
import { Cross, TextSearch } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './context/auth-context';
import GuestMenu from './guest-menu'; // Import the new GuestMenu component
import { useHistoryDialog } from './history-dialog';
import { ModelSelector } from './model-selector';
import UserMenu from './user-menu';

interface HeaderProps {
  // user: User;
  models: Model[]
}

export const Header: React.FC<HeaderProps> = ({ models }) => {
  const { setHistoryDialogIsOpen } = useHistoryDialog();
  const { user } = useAuth();
  const pathName = usePathname();
  const pages = [
    '/about',
    '/privacy',
    '/terms'
  ]

  // Don't render the header on the /auth/* pages
  if (pathName.startsWith('/auth/') || pages.includes(pathName)) {
    return null;
  }

  return (
    <header
      className={cn(
        'absolute top-0 right-0 px-2 pt-2 pb-2 lg:pb-0 flex justify-between items-center z-10 backdrop-blur lg:backdrop-blur bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear',
        'w-full'
      )}
    >
      {/* This div can be used for a logo or title on the left if needed */}
      <div className='flex items-center gap-2'>
        <Link href="/" className="group flex gap-1 rounded-full px-2 py-2 cursor-pointer items-center hover:bg-muted border border-border">
          <Cross
            size={16}
            className="group-hover:rotate-90 group-hover:opacity-95 transition-transform duration-100 text-foreground/80 group-hover:text-foreground"
          />
          {/* <span className="text-xs font-medium text-foreground/70 hidden group-hover:inline-block transition-all duration-200 group-hover:text-foreground">
            New
          </span> */}
        </Link>
      </div>

      <div className="flex items-center gap-2" suppressHydrationWarning>
        {/* <SearchModeToggle /> */}
        <span onClick={() => setHistoryDialogIsOpen(true)} className='group hover:cursor-pointer rounded-full px-2 py-2 hover:bg-muted border border-border'><TextSearch size={16} className=' text-foreground/80' /></span>
        <ModelSelector models={models} />
        {user ? <UserMenu user={user} /> : <GuestMenu />}
      </div>
    </header>
  )
}

export default Header
