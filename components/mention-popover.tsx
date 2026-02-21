'use client'

import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { PROVIDER_ICONS } from '@/lib/connectors/icons'
import { CONNECTOR_CONFIGS, ConnectorProvider } from '@/lib/connectors/types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useConnectors } from './context/connectors-context'

interface MentionItem {
    id: ConnectorProvider
    name: string
    description: string
}

interface MentionPopoverProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (item: MentionItem) => void
    anchorRect: DOMRect | null
    searchQuery: string
    onSearchQueryChange: (query: string) => void
}

export function MentionPopover({
    open,
    onOpenChange,
    onSelect,
    anchorRect,
    searchQuery,
    onSearchQueryChange
}: MentionPopoverProps) {
    const router = useRouter()

    if (!anchorRect && open) return null

    const { connections } = useConnectors()

    // Filter to unique providers that are actually connected
    const MENTION_ITEMS: MentionItem[] = Object.values(
        connections.reduce((acc, conn) => {
            if (!acc[conn.provider]) {
                const config = CONNECTOR_CONFIGS[conn.provider]
                acc[conn.provider] = {
                    id: conn.provider,
                    name: config?.name || conn.provider,
                    description: config?.description || ''
                }
            }
            return acc
        }, {} as Record<string, MentionItem>)
    )

    // Filter to apps not yet connected
    const connectedProviderIds = new Set(connections.map(c => c.provider as string))
    const UNCONNECTED_ITEMS: MentionItem[] = Object.entries(CONNECTOR_CONFIGS)
        .filter(([id]) => !connectedProviderIds.has(id))
        .map(([id, config]) => ({
            id: id as ConnectorProvider,
            name: config.name,
            description: config.description
        }))

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            {anchorRect && (
                <div
                    style={{
                        position: 'fixed',
                        left: anchorRect.left,
                        top: anchorRect.top,
                        width: anchorRect.width,
                        height: anchorRect.height,
                        pointerEvents: 'none',
                        visibility: 'hidden'
                    }}
                >
                    <PopoverAnchor />
                </div>
            )}
            <PopoverContent
                className="w-60 p-0 shadow-lg border-border/50 rounded-xl overflow-hidden"
                align="start"
                side="bottom"
                sideOffset={8}
                collisionPadding={10}
            >
                <Command className="bg-background/95 backdrop-blur-sm" shouldFilter={false}>
                    <CommandInput
                        placeholder="Search apps..."
                        value={searchQuery}
                        onValueChange={onSearchQueryChange}
                        className="h-9 text-sm"
                    />
                    <CommandList className="max-h-[200px] overflow-y-auto HiddenScrollbar p-1">
                        {
                            MENTION_ITEMS.length !== 0 && (
                                <CommandGroup heading="Connected Apps" className="text-muted-foreground/70 text-[10px] font-medium py-1">
                                    {MENTION_ITEMS
                                        .filter(item =>
                                            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            item.id.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((item) => {
                                            const config = CONNECTOR_CONFIGS[item.id]
                                            const Icon = config ? PROVIDER_ICONS[config.icon] : null
                                            return (
                                                <CommandItem
                                                    key={item.id}
                                                    value={item.id}
                                                    onSelect={() => onSelect(item)}
                                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer aria-selected:bg-accent/50 group"
                                                >
                                                    <div className="shrink-0 flex items-center justify-center size-5 rounded bg-muted/50 group-aria-selected:bg-background transition-colors">
                                                        {Icon && <Icon className="size-3.5" />}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-medium text-foreground truncate">
                                                            {config?.name || item.name}
                                                        </span>
                                                    </div>
                                                </CommandItem>
                                            )
                                        })}
                                </CommandGroup>
                            )
                        }


                        <CommandGroup heading="Available Apps" className={cn("text-muted-foreground/70 text-[10px] font-medium py-1", MENTION_ITEMS.length !== 0 && "border-t border-border/40 mt-1 pt-1")}>
                            {UNCONNECTED_ITEMS
                                .filter(item =>
                                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    item.id.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((item) => {
                                    const config = CONNECTOR_CONFIGS[item.id]
                                    const Icon = config ? PROVIDER_ICONS[config.icon] : null
                                    return (
                                        <CommandItem
                                            key={item.id}
                                            value={item.id}
                                            onSelect={() => router.push(`/connectors/${item.id}`)}
                                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity aria-selected:bg-accent/30"
                                        >
                                            <div className="shrink-0 flex items-center justify-center size-5 rounded bg-muted/30">
                                                {Icon && <Icon className="size-3.5 grayscale" />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-medium text-foreground/80 truncate">
                                                    {config?.name || item.name}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground/70 truncate leading-none">
                                                    Not connected
                                                </span>
                                            </div>
                                        </CommandItem>
                                    )
                                })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
