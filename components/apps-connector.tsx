'use client'

import { useAuth } from '@/components/context/auth-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { PROVIDER_ICONS } from '@/lib/connectors/icons'
import {
  Connection,
  CONNECTOR_CONFIGS,
  ConnectorProvider
} from '@/lib/connectors/types'
import { cn } from '@/lib/utils'
import { ArrowLeft, Check, Loader2, Plug, Shield } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useConnectors } from './context/connectors-context'
import { useSidebar } from './ui/sidebar'

interface AppsConnectorProps {
  connections: Connection[]
  connectingProvider: ConnectorProvider | null
  deletingId: string | null
  syncingProvider: ConnectorProvider | null
  handleConnect: (provider: ConnectorProvider) => Promise<void>
  handleSync: (provider: ConnectorProvider) => Promise<void>
  handleDisconnect: (connectionId: string) => Promise<void>
}

export function AppsConnectorClientPage() {
  const {
    connections,
    connectingProvider,
    deletingId,
    syncingProvider,
    handleConnect,
    handleSync,
    handleDisconnect
  } = useConnectors()

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
          <AppsConnector
            connections={connections}
            connectingProvider={connectingProvider}
            deletingId={deletingId}
            syncingProvider={syncingProvider}
            handleConnect={handleConnect}
            handleSync={handleSync}
            handleDisconnect={handleDisconnect}
          />
        </div>
      </div>
    </div>
  )
}

export function AppsConnector({
  connections,
  connectingProvider,
  deletingId,
  syncingProvider,
  handleConnect,
  handleSync,
  handleDisconnect
}: AppsConnectorProps) {
  const { slug } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const providerSlug = slug as ConnectorProvider
  const config = CONNECTOR_CONFIGS[providerSlug]
  const Icon = config ? PROVIDER_ICONS[config.icon] : null

  if (!config) return null

  const connection = connections.find(c => c.provider === providerSlug)
  const isConnected = !!connection
  const totalTools = config.features.length

  const isConnecting = connectingProvider === providerSlug
  const isDeleting = connection && deletingId === connection.id

  return (
    <div className="w-full pb-20">
      {/* ── Page Header & Navigation ─────────────────── */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-4 md:pt-7 pb-4 mb-2">
        <button
          onClick={() => router.push('/connectors')}
          className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to Apps
        </button>
      </div>

      {/* ── App Hero Section ─────────────────────────── */}
      <div className="mt-4 md:mt-4 flex flex-col items-start gap-6">
        {/* Icon & Title Block */}
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border/60 flex items-center justify-center text-3xl shadow-sm shrink-0">
            {Icon ? (
              <Icon className="text-foreground w-8 h-8" />
            ) : (
              <Plug className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          <div className="">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {config.name}
              </h1>
            </div>
            <p className="text-[13px] text-muted-foreground font-medium">
              {config.description}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/40 bg-card/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
              <Shield size={14} className="text-foreground/70" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">
                {user ? 'Secure Connection' : 'Sign in to connect'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {user
                  ? 'Data is encrypted and private'
                  : 'Authentication required'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex gap-3">
            {isConnected ? (
              <button
                onClick={() => handleDisconnect(connection.id)}
                disabled={!!isDeleting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />{' '}
                    Disconnecting…
                  </>
                ) : (
                  'Disconnect App'
                )}
              </button>
            ) : (
              <button
                onClick={() => handleConnect(providerSlug)}
                disabled={isConnecting || !user}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Connecting…
                  </>
                ) : (
                  'Connect App'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Features List ───────────────────────────── */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-base font-semibold text-foreground">
            Capabilities
          </h2>
          <span className="text-xs text-muted-foreground/50 font-mono tracking-widest bg-accent/30 px-1.5 rounded-md">
            {totalTools}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {config.features.map((tool, i) => (
            <div
              key={i}
              className="group flex flex-col gap-2 p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-2 text-foreground">
                <Check
                  size={14}
                  className="text-muted-foreground"
                  strokeWidth={2.5}
                />
                <h3 className="text-sm font-semibold">{tool.feature}</h3>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {tool.description}
              </p>

              {/* Inner technical key - shown subtly */}
              <div className="mt-auto pt-3">
                <span className="inline-flex text-[10px] font-mono text-muted-foreground/40 uppercase bg-background border border-border/30 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {tool.key}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
