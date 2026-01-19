import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUserId } from '@/lib/auth/get-current-user';
import { listUserConnections } from '@/lib/connectors';

// Cache the response for 60 seconds to reduce API calls
export const revalidate = 60;

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
        console.error('Error listing connections:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to list connections' },
            { status: 500 }
        );
    }
}
