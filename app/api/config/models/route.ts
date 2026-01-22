import { getModels } from '@/lib/config/models';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const models = await getModels()

    return NextResponse.json(
      { models },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60', // Cache for 1 minute
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error: any) {
    // Suppress pre-render bailout logs from Next.js internal errors
    const isBailout =
      error.digest === 'NEXT_PRERENDER_INTERRUPTED' ||
      error.message?.includes('bail out of prerendering') ||
      error.message?.includes('Dynamic server usage') ||
      error.message?.includes('During prerendering');

    if (isBailout) throw error;

    console.error('Failed to fetch models from /api/config/models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}
