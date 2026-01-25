import { AnchorHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type CustomLinkProps = Omit<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  'ref'
> & {
  children: ReactNode
}

export function Citing({
  href,
  children,
  className,
  ...props
}: CustomLinkProps) {
  const childrenText = typeof children === 'string'
    ? children
    : Array.isArray(children)
      ? children.join('')
      : children?.toString() || ''

  const isNumber = /^\d+$/.test(childrenText.replace(/[\[\]]/g, ''))

  const linkClasses = isNumber
    ? cn(
      'text-[10px] bg-muted text-muted-foreground border border-border/70 rounded-full w-4 h-4 px-0.5 inline-flex items-center justify-center hover:bg-muted/50 duration-200 no-underline -translate-y-0.5',
      className
    )
    : cn(
      'text-primary hover:text-primary/80 hover:underline transition-colors duration-200',
      className
    )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClasses}
      {...props}
    >
      {children}
    </a>
  )
}
