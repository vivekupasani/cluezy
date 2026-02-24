"use client";

import { useAuth } from "@/components/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { PROVIDER_ICONS } from "@/lib/connectors/icons";
import {
    Connection,
    CONNECTOR_CONFIGS,
    ConnectorProvider,
} from "@/lib/connectors/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Loader2, Shield } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useConnectors } from "./context/connectors-context";
import { useSidebar } from "./ui/sidebar";

interface AppsConnectorProps {
    connections: Connection[];
    connectingProvider: ConnectorProvider | null;
    deletingId: string | null;
    syncingProvider: ConnectorProvider | null;
    handleConnect: (provider: ConnectorProvider) => Promise<void>;
    handleSync: (provider: ConnectorProvider) => Promise<void>;
    handleDisconnect: (connectionId: string) => Promise<void>;
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
    } = useConnectors();

    const { open } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <div className={cn("h-svh min-w-0 w-full bg-sidebar mt-0",
            open && !isMobile ? "pt-3.5 border-none transition-all duration-300 ease-in-out" : "mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10"
        )}>
            <div className={cn("h-svh min-w-0 w-full bg-background mt-0",
                open && !isMobile ? "rounded-tl-xl border-t border-l border-sidebar-ring/30 dark:border-sidebar-ring/10 transition-all duration-300 ease-in-out" : "mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10"
            )}>
                <div className="p-4 lg:p-8 h-full overflow-y-auto HiddenScrollbar">
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
    );
}

export function AppsConnector({
    connections,
    connectingProvider,
    deletingId,
    syncingProvider,
    handleConnect,
    handleSync,
    handleDisconnect,
}: AppsConnectorProps) {
    const { slug } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const providerSlug = slug as ConnectorProvider;
    const config = CONNECTOR_CONFIGS[providerSlug];
    const Icon = config ? PROVIDER_ICONS[config.icon] : null;

    if (!config) return null;

    const connection = connections.find((c) => c.provider === providerSlug);
    const isConnected = !!connection;
    const totalTools = config.features.length;

    const isConnecting = connectingProvider === providerSlug;
    const isDeleting = connection && deletingId === connection.id;

    return (
        <div className="min-h-screen bg-background text-foreground mt-2 lg:mt-0">
            <div className="max-w-2xl mx-auto md:px-8 pt-6 mb-20 md:mb-0 md:mt-0">

                {/* Back */}
                <button
                    onClick={() => router.push("/connectors")}
                    className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-[16px] transition-colors duration-200"
                >
                    <ArrowLeft
                        size={16}
                        className="transition-transform duration-200"
                    />
                    Back
                </button>

                {/* ─── App Identity Card ─── */}
                <div className="mt-8 flex items-start justify-between">
                    {/* Left: icon + name */}
                    <div className="flex items-center gap-4">
                        {/* Icon ring */}
                        <div className="w-14 h-14 p-1 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
                            {Icon && <Icon className="text-foreground" />}
                        </div>

                        <div>
                            <h1 className="text-[18px] font-semibold text-foreground tracking-tight">
                                {config.name}
                            </h1>
                            <p className="text-[13px] text-muted-foreground mt-0.5">
                                {totalTools} {totalTools === 1 ? "capability" : "capabilities"}
                            </p>
                        </div>
                    </div>

                    {/* Right: status badge — desktop only */}
                    {isConnected ? (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Connected
                        </span>)
                        :
                        (<span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Not Connected
                        </span>
                        )}
                </div>

                {/* Description */}
                <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed">
                    {config.description}
                </p>

                {/* Security note */}
                <div className="mt-3 flex items-center gap-1.5">
                    <Shield size={12} className="text-muted-foreground/30" />
                    <span className="text-[12px] text-muted-foreground/60">
                        {user ? "Encrypted & secure" : "Sign in to connect"}
                    </span>
                </div>

                {isConnected ? (
                    <button
                        onClick={() => handleDisconnect(connection.id)}
                        disabled={!!isDeleting}
                        className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-[13px] font-medium text-muted-foreground hover:border-primary/20 hover:text-primary hover:bg-primary/5 transition-all duration-150 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={13} className="animate-spin" /> Disconnecting…
                            </>
                        ) : (
                            "Disconnect"
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => handleConnect(providerSlug)}
                        disabled={isConnecting || !user}
                        className="w-full mt-5 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-[13px] font-semibold rounded-xl shadow-sm hover:bg-primary/90 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 size={13} className="animate-spin" /> Connecting…
                            </>
                        ) : (
                            `Connect to ${config.name}`
                        )}
                    </button>
                )}

                {/* ─── Divider ─── */}
                <div className="mt-6 border-t border-border/50" />

                {/* ─── Tools / Features ─── */}
                <div className="mt-5">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                        Features
                    </p>

                    <div className="flex flex-col gap-px bg-border/50 rounded-xl overflow-hidden border border-border/50">
                        {config.features.map((tool, i) => (
                            <div
                                key={i}
                                className="bg-accent/5 dark:bg-card px-4 py-3.5 flex items-start gap-3 transition-colors duration-150"
                            >
                                {/* Checkmark dot */}
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    <Check size={10} className="text-muted-foreground" strokeWidth={2.5} />
                                </div>

                                <div>
                                    <p className="text-[13px] font-medium text-foreground">
                                        {tool.feature}
                                    </p>
                                    <p className="text-[12px] text-muted-foreground mt-0.5">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Mobile Sticky Action Bar ─── */}
            {
                isConnected && (
                    <div className="visible sm:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border px-5 py-4 shadow-lg">

                        <div className="flex items-center justify-center gap-1.5 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[12px] font-medium text-emerald-500">Connected</span>
                        </div>
                    </div>
                )
            }

        </div>
    );
}