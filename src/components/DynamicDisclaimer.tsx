'use client';

import { useEffect, useState } from 'react';

const DEFAULT_TERMS = 'Website ini hanya merupakan alat bantu kalkulasi saham semata berdasarkan parameter input pengguna dan aturan fraksi BEI secara matematis, serta bukan merupakan rekomendasi, saran, atau tolak ukur baku untuk transaksi jual beli saham. Keputusan investasi sepenuhnya ada di tangan pengguna.';

export default function DynamicDisclaimer() {
  const [terms, setTerms] = useState(DEFAULT_TERMS);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.terms) {
            setTerms(data.terms);
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchTerms();
  }, []);

  return <p>{terms}</p>;
}
