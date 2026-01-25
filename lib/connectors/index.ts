import Supermemory from 'supermemory';

function getClient() {
    return new Supermemory({
        apiKey: process.env.SUPERMEMORY_API_KEY!,
    });
}

export type ConnectorProvider = 'google-drive' | 'notion' | 'onedrive';

export interface ConnectorConfig {
    name: string;
    description: string;
    icon: string;
    documentLimit: number;
    syncTag: string;
}

export const CONNECTOR_CONFIGS: Record<ConnectorProvider, ConnectorConfig> = {
    'google-drive': {
        name: 'Google Drive',
        description: 'Search through documents, spreadsheets, and presentations from Google Drive',
        icon: 'google-drive',
        documentLimit: 3000,
        syncTag: 'gdrive-sync',
    },
    notion: {
        name: 'Notion',
        description: 'Search through pages and databases from your Notion workspace',
        icon: 'notion',
        documentLimit: 2000,
        syncTag: 'notion-workspace',
    },
    onedrive: {
        name: 'OneDrive',
        description: 'Search through documents and files from Microsoft OneDrive',
        icon: 'onedrive',
        documentLimit: 3000,
        syncTag: 'onedrive-sync',
    },
};

function getBaseUrl() {
    if (process.env.NODE_ENV === 'development') {
        return process.env.NGROK_URL || 'http://localhost:3000';
    }
    return 'https://beta.cluezy.site';
}

export async function createConnection(provider: ConnectorProvider, userId: string) {
    console.log(`🔗 Creating connection for ${provider}, userId: ${userId}`);


    const client = getClient();
    const config = CONNECTOR_CONFIGS[provider];
    const baseUrl = getBaseUrl();

    console.log(`📡 Using base URL: ${baseUrl}`);
    console.log(`🏷️ Container tags: [${userId}, ${config.syncTag}]`);

    const connection = await client.connections.create(provider, {
        redirectUrl: `${baseUrl}/api/connectors/${provider}/callback`,
        containerTags: [userId, config.syncTag],
        documentLimit: config.documentLimit,
        metadata: {
            source: provider,
            userId,
        },
    });

    console.log(`✅ ${config.name} connection created successfully`);
    console.log(`⏰ Auth expires in:`, connection.expiresIn);
    console.log(`🔗 Auth link:`, connection.authLink);

    return connection.authLink;
}

// Get connection details for a specific provider
export async function getConnection(provider: ConnectorProvider, userId: string) {
    console.log(`🔍 Getting connection for ${provider}, userId: ${userId}`);
    try {
        const client = getClient();
        const config = CONNECTOR_CONFIGS[provider];
        console.log(`🏷️ Searching with container tags: [${userId}, ${config.syncTag}]`);

        const connection = await client.connections.getByTag(provider, {
            containerTags: [userId, config.syncTag],
        });

        if (!connection) {
            console.log(`❌ No connection found for ${provider}`);
            return null;
        }

        console.log(`✅ Found connection for ${provider}:`, {
            id: connection.id,
            email: connection.email,
            createdAt: connection.createdAt,
            expiresAt: connection.expiresAt,
        });
        return connection;
    } catch (error) {
        console.error(`❌ Error getting ${CONNECTOR_CONFIGS[provider].name} connection:`, error);
        return null;
    }
}

// List all connections for a user
export async function listUserConnections(userId: string) {
    try {
        console.log('listing user connections', userId);
        const client = getClient();

        // Efficiently list all connections for the user in a single request
        const connections = await client.connections.list({
            containerTags: [userId],
        });

        const flatConnections = connections || [];

        console.log('connections list', flatConnections);
        if (!flatConnections || flatConnections.length === 0) {
            return [];
        }

        return flatConnections.map((conn) => ({
            ...conn,
            config: CONNECTOR_CONFIGS[conn.provider as ConnectorProvider] || {
                name: conn.provider,
                description: `Connected ${conn.provider} account`,
                icon: '🔗',
                documentLimit: conn.documentLimit,
                syncTag: `${conn.provider}-sync`,
            },
        }));
    } catch (error) {
        console.error('Error listing user connections:', error);
        return [];
    }
}

