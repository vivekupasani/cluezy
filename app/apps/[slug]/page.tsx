"use client"

import { AppsConnector } from "@/components/apps-connector";
import { useConnectors } from "@/components/context/connectors-context";

export default function AppSlugPage() {
    const {
        connections,
        connectingProvider,
        deletingId,
        syncingProvider,
        handleConnect,
        handleSync,
        handleDisconnect
    } = useConnectors();

    return (
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
    );
}