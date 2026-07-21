import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET() {
  try {
    let terms = 'Website ini hanya merupakan alat bantu kalkulasi saham semata berdasarkan parameter input pengguna dan aturan fraksi BEI secara matematis, serta bukan merupakan rekomendasi, saran, atau tolak ukur baku untuk transaksi jual beli saham. Keputusan investasi sepenuhnya ada di tangan pengguna.';
    let tax = '0.0';

    try {
      const settingTerms = await prisma.systemSetting.findUnique({
        where: { key: 'terms' },
      });
      if (settingTerms) {
        terms = settingTerms.value;
      }

      const settingTax = await prisma.systemSetting.findUnique({
        where: { key: 'tax' },
      });
      if (settingTax) {
        tax = settingTax.value;
      }
    } catch {
      // Fallback to default
    }

    return NextResponse.json({ terms, tax });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil pengaturan: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { terms, tax } = await request.json();

    try {
      if (terms !== undefined && terms !== null) {
        await prisma.systemSetting.upsert({
          where: { key: 'terms' },
          update: { value: terms },
          create: { key: 'terms', value: terms },
        });
      }

      if (tax !== undefined && tax !== null) {
        await prisma.systemSetting.upsert({
          where: { key: 'tax' },
          update: { value: String(tax) },
          create: { key: 'tax', value: String(tax) },
        });
      }
    } catch (dbErr) {
      console.error('Database write error:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menyimpan pengaturan: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
