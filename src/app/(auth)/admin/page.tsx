'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogOut, Save, Plus, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { FractionRule, DEFAULT_FRACTION_RULES } from '@/lib/calculations';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [fractions, setFractions] = useState<FractionRule[]>(DEFAULT_FRACTION_RULES);
  const [araUtama, setAraUtama] = useState<number>(25);
  const [arbUtama, setArbUtama] = useState<number>(15);
  const [araAkselerasi, setAraAkselerasi] = useState<number>(10);
  const [arbAkselerasi, setArbAkselerasi] = useState<number>(10);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const resAuth = await fetch('/api/auth/me');
        if (!resAuth.ok) {
          router.push('/login');
          return;
        }
        setAuthenticated(true);

        const resRules = await fetch('/api/rules');
        if (resRules.ok) {
          const data = await resRules.json();
          if (data.fractions && Array.isArray(data.fractions)) {
            setFractions(data.fractions);
          }
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
        }
      } catch {
        // Continue with default rules
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      fractions,
      araArb: {
        Utama: [{ ara: araUtama, arb: arbUtama }],
        Pengembangan: [{ ara: araUtama, arb: arbUtama }],
        Akselerasi: [{ ara: araAkselerasi, arb: arbAkselerasi }],
        Watchlist: [{ ara: araAkselerasi, arb: arbAkselerasi }],
      },
    };

    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Aturan fraksi BEI dan ARA/ARB berhasil disimpan ke Database!' });
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan ke database.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleAddFractionRow = () => {
    setFractions([...fractions, { minPrice: 0, maxPrice: 0, tick: 1 }]);
  };

  const handleRemoveFractionRow = (index: number) => {
    setFractions(fractions.filter((_, i) => i !== index));
  };

  const handleFractionChange = (index: number, field: keyof FractionRule, val: string) => {
    const num = val === 'Infinity' ? Infinity : parseFloat(val) || 0;
    const newFractions = [...fractions];
    newFractions[index] = { ...newFractions[index], [field]: num };
    setFractions(newFractions);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-page)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <RefreshCw size={20} className="animate-spin" /> Memuat Admin Panel...
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Header Bar */}
      <div className="admin-header">
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <ArrowLeft size={16} /> Lihat Website
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
              <ShieldCheck size={22} color="var(--accent-blue)" />
              <span>Admin Panel - Konfigurasi Aturan BEI</span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-secondary" style={{ color: 'var(--accent-pink)' }}>
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        {message && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              background: message.type === 'success' ? 'var(--bg-sub-green)' : 'var(--bg-sub-pink)',
              color: message.type === 'success' ? 'var(--accent-green)' : 'var(--accent-pink)',
              border: `1px solid ${message.type === 'success' ? 'var(--accent-green)' : 'var(--accent-pink)'}`,
            }}
          >
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
          {/* Card 1: Fraksi Harga BEI */}
          <div className="flat-card">
            <div>
              <div className="card-top">
                <div className="card-title-group">
                  <div
                    className="card-title-icon"
                    style={{ background: 'var(--bg-sub-blue)', color: 'var(--accent-blue)' }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <span className="card-title-text">Tabel Fraksi Harga BEI (Tick Size)</span>
                </div>
              </div>

              <div className="table-container">
                <table className="flat-table">
                  <thead>
                    <tr>
                      <th>Harga Min (Rp)</th>
                      <th>Harga Max (Rp)</th>
                      <th>Tick Size (Rp)</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fractions.map((f, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="number"
                            className="form-input"
                            style={{ padding: '0.4rem 0.6rem' }}
                            value={f.minPrice}
                            onChange={(e) => handleFractionChange(idx, 'minPrice', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: '0.4rem 0.6rem' }}
                            value={f.maxPrice === Infinity ? 'Infinity' : f.maxPrice}
                            onChange={(e) => handleFractionChange(idx, 'maxPrice', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-input"
                            style={{ padding: '0.4rem 0.6rem' }}
                            value={f.tick}
                            onChange={(e) => handleFractionChange(idx, 'tick', e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => handleRemoveFractionRow(idx)}
                            className="btn-icon-danger"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleAddFractionRow}
                className="btn-secondary"
                style={{ marginTop: '1rem' }}
              >
                <Plus size={16} /> Tambah Baris Fraksi
              </button>
            </div>
          </div>

          {/* Card 2: Aturan ARA & ARB */}
          <div className="flat-card">
            <div>
              <div className="card-top">
                <div className="card-title-group">
                  <div
                    className="card-title-icon"
                    style={{ background: 'var(--bg-sub-purple)', color: 'var(--accent-purple)' }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <span className="card-title-text">Persentase ARA / ARB Papan</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  style={{
                    background: 'var(--bg-sub-slate)',
                    padding: '1rem',
                    borderRadius: '14px',
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    Papan Utama & Pengembangan
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label">ARA (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={araUtama}
                        onChange={(e) => setAraUtama(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="form-label">ARB (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={arbUtama}
                        onChange={(e) => setArbUtama(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-sub-slate)',
                    padding: '1rem',
                    borderRadius: '14px',
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                    Papan Akselerasi & Watchlist (FTS)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label">ARA (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={araAkselerasi}
                        onChange={(e) => setAraAkselerasi(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="form-label">ARB (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={arbAkselerasi}
                        onChange={(e) => setArbAkselerasi(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ marginTop: '2rem' }}
            >
              <Save size={18} />
              <span>{saving ? 'Menyimpan...' : 'Simpan Semua Aturan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
