'use client';

import {
    Loader2,
    RefreshCw,
    Search
} from 'lucide-react';
import { SVGProps, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/context/auth-context';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CONNECTOR_CONFIGS, ConnectorProvider } from '@/lib/connectors';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui';

// --- Icons ---

const GoogleDrive = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78" width="1em" height="1em" {...props}>
        <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z" />
        <path fill="#00ac47" d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z" />
        <path fill="#ea4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5c.8-1.4 1.2-2.95 1.2-4.5H59.798l5.852 11.5z" />
        <path fill="#00832d" d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" />
        <path fill="#2684fc" d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" />
        <path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z" />
    </svg>
);

const Notion = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid" viewBox="0 0 256 268" {...props}>
        <path fill="#FFF" d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z" />
        <path d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z" />
    </svg>
);

const OneDrive = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid" {...props}>
        <path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" />
        <path fill="#80CC28" d="M256 121.666H134.335V0H256z" />
        <path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" />
        <path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" />
    </svg>
);

const Gmail = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
);

const Outlook = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="1em" height="1em" {...props}>
        <rect x="1" y="6" width="20" height="20" rx="2" fill="#0078D4" />
        <path d="M21 6H3a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM3 8h18l-9 7-9-7zm0 18V10l9 7 9-7v16H3z" fill="#fff" opacity=".2" />
        <path d="M22 6h8v20h-8z" fill="#0078D4" />
        <path d="M29.5 6.5h-7a.5.5 0 0 0-.5.5v18a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5z" fill="#fff" />
        <text x="25.5" y="22" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#0078D4" textAnchor="middle">O</text>
        <path d="M11 15L1 8v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-10 7z" fill="#106EBE" />
        <path d="M11 15L21 8H1l10 7z" fill="#5AA4F4" />
    </svg>
);

const Dropbox = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <path fill="#0061FF" d="M6 1.807L0 5.457l6 3.65 6-3.65-6-3.65zM18 1.807l-6 3.65 6 3.65 6-3.65-6-3.65zM0 12.757l6 3.65 6-3.65-6-3.65-6 3.65zM18 12.757l-6 3.65 6-3.65-6-3.65-6 3.65zM6 20.057l6 3.65 6-3.65-6-3.65-6 3.65z" />
    </svg>
);

const Canva = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <circle cx="12" cy="12" r="12" fill="#00C4CC" />
        <path fill="#fff" d="M12.5 7c-3 0-5 2.5-5 5s2 5 5 5c1 0 2-.5 2.5-1-.5 0-1 .5-1 .5-2 0-3.5-1.5-3.5-4.5s1.5-4.5 3.5-4.5c.5 0 1 .2 1 .5.5-.5 1-1 2.5-1z" />
    </svg>
);

const Linear = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <circle cx="12" cy="12" r="12" fill="#5E6AD2" />
        <path fill="#fff" d="M16 7c-1 0-2 1-2 2v6c0 1 1 2 2 2 1 0 2-1 2-2V9c0-1-1-2-2-2zM8 7C7 7 6 8 6 9v6c0 1 1 2 2 2 1 0 2-1 2-2V9c0-1-1-2-2-2z" />
    </svg>
);

const Slack = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" />
        <path fill="#36C5F0" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
        <path fill="#2EB67D" d="M8.834 5.042a2.528 2.528 0 0 1 2.521-2.521A2.528 2.528 0 0 1 13.877 5.042a2.527 2.527 0 0 1-2.522 2.521h-2.521V5.042z" />
        <path fill="#ECB22E" d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H5.042A2.528 2.528 0 0 1 2.521 8.834a2.528 2.528 0 0 1 2.521-2.521h6.313z" />
        <path fill="#E01E5A" d="M18.958 8.834a2.528 2.528 0 0 1 2.521-2.52A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.521 2.521h-2.521V8.834z" />
        <path fill="#36C5F0" d="M17.688 8.834a2.528 2.528 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.166 0a2.528 2.528 0 0 1 2.522 2.522v6.312z" />
        <path fill="#2EB67D" d="M15.166 18.958a2.527 2.527 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.521-2.521 2.527 2.527 0 0 1 2.521-2.52h2.522v2.52z" />
        <path fill="#ECB22E" d="M15.166 17.688a2.527 2.527 0 0 1-2.522-2.521 2.527 2.527 0 0 1 2.522-2.521h6.312A2.527 2.527 0 0 1 24 15.166a2.528 2.528 0 0 1-2.521 2.522h-6.313z" />
    </svg>
);

const Trello = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" {...props}>
        <path fill="#0079BF" d="M19.344 0H4.656C2.086 0 0 2.086 0 4.656v14.688C0 21.914 2.086 24 4.656 24h14.688C21.914 24 24 21.914 24 19.344V4.656C24 2.086 21.914 0 19.344 0z" />
        <path fill="#FFF" d="M10.828 3.516h-4.5c-.414 0-.75.336-.75.75v8.062c0 .414.336.75.75.75h4.5c.414 0 .75-.336.75-.75V4.266c0-.414-.336-.75-.75-.75zm7.313 0h-4.5c-.414 0-.75.336-.75.75v5.062c0 .414.336.75.75.75h4.5c.414 0 .75-.336.75-.75V4.266c0-.414-.336-.75-.75-.75z" />
    </svg>
);

