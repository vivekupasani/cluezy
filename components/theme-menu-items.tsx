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

export function ArtifactThemeMenuItems() {
  const { setTheme, theme } = useTheme()

  return (
    <>
      <DropdownMenuItem onClick={() => setTheme('light')} className={`cursor-pointer ${theme === 'light' ? 'bg-accent text-accent-foreground mb-1' : 'my-0'}`}>
        <Sun className="mr-2 h-3 w-3 text-foreground" />
        <span className='text-foreground font-medium text-xs'>Light</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')} className={`cursor-pointer ${theme === 'dark' ? 'bg-accent text-accent-foreground my-1' : 'my-0'}`}>
        <Moon className="mr-2 h-3 w-3 text-foreground" />
        <span className='text-foreground font-medium text-xs'>Dark</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')} className={`cursor-pointer ${theme === 'system' ? 'bg-accent text-accent-foreground my-1' : 'my-0'}`}>
        <Laptop className="mr-2 h-3 w-3 text-foreground" />
        <span className='text-foreground font-medium text-xs'>System</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('boring-light')} className={`cursor-pointer ${theme === 'boring-light' ? 'bg-accent text-accent-foreground my-1' : 'my-0'}`}>
        <Sun className="mr-2 h-3 w-3 text-foreground" />
        <span className='text-foreground font-medium text-xs'>Normal Light</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('boring-dark')} className={`cursor-pointer ${theme === 'boring-dark' ? 'bg-accent text-accent-foreground my-1' : 'my-0'}`}>
        <Moon className="mr-2 h-3 w-3 text-foreground" />
        <span className='text-foreground font-medium text-xs'>Normal Dark</span>
      </DropdownMenuItem>
    </>
  )
}
