import { tool } from 'ai';
import Supermemory from 'supermemory';
import { z } from 'zod';

import { getCurrentUserId } from '@/lib/auth/get-current-user';
import { listUserConnections } from '@/lib/connectors';

function getClient() {
    return new Supermemory({
        apiKey: process.env.SUPERMEMORY_API_KEY!,
    });
}

export const connectorSearchTool = tool({
    description:
        'Search through user\'s connected cloud storage (Google Drive, Notion, etc.) for relevant documents and information. Use this when the user asks about their personal documents, files, or notes.',
    parameters: z.object({
        query: z.string().describe('The search query to find relevant documents'),
    }),
    execute: async ({ query }) => {
        try {
            console.log(`🔍 Searching connectors for: "${query}"`);

            // Get current user ID
            const userId = await getCurrentUserId();
            if (!userId || userId === 'anonymous') {
                console.log('❌ User not authenticated for connector search');
                return {
                    success: false,
                    message: 'Please sign in to search your connected documents',
                    results: [],
                };
            }

            // Check if user has any connections
            const connections = await listUserConnections(userId);
            if (!connections || connections.length === 0) {
                console.log('❌ No connectors found for user');
                return {
                    success: false,
                    message: 'No cloud storage connected. Please connect Google Drive or Notion in settings.',
                    results: [],
                };
            }

            console.log(`✅ Found ${connections.length} connections for user`);

            // Search across all connected sources using Supermemory
            const client = getClient();

            // Use the search.documents() method with containerTags filter
            const searchResults = await client.search.documents({
                q: query,
                limit: 10,
                containerTags: [userId],
                rerank: true,
            });

            console.log(`📊 Found ${searchResults?.results?.length || 0} results`);

            if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
                return {
                    success: true,
                    message: 'No relevant documents found in your connected storage.',
                    results: [],
                };
            }

            // Format results for the AI
            const formattedResults = searchResults.results.map((result: any) => ({
                title: result.document?.title || result.title || 'Untitled Document',
                content: result.snippet || result.content || result.text || '',
                source: result.document?.sourceType || result.source || 'Connected Storage',
                url: result.document?.url || result.url || '',
                relevance: result.score || result.similarity || 0,
            }));

            return {
                success: true,
                message: `Found ${formattedResults.length} relevant documents from your connected storage.`,
                results: formattedResults,
            };
        } catch (error: any) {
            console.error('❌ Error searching connectors:', error);
            return {
                success: false,
                message: `Error searching connected storage: ${error.message}`,
                results: [],
            };
        }
    },
});
