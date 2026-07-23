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

  // 5. Seed Default FAQ Items
  const defaultFaqs = [
    {
      question: 'Apa itu Hitungsaham.com?',
      answer: 'Hitungsaham.com adalah alat bantu kalkulasi yang dirancang khusus untuk trader dan investor di Bursa Efek Indonesia (BEI). Platform ini menyediakan fitur kalkulator instan untuk menghitung batas Auto Rejection Atas (ARA) dan Auto Rejection Bawah (ARB), simulasi average up/down posisi portofolio, serta penentuan titik take profit dan cut loss.',
      order: 1,
    },
    {
      question: 'Bagaimana cara memberikan masukan atau melaporkan kendala (feedback)?',
      answer: 'Kami sangat menghargai masukan dari rekan-rekan trader untuk terus menyempurnakan alat ini. Jika Anda menemukan ketidaksesuaian perhitungan, memiliki ide fitur baru, atau ingin melaporkan bugs, silakan hubungi tim kami melalui email di admin@hitungsaham.com.',
      order: 2,
    },
    {
      question: 'Bagaimana Aturan Fraksi Harga & Papan Perdagangan BEI Terbaru?',
      answer: 'Kalkulator kami selalu diperbarui mengikuti regulasi BEI. Saat ini, pergerakan harga saham dibatasi oleh fraksi harga berdasarkan rentang harga saham (misal: Rp1 untuk harga di bawah Rp200, Rp2 untuk harga Rp200-Rp500, dan seterusnya). Selain itu, batas ARA dan ARB berbeda bergantung pada papan pencatatan:\n• Papan Utama & Pengembangan: ARA hingga maksimal 20% - 35% dan ARB hingga maksimal 15%.\n• Papan Akselerasi: ARA dan ARB simetris di angka 10%.\n• Papan Pemantauan Khusus (FCA/Watchlist): ARA dan ARB dibatasi sebesar 10% untuk perdagangan Full Call Auction.\n• Pada rentang harga Rp 1-10: ARA dan ARB dibatasi simetris 1 papan tick.',
      order: 3,
    },
    {
      question: 'Bagaimana Strategi Aman Melakukan Average Down pada Saham Lapis Ketiga?',
      answer: 'Saham lapis ketiga (small-cap) memiliki tingkat volatilitas yang sangat tinggi. Melakukan average down secara membabi buta saat harga turun (menangkap pisau jatuh) berisiko menggerus modal secara signifikan. Strategi yang lebih aman adalah mengombinasikan simulasi lot di kalkulator ini dengan konfirmasi teknikal. Pastikan Anda hanya menambah porsi (average down) ketika tekanan jual sudah mereda, yang bisa divalidasi ketika indikator teknikal seperti RSI menunjukkan area oversold ekstrem dan mulai ada pola pembalikan arah (reversal).',
      order: 4,
    },
    {
      question: 'Bagaimana Cara Scalping Menggunakan Momentum ARA/ARB?',
      answer: 'Scalping memanfaatkan pergerakan harga yang cepat dalam hitungan menit. Saat sebuah saham bervolume tinggi menunjukkan momentum breakout dan antrean beli ditekan agresif (HAKA / Hajar Kanan), Anda dapat menggunakan kalkulator kami untuk melihat jarak harga saat ini menuju batas ARA. Jika jarak menuju ARA masih lebar dan momentum terus terakselerasi, ada peluang scalping namun tetap perlu manajemen risiko masing-masing trader. Sebaliknya, mengetahui batas pasti ARB membantu Anda mengukur kapan kepanikan pasar mencapai titik maksimalnya.',
      order: 5,
    },
    {
      question: 'Bagaimana Mengatur Risk/Reward Ratio dengan Kalkulator Ini?',
      answer: 'Manajemen risiko adalah kunci bertahan di pasar modal untuk menghindari kerugian modal yang dalam. Sebelum mengeksekusi perdagangan, gunakan fitur Prediksi Jual/Beli. Masukkan harga pembelian dan batas toleransi risiko yang siap diterima trader (misalnya maksimal cut loss 3%). Kalkulator dibuat untuk menjadi batasan Anda harus keluar. Pasangkan angka tersebut dengan target take profit minimal dua atau tiga kali lipat dari risiko (Risk/Reward 1:2 atau 1:3). Dengan angka yang absolut, Anda bisa bertransaksi lebih disiplin tanpa melibatkan emosi.',
      order: 6,
    },
  ];

  const existingFaqs = await prisma.faqItem.findMany();
  if (existingFaqs.length === 0) {
    for (const faq of defaultFaqs) {
      await prisma.faqItem.create({ data: faq });
    }
    console.log('✔ Default FAQ berhasil disimpan.');
  } else {
    console.log('✔ FAQ sudah terisi.');
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
