import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUserId } from '@/lib/auth/get-current-user';
import { ConnectorProvider, getSyncStatus } from '@/lib/connectors';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const provider = searchParams.get('provider') as ConnectorProvider;

        if (!provider) {
            return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }

        // Validate provider
        const validProviders: ConnectorProvider[] = ['google-drive', 'notion', 'onedrive'];
        if (!validProviders.includes(provider)) {
            return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
        }

        // Get current user
        const userId = await getCurrentUserId();
        if (!userId || userId === 'anonymous') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get sync status
        const status = await getSyncStatus(provider, userId);

        if (!status) {
            return NextResponse.json({ isConnected: false });
        }

        return NextResponse.json(status);
    } catch (error: any) {
        console.error('Error getting sync status:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get sync status' },
            { status: 500 }
        );
    }
}
