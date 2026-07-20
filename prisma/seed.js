const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Memulai seeding database...');

  // 1. Seed Admin User
  const email = 'admin@credisuite.com';
  const passwordHash = hashPassword('credisuite2026');

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
      },
    });
    console.log('✔ Akun Admin default berhasil dibuat.');
  } else {
    console.log('✔ Akun Admin default sudah ada.');
  }

  // 2. Seed Default BEI Fractions
  const defaultFractions = [
    { minPrice: 1, maxPrice: 200, tick: 1 },
    { minPrice: 201, maxPrice: 500, tick: 2 },
    { minPrice: 501, maxPrice: 2000, tick: 5 },
    { minPrice: 2001, maxPrice: 5000, tick: 10 },
    { minPrice: 5001, maxPrice: 99999999, tick: 25 },
  ];

  const existingFractions = await prisma.fractionRule.findMany();
  if (existingFractions.length === 0) {
    for (const f of defaultFractions) {
      await prisma.fractionRule.create({
        data: f,
      });
    }
    console.log('✔ Aturan Fraksi BEI default berhasil disimpan.');
  } else {
    console.log('✔ Aturan Fraksi BEI sudah terisi.');
  }

  // 3. Seed Default ARA/ARB Rules
  const defaultAraArb = [
    { board: 'Utama', ara: 25, arb: 15 },
    { board: 'Pengembangan', ara: 25, arb: 15 },
    { board: 'Akselerasi', ara: 10, arb: 10 },
    { board: 'Watchlist', ara: 10, arb: 10 },
  ];

  const existingAraArb = await prisma.araArbRule.findMany();
  if (existingAraArb.length === 0) {
    for (const r of defaultAraArb) {
      await prisma.araArbRule.create({
        data: r,
      });
    }
    console.log('✔ Persentase ARA/ARB default berhasil disimpan.');
  } else {
    console.log('✔ Persentase ARA/ARB sudah terisi.');
  }

  // 4. Seed Terms and Conditions
  const existingTerms = await prisma.systemSetting.findUnique({
    where: { key: 'terms' },
  });

  if (!existingTerms) {
    await prisma.systemSetting.create({
      data: {
        key: 'terms',
        value: 'Website ini hanya merupakan alat bantu kalkulasi saham semata berdasarkan parameter input pengguna dan aturan fraksi BEI secara matematis, serta bukan merupakan rekomendasi, saran, atau tolak ukur baku untuk transaksi jual beli saham. Keputusan investasi sepenuhnya ada di tangan pengguna.',
      },
    });
    console.log('✔ Syarat dan Ketentuan default berhasil disimpan.');
  } else {
    console.log('✔ Syarat dan Ketentuan sudah terisi.');
  }

  console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
