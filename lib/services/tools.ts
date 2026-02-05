import { composio } from '../composio';

// Function to get tools in Vercel AI SDK format
export async function getVercelTools(userId: string, toolkits: string[]) {
    const mappedTools: any = {};
    let totalToolsFetched = 0;

    for (const toolkit of toolkits) {
        try {
            const tools = await composio.tools.get(userId, {
                toolkits: [toolkit]
            });

            const toolsCount = Object.keys(tools).length;
            totalToolsFetched += toolsCount;

            for (const [key, tool] of Object.entries(tools)) {
                const t = tool as any;
                let parameters = t.inputSchema;

                // Use passthrough() if it's a Zod object to allow extra arguments from the model
                if (parameters && typeof parameters.passthrough === 'function') {
                    parameters = parameters.passthrough();
                }

                mappedTools[key] = {
                    description: t.description,
                    parameters: parameters,
                    execute: async (args: any) => {
                        try {
                            return await t.execute(args);
                        } catch (error: any) {
                            console.error(`Error executing tool ${key}:`, error);

                            // Handle payload too large errors from Composio
                            const errorMessage = error.message || String(error);
                            if (errorMessage.includes('413') || errorMessage.toLowerCase().includes('payload too large') || errorMessage.toLowerCase().includes('too large')) {
                                return {
                                    error: "The response from the tool was too large.",
                                    suggestion: "Please try again with more specific filters (e.g., date range, keywords) or a smaller limit/max_results parameter (e.g., set it to 5 or less)."
                                };
                            }

                            throw error;
                        }
                    }
                };
            }
        } catch (error) {
            console.error(`❌ Error fetching tools for toolkit ${toolkit}:`, error);
        }
    }

    console.log("✅ Finished fetching tools. Total unique tools mapped:", Object.keys(mappedTools).length, "from total fetched:", totalToolsFetched);
    return mappedTools;
}

export async function createSession(userId: string) {
    const session = await composio.create(userId);
    return session;
}

export async function authorizeToolKit(userId: string, toolName: string, redirectUrl?: string) {
    const session = await createSession(userId);
    const connectionRequest = await session.authorize(toolName, { callbackUrl: redirectUrl });
    console.log(`Authorize URL for ${toolName}: ${connectionRequest.redirectUrl}`);
    return connectionRequest;
}

export async function getToolKits(userId: string) {
    const session = await createSession(userId);
    const toolkits = await session.toolkits();

    const connected = await session.toolkits({ isConnected: true });
    return connected;
}

export async function disconnectToolKit(userId: string, toolkitSlug: string) {
    console.log(`Disconnecting toolkit: ${toolkitSlug}`);
    const session = await createSession(userId);
    const toolkits = await session.toolkits({ toolkits: [toolkitSlug] });
    const toolkit = toolkits.items.find((item: any) => item.slug === toolkitSlug);

    if (toolkit && toolkit.connection?.isActive && toolkit.connection?.connectedAccount?.id) {
        const accountId = toolkit.connection.connectedAccount.id;
        console.log(`Found connected account: ${accountId}. Deleting...`);
        await composio.connectedAccounts.delete(accountId);
        console.log(`Successfully disconnected toolkit: ${toolkitSlug}`);
        return true;
    } else {
        console.log(`Toolkit ${toolkitSlug} is not connected or no active account found.`);
        return false;
    }
}
