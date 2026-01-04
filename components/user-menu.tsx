'use client'

import { User } from '@supabase/supabase-js'
import { Link2, LogOut, LucideBadgeAlert, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './context/auth-context'
import { clearChatHistoryCache } from './sidebar/chat-history-client'

import { CompanyInfoItems } from './company-info'
import { ExternalLinkItems } from './external-link-items'
import { ThemeMenuItems } from './theme-menu-items'

interface UserMenuProps {
  user: User
  state: 'expanded' | 'collapsed'
}

export default function UserMenu({ user, state }: UserMenuProps) {
  const router = useRouter()
  const { setUser } = useAuth()

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    'User'

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture

  const getInitials = (name: string, email?: string) => {
    if (name && name !== 'User') {
      const parts = name.split(' ')
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`
        : name.slice(0, 2).toUpperCase()
    }
    return email?.slice(0, 2).toUpperCase() || 'U'
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
        <button
          className={`group flex items-center gap-2 w-full rounded-lg hover:bg-sidebar-accent transition`}
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-xs">
              {getInitials(userName, user.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col text-left truncate">
            <span className="text-sm font-medium truncate text-foreground/70">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
            {/* <ChevronsUpDown className="ml-auto h-4 w-4" /> */}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 ml-6" align="end">
        {/* Profile */}
        <DropdownMenuItem className="flex flex-col justify-center items-start">
          <span className="truncate txt-grad">{userName}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Theme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium'>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ThemeMenuItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Links */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Link2 className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium'>Links</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ExternalLinkItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Company */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LucideBadgeAlert className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium'>Company Info</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CompanyInfoItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
