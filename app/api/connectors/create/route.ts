import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUserId } from '@/lib/auth/get-current-user';
import { createConnection } from '@/lib/connectors';
import { ConnectorProvider } from '@/lib/connectors/types';

export async function POST(request: NextRequest) {
    try {
        const { provider } = await request.json();

        if (!provider) {
            return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }

        // Validate provider
        const validProviders: ConnectorProvider[] = [
            'gmail',
            'google-drive',
            'notion',
            'google-calendar',
            'google-sheets',
            'google-docs',
            'linear',
            'supabase',
            'shopify',
            'youtube',
        ];
        if (!validProviders.includes(provider)) {

            return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
        }

        // Get current user
        const userId = await getCurrentUserId();
        if (!userId || userId === 'anonymous') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create connection and get auth link
        const authLink = await createConnection(provider, userId);

        return NextResponse.json({ authLink });
    } catch (error: any) {
        console.error('Error creating connection:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create connection' },
            { status: 500 }
        );
    }
}