const PROVDIER_ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
    'google-drive': GoogleDrive,
    notion: Notion,
    onedrive: OneDrive,
};

// --- Types ---

interface Connection {
    id: string;
    provider: ConnectorProvider;
    email: string;
    createdAt: string;
    documentCount?: number;
}

interface DummyConnector {
    id: string;
    name: string;
    description: string;
    icon: any;
    enabled: boolean;
}

const DUMMY_CONNECTORS: DummyConnector[] = [
    {
        id: 'gmail',
        name: 'Gmail with Calendar',
        description: 'Search, create, and manage your emails and calendar events',
        icon: Gmail,
        enabled: false,
    },
    {
        id: 'outlook',
        name: 'Outlook',
        description: 'Search your emails and calendar events',
        icon: Outlook,
        enabled: false,
    },
    {
        id: 'dropbox',
        name: 'Dropbox',
        description: 'Get in-depth answers from your Dropbox content',
        icon: Dropbox,
        enabled: false,
    },
    {
        id: 'canva',
        name: 'Canva',
        description: 'Search, create, and edit designs',
        icon: Canva,
        enabled: false,
    },
    {
        id: 'linear',
        name: 'Linear',
        description: 'Plan and track projects, issues, and team workflows',
        icon: Linear,
        enabled: false,
    },
    {
        id: 'slack',
        name: 'Slack',
        description: 'Search and post messages across your Slack workspace',
        icon: Slack,
        enabled: false,
    },
];

