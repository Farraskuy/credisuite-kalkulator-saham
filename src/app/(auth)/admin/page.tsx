'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LogOut,
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  RefreshCw,
  BarChart3,
  ListRestart,
  Lock,
  Percent,
  Download,
  Share2,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { FractionRule, DEFAULT_FRACTION_RULES, formatNumber } from '@/lib/calculations';

type Tab = 'analytics' | 'fractions' | 'ara-arb' | 'security';

interface AnalyticsData {
  summary: {
    totalTraffic: number;
    totalDownloads: number;
    totalShares: number;
  };
  referrers: { name: string; value: number }[];
  calculatorStats: Record<string, { download: number; share: number }>;
  recentActions: { id: string; calculatorType: string; action: string; timestamp: string }[];
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('analytics');

  // Rules states
  const [fractions, setFractions] = useState<FractionRule[]>(DEFAULT_FRACTION_RULES);
  const [araUtama, setAraUtama] = useState<number>(25);
  const [arbUtama, setArbUtama] = useState<number>(15);
  const [araAkselerasi, setAraAkselerasi] = useState<number>(10);
  const [arbAkselerasi, setArbAkselerasi] = useState<number>(10);

  // Security states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Analytics states
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // General feedback messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();

  const loadData = async () => {
    try {
      const resAuth = await fetch('/api/auth/me');
      if (!resAuth.ok) {
        router.push('/login');
        return;
      }
      setAuthenticated(true);

      // Fetch rules
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

      // Fetch analytics
      const resAnalytics = await fetch('/api/analytics/dashboard');
      if (resAnalytics.ok) {
        const anaData = await resAnalytics.json();
        setAnalytics(anaData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handleSaveRules = async () => {
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
        setMessage({ type: 'success', text: 'Konfigurasi aturan BEI berhasil disimpan ke database!' });
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan aturan.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Kesalahan koneksi jaringan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Password admin berhasil diperbarui!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengubah password.' });
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
            <Link href="/" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <ArrowLeft size={16} /> Lihat Website
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
              <ShieldCheck size={22} color="var(--accent-blue)" />
              <span>Admin Panel CMS</span>
            </div>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Signed in as Admin
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="admin-wrapper">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-nav">
            <button
              onClick={() => { setActiveTab('analytics'); setMessage(null); }}
              className={`admin-sidebar-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              <BarChart3 size={18} />
              <span>Analitik Trafik</span>
            </button>

            <button
              onClick={() => { setActiveTab('fractions'); setMessage(null); }}
              className={`admin-sidebar-btn ${activeTab === 'fractions' ? 'active' : ''}`}
            >
              <ListRestart size={18} />
              <span>Fraksi Harga BEI</span>
            </button>

            <button
              onClick={() => { setActiveTab('ara-arb'); setMessage(null); }}
              className={`admin-sidebar-btn ${activeTab === 'ara-arb' ? 'active' : ''}`}
            >
              <Percent size={18} />
              <span>Aturan ARA / ARB</span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); setMessage(null); }}
              className={`admin-sidebar-btn ${activeTab === 'security' ? 'active' : ''}`}
            >
              <Lock size={18} />
              <span>Ganti Password</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="admin-sidebar-btn"
            style={{ color: 'var(--accent-pink)', marginTop: '2rem' }}
          >
            <LogOut size={18} />
            <span>Keluar Sesi</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="admin-body">
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

          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div>
              <div className="section-header">
                <div className="section-breadcrumb">Analitik</div>
                <h2 className="section-title">Pemantauan Trafik & Aktivitas Pengguna</h2>
              </div>

              {/* Stat Cards */}
              <div className="analytics-summary-grid">
                <div className="stat-card">
                  <div>
                    <span className="stat-label">Total Kunjungan</span>
                    <div className="stat-val">{formatNumber(analytics?.summary.totalTraffic || 0)}</div>
                  </div>
                  <div className="stat-icon" style={{ background: 'var(--bg-sub-blue)', color: 'var(--accent-blue)' }}>
                    <BarChart3 size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <span className="stat-label">Unduh Gambar PNG</span>
                    <div className="stat-val">{formatNumber(analytics?.summary.totalDownloads || 0)}</div>
                  </div>
                  <div className="stat-icon" style={{ background: 'var(--bg-sub-green)', color: 'var(--accent-green)' }}>
                    <Download size={24} />
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <span className="stat-label">Total Bagikan</span>
                    <div className="stat-val">{formatNumber(analytics?.summary.totalShares || 0)}</div>
                  </div>
                  <div className="stat-icon" style={{ background: 'var(--bg-sub-pink)', color: 'var(--accent-pink)' }}>
                    <Share2 size={24} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Referrers */}
                <div className="flat-card">
                  <div>
                    <div className="card-top">
                      <span className="card-title-text">Sumber Trafik Masuk (Referrer)</span>
                    </div>
                    <div className="table-container">
                      <table className="flat-table">
                        <thead>
                          <tr>
                            <th>Sumber / Rujukan</th>
                            <th>Jumlah Kunjungan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics?.referrers.map((ref, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 600 }}>{ref.name}</td>
                              <td>{formatNumber(ref.value)}</td>
                            </tr>
                          ))}
                          {(!analytics?.referrers || analytics.referrers.length === 0) && (
                            <tr>
                              <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                Belum ada data kunjungan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Calculator action usage stats */}
                <div className="flat-card">
                  <div>
                    <div className="card-top">
                      <span className="card-title-text">Aktivitas per Kalkulator</span>
                    </div>
                    <div className="table-container">
                      <table className="flat-table">
                        <thead>
                          <tr>
                            <th>Jenis Kalkulator</th>
                            <th>Unduh PNG</th>
                            <th>Bagikan PNG</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: 600 }}>ARA / ARB Limit</td>
                            <td className="val-green" style={{ fontWeight: 700 }}>
                              {analytics?.calculatorStats['ara-arb']?.download || 0}
                            </td>
                            <td className="val-blue" style={{ fontWeight: 700 }}>
                              {analytics?.calculatorStats['ara-arb']?.share || 0}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 600 }}>Average Up/Down</td>
                            <td className="val-green" style={{ fontWeight: 700 }}>
                              {analytics?.calculatorStats['average']?.download || 0}
                            </td>
                            <td className="val-blue" style={{ fontWeight: 700 }}>
                              {analytics?.calculatorStats['average']?.share || 0}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 600 }}>Prediksi Jual/Beli</td>
                            <td className="val-green" style={{ fontWeight: 700 }}>
                              {analytics?.calculatorStats['prediction']?.download || 0}
                            </td>
                            <td className="val-blue" style={{ fontWeight: 700 }}>
                              {analytics?.calculatorStats['prediction']?.share || 0}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Actions Log */}
              <div className="flat-card">
                <div>
                  <div className="card-top">
                    <span className="card-title-text">Log Aktivitas Pengguna Terbaru (Download / Share)</span>
                  </div>
                  <div className="table-container">
                    <table className="flat-table">
                      <thead>
                        <tr>
                          <th>Waktu</th>
                          <th>Kalkulator</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics?.recentActions.map((log) => (
                          <tr key={log.id}>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              {new Date(log.timestamp).toLocaleString('id-ID')}
                            </td>
                            <td style={{ fontWeight: 600 }}>
                              {log.calculatorType === 'ara-arb'
                                ? 'ARA / ARB Limit'
                                : log.calculatorType === 'average'
                                ? 'Average Up/Down'
                                : 'Prediksi Jual/Beli'}
                            </td>
                            <td>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '6px',
                                  background: log.action === 'download' ? 'var(--bg-sub-green)' : 'var(--bg-sub-blue)',
                                  color: log.action === 'download' ? 'var(--accent-green)' : 'var(--accent-blue)',
                                }}
                              >
                                {log.action}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {(!analytics?.recentActions || analytics.recentActions.length === 0) && (
                          <tr>
                            <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                              Belum ada log aktivitas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FRACTIONS */}
          {activeTab === 'fractions' && (
            <div className="flat-card">
              <div>
                <div className="card-top">
                  <span className="card-title-text">Tabel Fraksi Harga BEI (Tick Size)</span>
                </div>
                <p className="form-label" style={{ fontWeight: 500, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Kelola tingkatan fraksi harga saham dan kelipatan perubahan harganya (tick size) di Bursa Efek Indonesia.
                </p>

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
                              onChange={(e) => {
                                const newFractions = [...fractions];
                                newFractions[idx].minPrice = parseFloat(e.target.value) || 0;
                                setFractions(newFractions);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '0.4rem 0.6rem' }}
                              value={f.maxPrice === Infinity ? 'Infinity' : f.maxPrice}
                              onChange={(e) => {
                                const newFractions = [...fractions];
                                const val = e.target.value;
                                newFractions[idx].maxPrice = val === 'Infinity' ? Infinity : parseFloat(val) || 0;
                                setFractions(newFractions);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-input"
                              style={{ padding: '0.4rem 0.6rem' }}
                              value={f.tick}
                              onChange={(e) => {
                                const newFractions = [...fractions];
                                newFractions[idx].tick = parseFloat(e.target.value) || 1;
                                setFractions(newFractions);
                              }}
                            />
                          </td>
                          <td>
                            <button
                              onClick={() => setFractions(fractions.filter((_, i) => i !== idx))}
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

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => setFractions([...fractions, { minPrice: 0, maxPrice: 0, tick: 1 }])}
                    className="btn-secondary"
                  >
                    <Plus size={16} /> Tambah Baris Fraksi
                  </button>

                  <button onClick={handleSaveRules} disabled={saving} className="btn-primary" style={{ width: 'auto' }}>
                    <Save size={18} />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARA / ARB */}
          {activeTab === 'ara-arb' && (
            <div className="flat-card">
              <div>
                <div className="card-top">
                  <span className="card-title-text">Persentase Batas Auto Rejection</span>
                </div>
                <p className="form-label" style={{ fontWeight: 500, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Atur persentase Auto Rejection Atas (ARA) dan Auto Rejection Bawah (ARB) untuk masing-masing klasifikasi papan.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px' }}>
                  <div style={{ background: 'var(--bg-sub-slate)', padding: '1.25rem', borderRadius: '14px' }}>
                    <div style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      Papan Utama & Papan Pengembangan
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

                  <div style={{ background: 'var(--bg-sub-slate)', padding: '1.25rem', borderRadius: '14px' }}>
                    <div style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      Papan Akselerasi & Papan Watchlist (FTS)
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

                  <button onClick={handleSaveRules} disabled={saving} className="btn-primary" style={{ marginTop: '1rem' }}>
                    <Save size={18} />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Persentase ARA/ARB'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="flat-card" style={{ maxWidth: '500px' }}>
              <div>
                <div className="card-top">
                  <span className="card-title-text">Perbarui Keamanan Password</span>
                </div>
                <p className="form-label" style={{ fontWeight: 500, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Ganti password keamanan Anda untuk membatasi akses Admin CMS.
                </p>

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Password Lama</label>
                    <input
                      type="password"
                      className="form-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password Baru</label>
                    <input
                      type="password"
                      className="form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimal 6 karakter"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      className="form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: '0.5rem' }}>
                    <Save size={18} />
                    <span>{saving ? 'Memperbarui...' : 'Perbarui Password Admin'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
