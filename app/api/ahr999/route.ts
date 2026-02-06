import { NextRequest, NextResponse } from 'next/server';
import { getAHR999Data, getAHR999History } from '@/lib/ahr999';

export const dynamic = 'force-dynamic'; // Disable caching for now to get fresh data

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'current';

  try {
    if (type === 'history') {
      const data = await getAHR999History();
      return NextResponse.json(data);
    } else {
      const data = await getAHR999Data();
      if (!data) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
      }
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
