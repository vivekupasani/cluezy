'use client'

import { useTheme } from 'next-themes'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-popover/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-popover-foreground group-[.toaster]:border-border/50 group-[.toaster]:rounded-lg group-[.toaster]:px-6 group-[.toaster]:py-4',
          description:
            'group-[.toast]:text-muted-foreground group-[.toast]:text-sm',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg'
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
