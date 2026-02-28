import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { getSyncStatus } from '@/lib/connectors'
import { ConnectorProvider } from '@/lib/connectors/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider') as ConnectorProvider

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      )
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
      'youtube'
    ]
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    // Get current user
    const userId = await getCurrentUserId()
    if (!userId || userId === 'anonymous') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get sync status
    const status = await getSyncStatus(provider, userId)

    if (!status) {
      return NextResponse.json({ isConnected: false })
    }

    return NextResponse.json(status)
  } catch (error: any) {
    // Suppress pre-render bailout logs from Next.js internal errors
    const isBailout =
      error.digest === 'NEXT_PRERENDER_INTERRUPTED' ||
      error.message?.includes('bail out of prerendering') ||
      error.message?.includes('Dynamic server usage') ||
      error.message?.includes('During prerendering') ||
      error.message?.includes('used request.url')

    if (isBailout) throw error

    console.error('Error getting sync status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get sync status' },
      { status: 500 }
    )
  }
}
