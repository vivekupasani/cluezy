import { cn } from '@/lib/utils/index'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-secondary dark:bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
