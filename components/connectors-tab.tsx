'use client';

import { SVGProps, useEffect, useState } from 'react';

import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { CONNECTOR_CONFIGS, ConnectorProvider } from '@/lib/connectors';

// SVG Icon Components
const GoogleDrive = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78" width="1em" height="1em" {...props}>
        <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z" />
        <path fill="#00ac47" d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z" />
        <path
            fill="#ea4335"
            d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5c.8-1.4 1.2-2.95 1.2-4.5H59.798l5.852 11.5z"
        />
        <path fill="#00832d" d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" />
        <path fill="#2684fc" d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" />
        <path
            fill="#ffba00"
            d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z"
        />
    </svg>
);

const Notion = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 268"
        {...props}
    >
        <path
            fill="#FFF"
            d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z"
        />
        <path d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z" />
    </svg>
);

const OneDrive = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid"
        {...props}
    >
        <path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" />
        <path fill="#80CC28" d="M256 121.666H134.335V0H256z" />
        <path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" />
        <path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" />
    </svg>
);



const CONNECTOR_ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
    'google-drive': GoogleDrive,
    notion: Notion,
    onedrive: OneDrive,
};

interface Connection {
    id: string;
    provider: ConnectorProvider;
    email: string;
    createdAt: string;
    documentCount?: number;
}

interface SyncStatus {
    isConnected: boolean;
    documentCount: number;
    lastSync: string;
    email: string;
    status: string;
}

export default function ConnectorsTab() {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [syncStatuses, setSyncStatuses] = useState<Record<string, SyncStatus>>({});
    const [loading, setLoading] = useState(true);
    const [connectingProvider, setConnectingProvider] = useState<ConnectorProvider | null>(null);
    const [syncingProvider, setSyncingProvider] = useState<ConnectorProvider | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const providers: ConnectorProvider[] = ['google-drive', 'notion', 'onedrive'];

    // Fetch connections on mount
    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/connectors/list');
            const data = await response.json();
            setConnections(data);

            // Fetch sync status for each connected provider
            for (const provider of providers) {
                fetchSyncStatus(provider);
            }
        } catch (error) {
            console.error('Error fetching connections:', error);
            toast.error('Failed to load connections');
        } finally {
            setLoading(false);
        }
    };

    const fetchSyncStatus = async (provider: ConnectorProvider) => {
        try {
            const response = await fetch(`/api/connectors/status?provider=${provider}`);
            const data = await response.json();
            if (data.isConnected) {
                setSyncStatuses((prev) => ({ ...prev, [provider]: data }));
            }
        } catch (error) {
            console.error(`Error fetching sync status for ${provider}:`, error);
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

            // Redirect to OAuth page
            window.location.href = data.authLink;
        } catch (error: any) {
            console.error('Error connecting:', error);
            toast.error(error.message || 'Failed to connect');
            setConnectingProvider(null);
        }
    };

    const handleSync = async (provider: ConnectorProvider) => {
        try {
            setSyncingProvider(provider);
            const response = await fetch('/api/connectors/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to sync');
            }

            toast.success('Sync initiated successfully');
            // Refresh sync status after a delay
            setTimeout(() => fetchSyncStatus(provider), 2000);
        } catch (error: any) {
            console.error('Error syncing:', error);
            toast.error(error.message || 'Failed to sync');
        } finally {
            setSyncingProvider(null);
        }
    };

    const handleDisconnect = async (connectionId: string, provider: ConnectorProvider) => {
        try {
            setDeletingId(connectionId);
            const response = await fetch('/api/connectors/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ connectionId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to disconnect');
            }

            toast.success('Disconnected successfully');
            // Remove from local state
            setConnections((prev) => prev.filter((c) => c.id !== connectionId));
            setSyncStatuses((prev) => {
                const newStatuses = { ...prev };
                delete newStatuses[provider];
                return newStatuses;
            });
        } catch (error: any) {
            console.error('Error disconnecting:', error);
            toast.error(error.message || 'Failed to disconnect');
        } finally {
            setDeletingId(null);
        }
    };

    const getConnectionForProvider = (provider: ConnectorProvider) => {
        return connections.find((c) => c.provider === provider);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold">Connectors</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Connect your cloud storage to search through your documents
                </p>
            </div>

            <div className="grid gap-4">
                {providers.map((provider) => {
                    const config = CONNECTOR_CONFIGS[provider];
                    const connection = getConnectionForProvider(provider);
                    const syncStatus = syncStatuses[provider];
                    const Icon = CONNECTOR_ICONS[config.icon];
                    const isConnected = !!connection;
                    const isConnecting = connectingProvider === provider;
                    const isSyncing = syncingProvider === provider;
                    const isDeleting = deletingId === connection?.id;
                    const isOneDrive = provider === 'onedrive';

                    return (
                        <Card key={provider}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl">
                                            <Icon />
                                        </div>
                                        <div>
                                            <CardTitle>{config.name}</CardTitle>
                                            <CardDescription>{config.description}</CardDescription>
                                        </div>
                                    </div>
                                    {isConnected ? (
                                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full">
                                            Connected
                                        </span>
                                    ) : (
                                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                                            Not Connected
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isConnected && syncStatus ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Account:</span>
                                            <span className="font-medium">{syncStatus.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Documents:</span>
                                            <span className="font-medium">{syncStatus.documentCount}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Last Sync:</span>
                                            <span className="font-medium">
                                                {new Date(syncStatus.lastSync).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSync(provider)}
                                                disabled={isSyncing}
                                                className="flex-1"
                                            >
                                                {isSyncing ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Syncing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                        Sync Now
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDisconnect(connection.id, provider)}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => handleConnect(provider)}
                                        disabled={isConnecting}
                                        className="w-full"
                                    >
                                        {isConnecting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            `Connect ${config.name}`
                                        )}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
