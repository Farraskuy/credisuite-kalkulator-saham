import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySession } from '@/lib/auth';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Password lama dan password baru harus diisi.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password baru minimal harus memiliki 6 karakter.' },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    const oldHash = hashPassword(oldPassword);
    // Allow match if hashed or plain password matches
    if (user.passwordHash !== oldHash && user.passwordHash !== oldPassword) {
      return NextResponse.json({ error: 'Password lama yang Anda masukkan salah.' }, { status: 400 });
    }

    // Update password
    const newHash = hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { email: session.email },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true, message: 'Password berhasil diperbarui!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
