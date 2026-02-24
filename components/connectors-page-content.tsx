'use client';

import {
    ArrowLeft,
    ChevronRight,
    RefreshCw,
    Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/components/context/auth-context';
import { useConnectors } from '@/components/context/connectors-context';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { PROVIDER_ICONS } from '@/lib/connectors/icons';
import { CONNECTOR_CONFIGS, ConnectorProvider } from '@/lib/connectors/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { HistoryDialog } from './history-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui';
import { useSidebar } from './ui/sidebar';

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
];

export function ConnectorsClientPage() {
    const { open } = useSidebar();
    const isMobile = useIsMobile()
    return (
        <div className={cn("h-svh min-w-0 w-full bg-sidebar mt-0",
            open && !isMobile ? "pt-3.5 border-none transition-all duration-300 ease-in-out" : "mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10"
        )}>
            <div className={cn("h-svh min-w-0 w-full bg-background mt-0",
                open && !isMobile ? "rounded-tl-xl border-t border-l border-sidebar-ring/30 dark:border-sidebar-ring/10 transition-all duration-300 ease-in-out" : "mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10"
            )}>
                <div className="CustomScrollbar max-w-2xl mx-auto p-4 lg:p-8 h-full overflow-y-auto HiddenScrollbar">
                    <ConnectorsPageContent />
                    <HistoryDialog />
                </div>
            </div>
        </div>
    );
}

export function ConnectorsPageContent() {
    const {
        connections,
        loading,
        connectingProvider,
        syncingProvider,
        handleSync
    } = useConnectors();
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const { theme, systemTheme } = useTheme()
    const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        checkCurrentTheme()
    }, [theme, systemTheme]);

    const checkCurrentTheme = () => {
        if (theme === 'system') {
            setCurrentTheme(systemTheme);
            return;
        }
        setCurrentTheme(theme);
    };

    const openConnectDialog = (provider: ConnectorProvider) => {
        router.push(`/connectors/${provider}`);
    };

    const filteredActive = activeProviders.filter(provider => {
        const config = CONNECTOR_CONFIGS[provider];
        return config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            config.description.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const connectedProviders = new Set(connections.map(c => c.provider));

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 mt-2 lg:mt-0">
            <header className="text-start md:mt-6">
                <button
                    onClick={() => router.push("/")}
                    className="visible md:hidden group flex items-center mb-5 pt-6 gap-1.5 text-muted-foreground hover:text-foreground text-[16px] transition-colors duration-200"
                >
                    <ArrowLeft
                        size={16}
                        className="transition-transform duration-200"
                    />
                    Back
                </button>
                <h1 className="text-2xl font-medium tracking-tight">
                    Connectors
                </h1>

                <p className="text-foreground text-base max-w-2xl mx-auto">
                    Chat with your favorite apps in Cluezy
                </p>
            </header>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search your favorite apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-accent/40 dark:bg-card border-0 h-11 focus:ring-0 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>

            {loading ? (
                <>
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-5 w-32 mb-4" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="flex items-center p-3 rounded-xl bg-card/40 border gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                        <Skeleton className="h-4 w-4 rounded shrink-0 mr-2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Installed Connectors */}
                    {connections.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground pl-1">Installed Apps</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {connections.map((connection) => {
                                    const config = CONNECTOR_CONFIGS[connection.provider];
                                    const Icon = connection.provider ? PROVIDER_ICONS[config?.icon || ''] : null;

                                    return (
                                        <motion.div
                                            layoutId={connection.id}
                                            key={connection.id}
                                            className="group relative flex items-center p-3 rounded-xl bg-accent/40 dark:bg-card border-none hover:bg-accent/60 hover:dark:bg-card/50 transition-all duration-200 gap-4 cursor-pointer"
                                            onClick={() => connection.provider && openConnectDialog(connection.provider)}
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="text-xl p-2.5 bg-background border border-border/30 flex items-center justify-center rounded-full w-12 h-12 shadow-sm">
                                                    {Icon ? <Icon /> : <div className="w-5 h-5 bg-muted rounded-full" />}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm text-foreground">{connection.name || config?.name || connection.slug}</h4>
                                                <p className="text-xs text-muted-foreground truncate">{connection.email}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {syncingProvider === connection.provider ? (
                                                    <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Available Connectors */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground pl-1">Available Apps</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Active connectors that are NOT connected */}
                            {filteredActive.map((provider) => {
                                if (connectedProviders.has(provider)) return null;

                                const config = CONNECTOR_CONFIGS[provider];
                                const Icon = PROVIDER_ICONS[config.icon];
                                const isConnecting = connectingProvider === provider;

                                return (
                                    <div
                                        key={provider}
                                        className="group relative flex items-center p-3 rounded-xl bg-accent/40 dark:bg-card border-none hover:bg-accent/60 hover:dark:bg-card/50 transition-all duration-200 gap-4 cursor-pointer"
                                        onClick={() => {
                                            if (user) {
                                                openConnectDialog(provider)
                                            }
                                            else {
                                                toast.message("Please login to connect your account")
                                            }
                                        }}
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="text-xl p-2.5 bg-background border border-border/30 flex items-center justify-center rounded-full w-12 h-12 shadow-sm">
                                                <Icon />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-foreground">{config.name}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{config.description}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!user ? (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="h-4 w-4 text-muted-foreground/30">
                                                            <ChevronRight className="h-4 w-4" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Please login to enable
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
