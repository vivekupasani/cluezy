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
  const { setUser, userPlanDetails, setUserPlanDetails } = useAuth()

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
    setUserPlanDetails(null)
    localStorage.removeItem("user");
    localStorage.removeItem("userPlanDetails");
    clearChatHistoryCache()
    router.push('/')
    router.refresh()
    toast.success('Logged out successfully')
  }

  const externalLinks = [
    {
      name: 'X',
      href: 'https://x.com/v1vekupasani',
      icon: <SiX className="mr-2 h-4 w-4 text-foreground" />
    },
    {
      name: 'Linkedin',
      href: 'https://www.linkedin.com/company/cluezy',
      icon: <SiLinkedin className="mr-2 h-4 w-4 text-foreground" />
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/v1vekupasani/',
      icon: <SiInstagram className="mr-2 h-4 w-4 text-foreground" />
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex items-center mb-2 md:mb-2 gap-2 w-full rounded-lg hover:bg-sidebar-accent transition",
          )}
        >
          <div className="relative">
            <Avatar className={cn("h-8 w-8",
              userPlanDetails?.isActive && userPlanDetails?.planName === "Pro" && "ring-2 ring-primary",
              userPlanDetails?.isActive && userPlanDetails?.planName === "Max" && "ring-2 ring-primary",
              // !userPlanDetails?.isActive && userPlanDetails?.planName === "Free" && "ring-2 ring-primary/50",
            )}>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-xs ">
                {getInitials(userName, user.email)}
              </AvatarFallback>
            </Avatar>
            {userPlanDetails?.isActive && (
              <span
                className={cn(
                  "absolute -bottom-1.5 right-1/2 translate-x-1/2 z-50 rounded-full px-1.5 py-[1px] text-[8px] font-bold tracking-widest lowercase text-white shadow-sm ring-1 ring-background",
                  userPlanDetails?.planName === "Pro" && "bg-gradient-to-r from-primary to-primary/90",
                  userPlanDetails?.planName === "Max" && "bg-gradient-to-r from-primary to-primary/90",
                  !["Pro", "Max"].includes(userPlanDetails?.planName || "") && "bg-primary"
                )}>
                {userPlanDetails?.planName}
              </span>
            )}
          </div>

          <div className="flex flex-col text-left truncate">
            <span className="text-sm font-normal truncate text-foreground">
              {userName}
            </span>
            <span className="text-xs text-foreground/80 truncate">
              {user.email}
            </span>
            {/* <ChevronsUpDown className="ml-auto h-4 w-4" /> */}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 ml-6 border dark:border-border/50 rounded-lg" align="end">
        {/* Profile */}
        <DropdownMenuItem className="flex flex-col justify-start items-start hover:bg-transparent cursor-default">
          <span className="truncate txt-grad">{userName}</span>
          <span className="truncate text-xs text-foreground">{user.email}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Theme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4 text-foreground" />
            <span className='text-foreground font-normal'>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ThemeMenuItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Links */}
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Link2 className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-normal'>Links</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ExternalLinkItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}

        {/* Company */}
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LucideBadgeAlert className="mr-2 h-4 w-4 text-foreground/70" />
            <span className='text-foreground/70 font-normal'>Company Info</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CompanyInfoItems />
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}

        {
          externalLinks.map((link, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={handleLogout}
              className=""
            >
              <Link href={link.href} target="_blank" rel="noopener noreferrer" className='flex items-center justify-between'>
                {link.icon}
                <span className='text-foreground font-normal text-sm'>{link.name}</span>
              </Link>
              <ExternalLink className="ml-auto h-4 w-4 text-foreground" />
            </DropdownMenuItem>
          ))
        }

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500 focus:text-red-500 cursor-pointer font-normal"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}
