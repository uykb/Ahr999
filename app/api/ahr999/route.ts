import { NextRequest, NextResponse } from 'next/server';
import { getAHR999Data, getAHR999History } from '@/lib/ahr999';

// Allow caching for history, but force dynamic for current price check
export const dynamic = 'force-dynamic'; 

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'current';

  try {
    if (type === 'history') {
      const data = await getAHR999History();
      
      // Add Cache-Control header for history data
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    } else {
      const data = await getAHR999Data();
      if (!data) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
      }
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-store, max-age=0', // Always fresh for current status
        },
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
