import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUserId } from '@/lib/auth/get-current-user';
import { ConnectorProvider, manualSync } from '@/lib/connectors';

export async function POST(request: NextRequest) {
    try {
        const { provider } = await request.json();

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

        // Trigger manual sync
        const result = await manualSync(provider, userId);

        if (!result) {
            return NextResponse.json({ error: 'Failed to trigger sync' }, { status: 500 });
        }

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Error triggering sync:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to trigger sync' },
            { status: 500 }
        );
    }
}