// Delete connection by ID
export async function deleteConnection(connectionId: string) {
    console.log(`🗑️ Deleting connection with ID: ${connectionId}`);
    try {
        const client = getClient();
        const result = await client.connections.deleteByID(connectionId);
        console.log(`✅ Successfully deleted connection:`, result.id);
        return result;
    } catch (error) {
        console.error(`❌ Error deleting connection ${connectionId}:`, error);
        return null;
    }
}

// Trigger manual sync for a specific provider
export async function manualSync(provider: ConnectorProvider, userId: string) {
    console.log(`🔄 Starting manual sync for ${provider}, userId: ${userId}`);
    try {
        const client = getClient();
        const config = CONNECTOR_CONFIGS[provider];
        console.log(`🏷️ Syncing with container tags: [${userId}, ${config.syncTag}]`);

        const result = await client.connections.import(provider, {
            containerTags: [userId],
        });

        console.log(`✅ Manual sync initiated successfully for ${config.name}`);
        console.log(`📊 Sync result:`, result);
        return result;
    } catch (error) {
        console.error(`❌ Error triggering manual sync for ${CONNECTOR_CONFIGS[provider].name}:`, error);
        return null;
    }
}

// Get sync status for a provider
export async function getSyncStatus(provider: ConnectorProvider, userId: string) {
    console.log(`📊 Getting sync status for ${provider}, userId: ${userId}`);
    try {
        const client = getClient();
        const config = CONNECTOR_CONFIGS[provider];
        console.log(`🏷️ Status check with container tags: [${userId}, ${config.syncTag}]`);

        // Get connection details using the direct API call
        const connection = await client.connections.getByTag(provider, {
            containerTags: [userId, config.syncTag],
        });

        if (!connection) {
            console.log(`❌ No connection found for ${provider} status check`);
            return null;
        }

        console.log('connection', connection);

        console.log(`✅ Connection found for ${provider}, extracting document count from metadata...`);

        let actualDocumentCount = 0;

        // Different providers use different methods for document count
        if (provider === 'google-drive') {
            // Google Drive uses pageToken in metadata to indicate synced documents
            const pageToken = connection.metadata?.pageToken;
            actualDocumentCount = typeof pageToken === 'number' ? pageToken : 0;
            console.log('Google Drive pageToken count:', actualDocumentCount);
        } else {
            // Other providers (Notion, OneDrive) use listDocuments API
            try {
                console.log(`🔍 calling listDocuments for ${provider}`);
                const documentCount = await client.connections.listDocuments(provider, {
                    containerTags: [userId, config.syncTag],
                });

                console.log(`📄 Raw listDocuments response for ${provider}:`, JSON.stringify(documentCount, null, 2));

                // Handle different response formats from listDocuments
                if (Array.isArray(documentCount)) {
                    actualDocumentCount = documentCount.length;
                } else if (typeof documentCount === 'object' && documentCount !== null) {
                    // Try to find any array property or count property
                    const counts = Object.values(documentCount).filter(v => typeof v === 'number');
                    const arrays = Object.values(documentCount).filter(v => Array.isArray(v));

                    if ((documentCount as any).count !== undefined) {
                        actualDocumentCount = (documentCount as any).count;
                    } else if ((documentCount as any).length !== undefined) {
                        actualDocumentCount = (documentCount as any).length;
                    } else if (arrays.length > 0) {
                        actualDocumentCount = arrays[0].length; // Use the first array found
                    } else if (counts.length > 0) {
                        actualDocumentCount = counts[0] as number; // Use the first number found
                    }
                } else if (typeof documentCount === 'number') {
                    actualDocumentCount = documentCount;
                }

                console.log(`🔢 Determined actualDocumentCount for ${provider}: ${actualDocumentCount}`);
            } catch (error) {
                console.error(`Error getting document count for ${provider}:`, error);
                actualDocumentCount = 0;
            }
        }

        const status = {
            isConnected: true,
            documentCount: actualDocumentCount,
            lastSync: connection.createdAt,
            email: connection.email,
            status: 'active',
        };

        console.log(`📈 Sync status for ${provider}:`, status);
        return status;
    } catch (error) {
        console.error(`❌ Error getting sync status for ${CONNECTOR_CONFIGS[provider].name}:`, error);
        return null;
    }
}
