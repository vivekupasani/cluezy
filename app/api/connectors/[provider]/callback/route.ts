import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ provider: string }> }
) {
    try {
        const { provider } = await params;
        const { searchParams } = new URL(request.url);

        console.log(`📥 OAuth callback received for ${provider}`);
        console.log('Query params:', Object.fromEntries(searchParams.entries()));

        // Supermemory handles the OAuth flow automatically
        // We just need to redirect the user back to the settings page
        // The connection will be established in the background

        // Check if there's an error
        const error = searchParams.get('error');
        if (error) {
            console.error(`❌ OAuth error for ${provider}:`, error);
            return NextResponse.redirect(
                new URL(`/apps?error=${encodeURIComponent(error)}`, request.url)
            );
        }

        // Success - redirect to settings with success message
        console.log(`✅ OAuth callback successful for ${provider}`);
        return NextResponse.redirect(
            new URL(`/apps?success=${provider}`, request.url)
        );
    } catch (error: any) {
        console.error('Error handling OAuth callback:', error);
        return NextResponse.redirect(
            new URL(`/apps?error=${encodeURIComponent(error.message)}`, request.url)
        );
    }
}
