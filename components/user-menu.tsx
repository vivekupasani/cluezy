'use client'

import { User } from '@supabase/supabase-js'
import { ExternalLink, LogOut, Palette } from 'lucide-react'
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

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { SiInstagram, SiLinkedin, SiX } from 'react-icons/si'
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

  const externalLinks = [
    {
      name: 'X',
      href: 'https://x.com/v1vekupasani',
      icon: <SiX className="mr-2 h-4 w-4 text-foreground/70" />
    },
    {
      name: 'Linkedin',
      href: 'https://www.linkedin.com/company/cluezy',
      icon: <SiLinkedin className="mr-2 h-4 w-4 text-foreground/70" />
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/v1vekupasani/',
      icon: <SiInstagram className="mr-2 h-4 w-4 text-foreground/70" />
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex items-center mb-2 md:mb-0 gap-2 w-full rounded-lg hover:bg-sidebar-accent transition",
          )}
        >
          <Avatar className="h-8 w-8">
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

      <DropdownMenuContent className="w-56 ml-6 border dark:border-border/50" align="end">
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
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Link2 className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium'>Links</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ExternalLinkItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}

        {/* Company */}
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LucideBadgeAlert className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-medium'>Company Info</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CompanyInfoItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}

        {
          externalLinks.map((link) => (
            <DropdownMenuItem
              onClick={handleLogout}
              className=""
            >
              <Link href={link.href} target="_blank" rel="noopener noreferrer" className='flex items-center justify-between'>
                {link.icon}
                <span className='text-foreground/70 font-medium text-sm'>{link.name}</span>
              </Link>
              <ExternalLink className="ml-auto h-4 w-4 text-foreground/70" />
            </DropdownMenuItem>
          ))
        }

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
    </DropdownMenu >
  )
}
