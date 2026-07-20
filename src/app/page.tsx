import Navbar from '@/components/Navbar';
import AraArbSection from '@/components/AraArbSection';
import AvgUpDownSection from '@/components/AvgUpDownSection';
import PredictionSection from '@/components/PredictionSection';
import AnalyticsTracker from '@/components/AnalyticsTracker';
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AnalyticsTracker />
      <Navbar />

      <main className="app-container">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-subtitle-top">
            <span>#1 KASIR & ALAT BANTU TRADING BEI</span>
          </div>
          <h1 className="hero-title">
            Keputusan Saham Lebih <span>Presisi & Terukur</span>
          </h1>
          <p className="hero-desc">
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

      <footer className="site-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            KalkulatorSaham.id • Alat Analisis Saham BEI
          </p>
          <p>
            Seluruh hasil kalkulasi bersifat simulasi matematis berdasarkan fraksi bursa IDX dan bukan merupakan
            ajakan atau rekomendasi resmi jual beli saham.
          </p>
        </div>
      </footer>
    </div>
  );
}
