import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET() {
  try {
    let terms = 'Website ini hanya merupakan alat bantu kalkulasi saham semata berdasarkan parameter input pengguna dan aturan fraksi BEI secara matematis, serta bukan merupakan rekomendasi, saran, atau tolak ukur baku untuk transaksi jual beli saham. Keputusan investasi sepenuhnya ada di tangan pengguna.';

    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: 'terms' },
      });
      if (setting) {
        terms = setting.value;
      }
    } catch {
      // Fallback to default
    }

    return NextResponse.json({ terms });
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
    const { terms } = await request.json();

    if (terms === undefined || terms === null) {
      return NextResponse.json({ error: 'Data Syarat dan Ketentuan harus diisi.' }, { status: 400 });
    }

    try {
      await prisma.systemSetting.upsert({
        where: { key: 'terms' },
        update: { value: terms },
        create: { key: 'terms', value: terms },
      });
    } catch {
      // Ignore DB errors safely
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menyimpan pengaturan: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
