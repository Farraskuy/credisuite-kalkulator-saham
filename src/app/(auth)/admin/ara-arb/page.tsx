'use client';

import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminAraArbPage() {
  const [araUtama, setAraUtama] = useState<number>(25);
  const [arbUtama, setArbUtama] = useState<number>(15);
  const [araAkselerasi, setAraAkselerasi] = useState<number>(10);
  const [arbAkselerasi, setArbAkselerasi] = useState<number>(10);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/rules')
      .then((res) => res.json())
      .then((data) => {
        if (data.araArb) {
          if (data.araArb.Utama && data.araArb.Utama[0]) {
            setAraUtama(data.araArb.Utama[0].ara);
            setArbUtama(data.araArb.Utama[0].arb);
          }
          if (data.araArb.Akselerasi && data.araArb.Akselerasi[0]) {
            setAraAkselerasi(data.araArb.Akselerasi[0].ara);
            setArbAkselerasi(data.araArb.Akselerasi[0].arb);
          }
        }
      })
      .catch((err) => console.error('Failed to load ARA/ARB rules:', err));
  }, []);

  const handleSaveRules = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const araArbData = {
        Utama: [{ minPrice: 1, maxPrice: Infinity, ara: araUtama, arb: arbUtama }],
        Akselerasi: [{ minPrice: 1, maxPrice: Infinity, ara: araAkselerasi, arb: arbAkselerasi }],
      };

      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ araArb: araArbData }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Persentase ARA/ARB berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan aturan ARA/ARB.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {message && (
        <div
          className={`p-4 rounded-2xl font-bold text-xs border ${
            message.type === 'success'
              ? 'bg-sub-green border-acc-green text-acc-green'
              : 'bg-sub-pink border-acc-pink text-acc-pink'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-card rounded-3xl p-6">
        <div>
          <h3 className="font-extrabold text-sm tracking-tight  pb-4 mb-3 text-main">
            Persentase Batas Auto Rejection
          </h3>
          <p className="text-xs text-muted mb-6 leading-relaxed">
            Atur persentase Auto Rejection Atas (ARA) dan Auto Rejection Bawah (ARB) untuk masing-masing klasifikasi papan.
          </p>

          <div className="flex flex-col gap-4 max-w-xl">
            <div className="bg-sub-slate p-5 rounded-2xl">
              <h4 className="font-extrabold text-xs text-main tracking-wide mb-3">
                Papan Utama & Papan Pengembangan
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted block">ARA (%)</label>
                  <input
                    type="number"
                    className="w-full bg-card rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-acc-blue"
                    value={araUtama}
                    onChange={(e) => setAraUtama(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted block">ARB (%)</label>
                  <input
                    type="number"
                    className="w-full bg-card rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-acc-blue"
                    value={arbUtama}
                    onChange={(e) => setArbUtama(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-sub-slate p-5 rounded-2xl/50">
              <h4 className="font-extrabold text-xs text-main tracking-wide mb-3">
                Papan Akselerasi & Papan Watchlist (FTS)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted block">ARA (%)</label>
                  <input
                    type="number"
                    className="w-full bg-card rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-acc-blue"
                    value={araAkselerasi}
                    onChange={(e) => setAraAkselerasi(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted block">ARB (%)</label>
                  <input
                    type="number"
                    className="w-full bg-card rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-acc-blue"
                    value={arbAkselerasi}
                    onChange={(e) => setArbAkselerasi(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveRules}
              disabled={saving}
              className="flex items-center justify-center gap-1.5 bg-acc-blue hover:bg-acc-blue/90 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              <Save size={15} />
              <span>{saving ? 'Menyimpan...' : 'Simpan Persentase ARA/ARB'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
