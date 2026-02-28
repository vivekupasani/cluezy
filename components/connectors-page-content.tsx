'use client'

import { ArrowLeft, ArrowUpRight, RefreshCw, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/components/context/auth-context'
import { useConnectors } from '@/components/context/connectors-context'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'
import { PROVIDER_ICONS } from '@/lib/connectors/icons'
import { CONNECTOR_CONFIGS, ConnectorProvider } from '@/lib/connectors/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { HistoryDialog } from './history-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui'
import { useSidebar } from './ui/sidebar'

const activeProviders: ConnectorProvider[] = [
  'gmail',
  'google-drive',
  'notion',
  'google-calendar',
  'google-sheets',
  'google-docs',
  'linear',
  'supabase',
  'shopify',
  'youtube'
]

export function ConnectorsClientPage() {
  const { open } = useSidebar()
  const isMobile = useIsMobile()
  return (
    <div
      className={cn(
        'h-svh min-w-0 w-full bg-sidebar mt-0',
        open && !isMobile
          ? 'pt-3.5 border-none transition-all duration-300 ease-in-out'
          : 'mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10'
      )}
    >
      <div
        className={cn(
          'h-svh min-w-0 w-full bg-background mt-0',
          open && !isMobile
            ? 'rounded-tl-xl border-t border-l border-sidebar-ring/30 dark:border-sidebar-ring/10 transition-all duration-300 ease-in-out'
            : 'mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10'
        )}
      >
        <div className="CustomScrollbar max-w-5xl mx-auto px-4 lg:px-8 py-0 h-full overflow-y-auto HiddenScrollbar">
          <ConnectorsPageContent />
          <HistoryDialog />
        </div>
      </div>
    </div>
  )
}

export function ConnectorsPageContent() {
  const { connections, loading, connectingProvider, syncingProvider } =
    useConnectors()
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  const openConnectDialog = (provider: ConnectorProvider) => {
    router.push(`/connectors/${provider}`)
  }

  const filteredActive = activeProviders.filter(provider => {
    const config = CONNECTOR_CONFIGS[provider]
    return (
      config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const connectedProviders = new Set(connections.map(c => c.provider))
  const availableFiltered = filteredActive.filter(
    p => !connectedProviders.has(p)
  )

  return (
    <div className="w-full pb-10">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-4 md:pt-7 pb-4 mb-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="md:hidden flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div>
              <h1 className="text-lg font-semibold text-foreground leading-none">
                Connectors
                <span className="ml-2 text-xs font-normal text-muted-foreground/60 align-middle font-mono">
                  {activeProviders.length}
                </span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect your favourite apps and chat with them in Cluezy
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-48 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
            <input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 h-8 text-xs bg-muted/40 border border-border/50 rounded-lg outline-none focus:border-ring/50 placeholder:text-muted-foreground/40 text-foreground transition-colors"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-8">
          {/* ── Connected ──────────────────────────── */}
          {connections.length > 0 && (
            <section>
              <SectionLabel label="Connected" count={connections.length} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {connections.map(connection => {
                  const config = CONNECTOR_CONFIGS[connection.provider]
                  const Icon = connection.provider
                    ? PROVIDER_ICONS[config?.icon || '']
                    : null

                  return (
                    <AppCard
                      key={connection.id}
                      icon={Icon ? <Icon /> : null}
                      name={connection.name || config?.name || connection.slug}
                      tags={[connection.email || 'Connected']}
                      topRight={
                        syncingProvider === connection.provider ? (
                          <RefreshCw className="h-3 w-3 text-primary animate-spin" />
                        ) : (
                          <ConnectedBadge />
                        )
                      }
                      bottomLink={connection.name || config?.name}
                      onClick={() =>
                        connection.provider &&
                        openConnectDialog(connection.provider)
                      }
                    />
                  )
                })}
              </div>
            </section>
          )}

          {/* ── All Apps ───────────────────────────── */}
          <section>
            <SectionLabel label="All Apps" count={availableFiltered.length} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {availableFiltered.map(provider => {
                const config = CONNECTOR_CONFIGS[provider]
                const Icon = PROVIDER_ICONS[config.icon]

                return (
                  <Tooltip key={provider} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <AppCard
                        icon={<Icon />}
                        name={config.name}
                        tags={[config.description]}
                        topRight={
                          !user ? (
                            <span className="text-[10px] text-muted-foreground/40 font-medium">
                              Sign in
                            </span>
                          ) : (
                            <ConnectBadge />
                          )
                        }
                        bottomLink={config.name}
                        onClick={() => {
                          if (user) openConnectDialog(provider)
                          else
                            toast.message(
                              'Please sign in to connect your account'
                            )
                        }}
                      />
                    </TooltipTrigger>
                    {!user && (
                      <TooltipContent>Sign in to connect</TooltipContent>
                    )}
                  </Tooltip>
                )
              })}
            </div>

            {availableFiltered.length === 0 && (
              <p className="text-sm text-muted-foreground pt-3">
                No apps match your search.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

/* ─── Badges ──────────────────────────────────────────────── */

function ConnectedBadge() {
  return (
    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
      Active
    </span>
  )
}

function ConnectBadge() {
  return (
    <span className="text-[10px] font-medium text-muted-foreground/50">
      + Connect
    </span>
  )
}

/* ─── AppCard ─────────────────────────────────────────────── */

function AppCard({
  icon,
  name,
  tags,
  topRight,
  bottomLink,
  onClick,
  disabled
}: {
  icon: React.ReactNode
  name: string | undefined
  tags?: string[]
  topRight?: React.ReactNode
  bottomLink?: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative w-full text-left flex flex-col gap-3 p-3.5',
        'rounded-xl border border-border/40 dark:border-border/20',
        'bg-card/50 dark:bg-card/80',
        'hover:border-border/70 dark:hover:border-border/40 hover:bg-accent/10 dark:hover:bg-accent/10',
        'transition-colors duration-150',
        disabled && 'cursor-default opacity-50'
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-1">
        <div className="w-9 h-9 rounded-lg bg-background border border-border/50 dark:border-border/30 flex items-center justify-center text-lg shrink-0">
          {icon}
        </div>
        <div className="flex items-center pt-0.5">{topRight}</div>
      </div>

      {/* Name */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground leading-snug">
          {name}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground/50 font-medium mt-1.5 line-clamp-1">
            {tags.join(' · ')}
          </p>
        )}
      </div>

      {/* Bottom link */}
      {bottomLink && (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
          <span className="truncate">{bottomLink}</span>
          <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
        </div>
      )}
    </button>
  )
}

/* ─── Section label ───────────────────────────────────────── */

function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground/50 font-mono">
        {count}
      </span>
    </div>
  )
}

/* ─── Loading skeleton ────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[6, 8].map((n, si) => (
        <div key={si}>
          <Skeleton className="h-4 w-24 mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {Array.from({ length: n }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-3.5 rounded-xl border border-border/40 bg-card/50"
              >
                <div className="flex items-start justify-between">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-2.5 w-28" />
                </div>
                <Skeleton className="h-2.5 w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
