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
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { LoadingSpinner } from './ui/spinner'

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
        <DialogTrigger asChild className="ring-0">
          <Tooltip>
            <TooltipTrigger>
              <Button
                className={cn('rounded-full h-8 w-8')}
                size="icon"
                variant={'ghost'}
                onClick={() => setOpen(true)}
              >
                <Share
                  size={14}
                  className="text-foreground hover:text-foreground transition-colors"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Share
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent className="w-[95%] max-w-sm bg-background/95 rounded-3xl backdrop-blur-md border-2 border-border/50 shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Share link to search result
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm leading-relaxed px-2">
              Anyone with the link will be able to view this search result.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2.5 mt-6">
            {!shareUrl && (
              <Button
                onClick={handleShare}
                disabled={pending}
                className="w-full font-semibold py-5 rounded-xl shadow-lg hover:bg-primary/80 hover:shadow-xl transition-all duration-200"
              >
                {pending ? <LoadingSpinner /> : 'Get link'}
              </Button>
            )}
            {shareUrl && (
              <Button
                onClick={handleCopy}
                disabled={pending}
                className="w-full font-semibold py-5 rounded-xl shadow-lg hover:bg-primary/80 hover:shadow-xl transition-all duration-200"
              >
                {'Copy link'}
              </Button>
            )}
            {/* <Button
              variant="ghost"
              className='w-full text-muted-foreground hover:text-foreground py-5 rounded-xl'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
