import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { referrer, path } = await request.json();
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Safe execution: if DB is not ready, fail gracefully
    try {
      await prisma.trafficLog.create({
        data: {
          referrer: referrer || 'Direct',
          path: path || '/',
          userAgent,
        },
      });
    } catch {
      // Ignored
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
