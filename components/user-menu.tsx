'use client'

import { useRouter } from 'next/navigation'

import { User } from '@supabase/supabase-js'
import { Link2, LogOut, Palette } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { AvatarImage } from '@radix-ui/react-avatar'
import { toast } from 'sonner'
import { useAuth } from './context/auth-context'
import { ExternalLinkItems } from './external-link-items'
import { clearChatHistoryCache } from './sidebar/chat-history-client'
import { ThemeMenuItems } from './theme-menu-items'
import { Button } from './ui/button'

interface UserMenuProps {
  user: User
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const { setUser } = useAuth()
  const userName =
    user.user_metadata?.full_name || user.user_metadata?.name || 'User'
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture

  const getInitials = (name: string, email: string | undefined) => {
    if (name && name !== 'User') {
      const names = name.split(' ')
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    if (email) {
      return email.split('@')[0].substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    clearChatHistoryCache()
    router.push('/')
    router.refresh()
    toast.success('Logged out successfully')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-[33px] w-[33px] text-foreground/70 hover:bg-muted rounded-full p-0 focus:ring-0">
          <Avatar className="h-[33px] w-[32px]">
            <AvatarImage className='h-[33px] w-[32px]' src={avatarUrl} alt={userName} />
            <AvatarFallback className='text-xs pt-[2px] text-foreground/70 bg-card border border-border/80'>
              {getInitials(userName, user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 bg-background border-b border-primary/8" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm pb-[1.2px] font-medium txt-grad leading-none truncate">
              {userName}
            </p>
            <p className="text-xs pb-[1.2px] leading-none txt-mut truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <div className='w-full h-[2px] bg-background rounded-full' /> */}
        {/* <Link href="/settings" className='flex gap-1 items-center pl-2 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md'>
          <Settings size={18} />
          <p className='text-sm'>Settings</p>
        </Link> */}
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
          <LogOut className="mr-2 h-4 w-4 text-foreground/70" />
          <span className='txt-grad'>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
