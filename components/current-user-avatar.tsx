'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentUserImage } from '@/hooks/use-current-user-image'
import { useCurrentUserEmail, useCurrentUserName } from '@/hooks/use-current-user-name'
import { User2 } from 'lucide-react'

interface CurrentUserAvatarProps {
  size?: number | string
  className?: string
}

export const CurrentUserAvatar = ({ size = 16, className }: CurrentUserAvatarProps) => {
  const profileImage = useCurrentUserImage()
  const name = useCurrentUserName()
  const email = useCurrentUserEmail()

  const getInitials = (name: string, email: string | undefined) => {
    if (name && name !== 'User') {
      const parts = name.trim().split(' ')
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    if (email) {
      return email.split('@')[0].substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const initials = getInitials(name, email)

  return (
    <Avatar className={`size-6 ${className || ''}`}>
      {/* Only show AvatarImage if valid */}
      {profileImage && profileImage.trim() !== '' && (
        <AvatarImage src={profileImage} alt={name || 'User'} />
      )}

      {/* Always include fallback */}
      <AvatarFallback className="p-1 text-xs font-medium flex items-center justify-center bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-sm shadow-inner shadow-card-foreground/10 border-b border-primary/8">
        {initials ? (
          <User2 size={size} className="text-muted-foreground" />
          // <p className="text-xs p-2">{initials}</p>
        ) : (
          <User2 size={size} className="text-muted-foreground" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}
