'use client';

import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [terms, setTerms] = useState('');
  const [taxSetting, setTaxSetting] = useState<number>(0.0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.terms) setTerms(data.terms);
        if (data.tax) setTaxSetting(parseFloat(data.tax) || 0.0);
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terms, tax: taxSetting }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Pengaturan Syarat, Ketentuan & Pajak berhasil diperbarui!' });
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan.' });
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

      <div className="bg-card rounded-3xl p-6 max-w-3xl">
        <div>
          <h3 className="font-extrabold text-sm tracking-tight  pb-4 mb-3 text-main">
            Pengaturan Sistem & Disclaimer
          </h3>
          <p className="text-xs text-muted mb-6 leading-relaxed">
            Kelola nilai pajak transaksi global dan teks disclaimer yang ditampilkan di website.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {/* Tax Setting Box */}
            <div className="bg-sub-slate p-5 rounded-2xl">
              <h4 className="font-extrabold text-xs text-main tracking-wide mb-2">
                Pengaturan Pajak Transaksi Global
              </h4>
              <p className="text-[11px] text-muted mb-4 leading-relaxed">
                Tarif pajak ini secara latar belakang akan ditambahkan pada simulasi biaya pembelian (buy) dan dikurangkan pada simulasi hasil penjualan (sell) di kalkulator ketiga halaman publik.
              </p>
              <div className="space-y-1 max-w-[200px]">
                <label className="text-[10px] font-bold text-muted block">Tarif Pajak (%)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-card rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-acc-blue"
                  value={taxSetting}
                  onChange={(e) => setTaxSetting(parseFloat(e.target.value) || 0.0)}
                />
              </div>
            </div>

            {/* Terms & Conditions Textarea */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted block">Teks Syarat & Ketentuan (Disclaimer)</label>
              <textarea
                className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-blue text-xs"
                rows={6}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-1.5 bg-acc-blue hover:bg-acc-blue/90 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan Sistem'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
