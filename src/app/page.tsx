import Navbar from '@/components/Navbar';
import AraArbSection from '@/components/AraArbSection';
import AvgUpDownSection from '@/components/AvgUpDownSection';
import PredictionSection from '@/components/PredictionSection';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import DynamicDisclaimer from '@/components/DynamicDisclaimer';
import WebsiteBrand from '@/components/WebsiteBrand';
import { Metadata } from 'next';

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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-page text-main transition-colors duration-300">
      <AnalyticsTracker />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow space-y-12">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto mt-8 mb-10 space-y-4 py-32">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-main">
            Keputusan Saham Lebih <span className="text-acc-blue">Presisi & Terukur</span>
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto">
            Tiga kalkulator analisis saham terlengkap dalam satu halaman. Disesuaikan secara otomatis
            dengan aturan fraksi harga (tick size) dan persentase Auto Rejection Bursa Efek Indonesia.
          </p>
        </section>

        {/* SECTION 1: ARA / ARB */}
        <AraArbSection />

        {/* SECTION 2: AVERAGE UP / DOWN */}
        <AvgUpDownSection />

        {/* SECTION 3: PREDIKSI TARGET JUAL / BELI */}
        <PredictionSection />
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
