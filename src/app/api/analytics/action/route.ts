import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { calculatorType, action } = await request.json();

    try {
      await prisma.actionLog.create({
        data: {
          calculatorType,
          action,
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
