import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

const apiKey = process.env.COMPOSIO_API_KEY;

if (!apiKey && process.env.NODE_ENV === 'development') {
    console.warn("⚠️ COMPOSIO_API_KEY is missing. Please add it to your .env.local file.");
}

// Create Composio client with Vercel provider
export const composio = new Composio({
    apiKey: apiKey || '',
    provider: new VercelProvider(),
});
