import { NextRequest, NextResponse } from 'next/server';

import { deleteConnection } from '@/lib/connectors';

export async function DELETE(request: NextRequest) {
    try {
        const { connectionId } = await request.json();

        if (!connectionId) {
            return NextResponse.json({ error: 'Connection ID is required' }, { status: 400 });
        }

        // Delete the connection
        const result = await deleteConnection(connectionId);

        if (!result) {
            return NextResponse.json({ error: 'Failed to delete connection' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: result.id });
    } catch (error: any) {
        console.error('Error deleting connection:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete connection' },
            { status: 500 }
        );
    }
}
