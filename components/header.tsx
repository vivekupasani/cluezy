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
        <Link href="/" className="group flex gap-1 bg-gradient-to-tr from-card/55 via-card/70 to-card/45 hover:bg-muted border border-border rounded-full px-2 py-2 cursor-pointer items-center">
          <Cross
            size={16}
            className="group-hover:rotate-90 group-hover:opacity-95 transition-transform duration-100 text-foreground/70 group-hover:text-foreground"
          />
          <span className="text-xs font-medium text-foreground/70 hidden group-hover:inline-block transition-all duration-200 group-hover:text-foreground">
            New
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2" suppressHydrationWarning>
        {/* <SearchModeToggle /> */}

        {/* {
          user ?
          :
          <Link href="/auth/login" className='rounded-full bg-[#644a40] text-[#ffffff] dark:bg-[#393028] dark:text-[#ffffff] drop-shadow-sm px-3 py-2 text-xs hover:bg-primary/90 border border-border'>Sign In</Link>
        } */}

        <span onClick={() => setHistoryDialogIsOpen(true)} className='group hover:cursor-pointer bg-gradient-to-tr from-card/55 via-card/70 to-card/45 border border-border rounded-full px-2 py-2 hover:bg-muted'><TextSearch size={16} className=' text-foreground/70' /></span>
        <ModelSelector models={models} />
        {user ? <UserMenu user={user} /> : <GuestMenu />}
      </div>
    </header>
  )
}

export default Header