export default function ConnectorsPageContent() {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [connectingProvider, setConnectingProvider] = useState<ConnectorProvider | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [syncingProvider, setSyncingProvider] = useState<ConnectorProvider | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<ConnectorProvider | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { user } = useAuth();
    const fetchInProgressRef = useRef(false);

    const activeProviders: ConnectorProvider[] = ['google-drive', 'notion', 'onedrive'];

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        // Prevent redundant fetches
        if (fetchInProgressRef.current) {
            console.log('Fetch already in progress, skipping...');
            return;
        }

        try {
            fetchInProgressRef.current = true;
            setLoading(true);
            const response = await fetch('/api/connectors/list');
            const data = await response.json();
            setConnections(data);
        } catch (error) {
            console.error('Error fetching connections:', error);
            toast.error('Failed to load connections');
        } finally {
            setLoading(false);
            fetchInProgressRef.current = false;
        }
    };

    const handleConnect = async (provider: ConnectorProvider) => {
        try {
            setConnectingProvider(provider);
            const response = await fetch('/api/connectors/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create connection');
            }

            window.location.href = data.authLink;
        } catch (error: any) {
            console.error('Error connecting:', error);
            toast.error(error.message || 'Failed to connect');
            setConnectingProvider(null);
        }
    };

    const openConnectDialog = (provider: ConnectorProvider) => {
        setSelectedProvider(provider);
        setDialogOpen(true);
    };

    const handleSync = async (provider: ConnectorProvider) => {
        try {
            setSyncingProvider(provider);
            const response = await fetch('/api/connectors/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to sync');
            }

            toast.success('Sync started successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to sync');
        } finally {
            setSyncingProvider(null);
        }
    };

    const handleDisconnect = async (connectionId: string) => {
        try {
            setDeletingId(connectionId);
            const response = await fetch('/api/connectors/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ connectionId }),
            });

            if (!response.ok) {
                throw new Error('Failed to disconnect');
            }

            toast.success('Disconnected successfully');
            setConnections((prev) => prev.filter((c) => c.id !== connectionId));
        } catch (error: any) {
            toast.error(error.message || 'Failed to disconnect');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredActive = activeProviders.filter(provider => {
        const config = CONNECTOR_CONFIGS[provider];
        return config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            config.description.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const filteredDummy = DUMMY_CONNECTORS.filter(connector =>
        connector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connector.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const connectedProviders = new Set(connections.map(c => c.provider));

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <header className="text-center space-y-3">
                <h1 className="text-4xl font-bold tracking-tight">
                    Connectors
                </h1>

                <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                    Connect your tools to search across them and take action.
                    <span className="block text-muted-foreground/80 mt-1.5 text-sm">
                        Powered by <Link href="https://supermemory.ai" target="_blank" className="font-medium hover:text-primary transition-colors underline-offset-4 hover:underline">Supermemory</Link>
                    </span>
                </p>
            </header>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search connectors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card border-0 h-11 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>

            {loading ? (
                <>
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-5 w-32 mb-4" />
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="flex flex-col p-4 rounded-xl bg-card/40 border gap-3">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-8 w-full rounded-lg" />
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
                            <h3 className="text-sm font-semibold text-foreground pl-1">Installed Connectors</h3>
                            <div className="flex flex-col gap-3">
                                {connections.map((connection) => {
                                    const config = CONNECTOR_CONFIGS[connection.provider];
                                    const Icon = PROVDIER_ICONS[config.icon];

                                    return (
                                        <motion.div
                                            layoutId={connection.id}
                                            key={connection.id} className="group relative flex flex-col p-4 rounded-xl bg-card/60 border hover:bg-card/80 hover:border-primary/20 transition-all duration-200 gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="text-2xl p-2.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg shrink-0 group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
                                                    <Icon />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm truncate">{config.name}</h4>
                                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{connection.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Connected
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-muted-foreground hover:text-primary shrink-0"
                                                                onClick={() => handleSync(connection.provider)}
                                                                disabled={syncingProvider === connection.provider}
                                                            >
                                                                <span className="sr-only">Sync</span>
                                                                <RefreshCw className={`h-3.5 w-3.5 ${syncingProvider === connection.provider ? 'animate-spin' : ''}`} />
                                                            </Button>
                                                            <TooltipContent>
                                                                Sync
                                                            </TooltipContent>
                                                        </TooltipTrigger>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                                                                onClick={() => handleDisconnect(connection.id)}
                                                            >
                                                                <span className="sr-only">Disconnect</span>
                                                                {deletingId === connection.id ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                ) : (
                                                                    <span aria-hidden="true" className="text-sm">✕</span>
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Disconnect
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Available Connectors */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground pl-1">Available Connectors</h3>
                        <div className="flex flex-col gap-3">
                            {/* Active connectors that are NOT connected */}
                            {filteredActive.map((provider) => {
                                if (connectedProviders.has(provider)) return null;

                                const config = CONNECTOR_CONFIGS[provider];
                                const Icon = PROVDIER_ICONS[config.icon];
                                const isConnecting = connectingProvider === provider;

                                return (
                                    <div key={provider} className="group relative flex flex-col p-4 rounded-xl bg-card/40 border hover:bg-card/60 transition-all duration-200 gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl p-2.5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg shrink-0 group-hover:from-muted/60 group-hover:to-muted/40 transition-colors">
                                                <Icon />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm truncate">{config.name}</h4>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{config.description}</p>
                                            </div>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="w-full">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="w-full"
                                                        disabled={isConnecting || !user}
                                                        onClick={() => openConnectDialog(provider)}
                                                    >
                                                        Enable
                                                    </Button>
                                                </div>
                                            </TooltipTrigger>
                                            {!user && (
                                                <TooltipContent>
                                                    Please login to enable connectors
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </div>
                                );
                            })}

                            {/* Dummy connectors */}
                            {filteredDummy.map((connector) => (
                                <div key={connector.id} className="group relative flex flex-col p-4 rounded-xl bg-card/30 border border-dashed hover:bg-card/40 transition-all duration-200 gap-3 opacity-60">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl p-2.5 bg-gradient-to-br from-muted/30 to-muted/20 rounded-lg shrink-0">
                                            <connector.icon className="h-[1em] w-[1em]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-foreground/70 truncate">{connector.name}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{connector.description}</p>
                                        </div>
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-full">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-full opacity-50"
                                                    disabled
                                                >
                                                    Coming Soon
                                                </Button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Coming soon
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {/* Connector Details Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-[95%] sm:max-w-[600px] rounded-xl bg-background/95">
                    {selectedProvider && (
                        <>
                            <DialogHeader>
                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                                    <div className="text-4xl p-3 bg-secondary/50 rounded-xl">
                                        {(() => {
                                            const config = CONNECTOR_CONFIGS[selectedProvider];
                                            const Icon = PROVDIER_ICONS[config.icon];
                                            return <Icon />;
                                        })()}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl">
                                            {CONNECTOR_CONFIGS[selectedProvider].name}
                                        </DialogTitle>
                                        <DialogDescription className="text-base mt-1">
                                            {CONNECTOR_CONFIGS[selectedProvider].description}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                <div>
                                    <h4 className="font-medium mb-2">Overview</h4>
                                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                                        <li>Search your {CONNECTOR_CONFIGS[selectedProvider].name} content directly</li>
                                        <li>Sync up to {CONNECTOR_CONFIGS[selectedProvider].documentLimit} documents automatically</li>
                                        <li>Secure, read-only access to your files</li>
                                        <li>Data is retrieved only when you query specifically</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 gap-2">
                                <Button
                                    onClick={() => setDialogOpen(false)}
                                    disabled={connectingProvider === selectedProvider}
                                    variant="secondary"
                                    className="min-w-[140px] flex items-center justify-center"
                                >
                                    Cancel
                                </Button>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="min-w-[140px]">
                                            <Button
                                                onClick={() => handleConnect(selectedProvider)}
                                                disabled={connectingProvider === selectedProvider || !user}
                                                variant="default"
                                                className="w-full flex items-center justify-center"
                                            >
                                                {connectingProvider === selectedProvider ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Connecting...
                                                    </>
                                                ) : (
                                                    'Connect'
                                                )}
                                            </Button>
                                        </div>
                                    </TooltipTrigger>
                                    {!user && (
                                        <TooltipContent>
                                            Please login to connect
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}