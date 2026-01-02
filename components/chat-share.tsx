'use client'

import { useState, useTransition } from 'react'

import { Share } from 'lucide-react'
import { toast } from 'sonner'

import { shareChat } from '@/lib/actions/chat'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Spinner } from './ui/spinner'

interface ChatShareProps {
  chatId: string
  className?: string
}

export function ChatShare({ chatId, className }: ChatShareProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 })
  const [shareUrl, setShareUrl] = useState('')

  const handleShare = async () => {
    startTransition(() => {
      setOpen(true)
    })
    //we need to share userId 
    const result = await shareChat(chatId)
    if (!result) {
      toast.error('Failed to share chat')
      return
    }

    if (!result.sharePath) {
      toast.error('Could not copy link to clipboard')
      return
    }

    const url = new URL(result.sharePath, window.location.href)
    setShareUrl(url.toString())
  }

  const handleCopy = () => {
    if (shareUrl) {
      copyToClipboard(shareUrl)
      toast.success('Link copied to clipboard')
      setOpen(false)
    } else {
      toast.error('No link to copy')
    }
  }

  return (
    <div className={className}>
      <Dialog
        open={open}
        onOpenChange={open => setOpen(open)}
        aria-labelledby="share-dialog-title"
        aria-describedby="share-dialog-description"
      >
        <DialogTrigger asChild className='ring-0'>
          <Tooltip>
            <TooltipTrigger>
              <Button
                className={cn('rounded-full h-8 w-8')}
                size="icon"
                variant={'ghost'}
                onClick={() => setOpen(true)}
              >
                <Share size={14} className='text-foreground/70 hover:text-foreground transition-colors' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className='text-xs'>
              Share
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent className='w-[90%] bg-gradient-to-br from-card/75 via-card/55 to-card/65 rounded-2xl backdrop-blur-sm ring-0'>
          <DialogHeader>
            <DialogTitle className='txt-grad'>Share link to search result</DialogTitle>
            <DialogDescription className='txt-mut'>
              Anyone with the link will be able to view this search result.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="items-center">
            {!shareUrl && (
              <Button onClick={handleShare} disabled={pending} size="sm">
                {pending ? <Spinner /> : 'Get link'}
              </Button>
            )}
            {shareUrl && (
              <Button onClick={handleCopy} disabled={pending} size="sm">
                {'Copy link'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
