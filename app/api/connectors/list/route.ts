import { getCurrentUserId } from '@/lib/auth/get-current-user';
import { listUserConnections } from '@/lib/connectors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get current user
        const userId = await getCurrentUserId();
        if (!userId || userId === 'anonymous') {
            return NextResponse.json([]);
        }

        // List all connections for the user
        const connections = await listUserConnections(userId);

        return NextResponse.json(connections);
    } catch (error: any) {
        // Suppress pre-render bailout logs from Next.js internal errors
        const isBailout =
            error.digest === 'NEXT_PRERENDER_INTERRUPTED' ||
            error.message?.includes('bail out of prerendering') ||
            error.message?.includes('Dynamic server usage') ||
            error.message?.includes('During prerendering') ||
            error.message?.includes('used cookies');

        if (isBailout) throw error;

        console.error('Error listing connections:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to list connections' },
            { status: 500 }
        );
    }
}
