import Navbar from '@/components/Navbar';
import AraArbSection from '@/components/AraArbSection';
import AvgUpDownSection from '@/components/AvgUpDownSection';
import PredictionSection from '@/components/PredictionSection';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import DynamicDisclaimer from '@/components/DynamicDisclaimer';
import WebsiteBrand from '@/components/WebsiteBrand';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Kalkulator Saham BEI - Hitung ARA, ARB, Average & Target Untung Rugi',
  description:
    'Kalkulator Saham Bursa Efek Indonesia terlengkap untuk menghitung batas harga ARA/ARB, simulasi average up/down, serta prediksi target jual beli dan stop loss secara akurat.',
  keywords: [
    'kalkulator saham',
    'kalkulator ARA ARB',
    'average up down saham',
    'prediksi profit saham',
    'fraksi harga BEI',
    'saham bursa efek indonesia',
  ],
};

export default async function HomePage() {
  let fractionRules = undefined;
  let tax = 0.0;

  try {
    const rules = await prisma.fractionRule.findMany({
      orderBy: { minPrice: 'asc' },
    });
    if (rules && rules.length > 0) {
      fractionRules = rules;
    }
  } catch (err) {
    console.error('Failed to load fraction rules:', err);
  }

  try {
    const settingTax = await prisma.systemSetting.findUnique({
      where: { key: 'tax' },
    });
    if (settingTax) {
      tax = parseFloat(settingTax.value) || 0.0;
    }
  } catch (err) {
    console.error('Failed to load tax setting:', err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-page text-main transition-colors duration-300">
      <AnalyticsTracker />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full grow space-y-12">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto mt-8 mb-10 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-main">
            Kalkulator Penghitung <span className="text-acc-blue">Saham BEI</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
            Alat bantu analisis untuk menghitung batas auto rejection (ARA/ARB), simulasi pembelian rata-rata (average up/down), serta estimasi target profit dan batas stop loss sesuai ketentuan bursa.
          </p>
        </section>

        {/* SECTION 1: ARA / ARB */}
        <AraArbSection fractionRules={fractionRules} />

        {/* SECTION 2: AVERAGE UP / DOWN */}
        <AvgUpDownSection />

        {/* SECTION 3: PREDIKSI TARGET JUAL / BELI */}
        <PredictionSection fractionRules={fractionRules} tax={tax} />
      </main>

      <footer className="border-t border-border-custom bg-card/50 py-8 text-center mt-auto px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-bold text-main mb-1.5">
            <WebsiteBrand /> • Alat Analisis Saham BEI
          </p>
          <DynamicDisclaimer />
        </div>
      </footer>
    </div>
  );
}
