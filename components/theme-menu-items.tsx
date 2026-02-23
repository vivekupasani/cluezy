'use client'

import { useTheme } from 'next-themes'

import { Laptop, Moon, Sun } from 'lucide-react'

import { DropdownMenuItem } from './ui/dropdown-menu'

export function ThemeMenuItems() {
  const { setTheme } = useTheme()

  return (
    <>
      <DropdownMenuItem onClick={() => setTheme('light')} className='cursor-pointer'>
        <Sun className="mr-2 h-4 w-4 text-foreground" />
        <span className='text-foreground font-medium'>Light</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')} className='cursor-pointer'>
        <Moon className="mr-2 h-4 w-4 text-foreground" />
        <span className='text-foreground font-medium'>Dark</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')} className='cursor-pointer'>
        <Laptop className="mr-2 h-4 w-4 text-foreground" />
        <span className='text-foreground font-medium'>System</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('boring-light')} className='cursor-pointer'>
        <Sun className="mr-2 h-4 w-4 text-foreground" />
        <span className='text-foreground font-medium'>Normal Light</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('boring-dark')} className='cursor-pointer'>
        <Moon className="mr-2 h-4 w-4 text-foreground" />
        <span className='text-foreground font-medium'>Normal Dark</span>
      </DropdownMenuItem>
    </>
  )
}
