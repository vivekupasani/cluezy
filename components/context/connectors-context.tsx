"use client"

import { Connection, ConnectorProvider } from "@/lib/connectors/types";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";

interface ConnectorsContextType {
    connections: Connection[];
    loading: boolean;
    syncingProvider: ConnectorProvider | null;
    deletingId: string | null;
    connectingProvider: ConnectorProvider | null;
    fetchConnections: () => Promise<void>;
    handleConnect: (provider: ConnectorProvider) => Promise<void>;
    handleSync: (provider: ConnectorProvider) => Promise<void>;
    handleDisconnect: (connectionId: string) => Promise<void>;
}

const ConnectorsContext = createContext<ConnectorsContextType | undefined>(undefined);

export function ConnectorsProvider({ children }: { children: React.ReactNode }) {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);
    const [connectingProvider, setConnectingProvider] = useState<ConnectorProvider | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [syncingProvider, setSyncingProvider] = useState<ConnectorProvider | null>(null);
    const fetchInProgressRef = useRef(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchConnections();
        } else {
            setConnections([]);
            fetchInProgressRef.current = false;
        }
    }, [user?.id]);

    const fetchConnections = async () => {
        if (fetchInProgressRef.current) return;
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

    return (
        <ConnectorsContext.Provider
            value={{
                connections,
                loading,
                syncingProvider,
                deletingId,
                connectingProvider,
                fetchConnections,
                handleConnect,
                handleSync,
                handleDisconnect
            }}
        >
            {children}
        </ConnectorsContext.Provider>
    );
}

export function useConnectors() {
    const context = useContext(ConnectorsContext);
    if (context === undefined) {
        throw new Error("useConnectors must be used within a ConnectorsProvider");
    }
    return context;
}
