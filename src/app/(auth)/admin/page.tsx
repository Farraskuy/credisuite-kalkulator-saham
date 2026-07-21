'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Download,
  Share2,
  ArrowUpRight,
  Activity,
  TrendingUp,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { formatNumber } from '@/lib/calculations';

interface AnalyticsData {
  summary: {
    totalTraffic: number;
    totalDownloads: number;
    totalShares: number;
  };
  calculatorStats: Record<string, { download: number; share: number }>;
  referrers: Array<{ name: string; value: number }>;
  recentActions: Array<{
    id: string;
    calculatorType: string;
    action: string;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/dashboard');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* TOP HEADER CONTROLS (from Gambar 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center bg-card border border-border-custom p-1 rounded-2xl w-fit shadow-sm">
          <button className="bg-acc-blue text-white px-5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer">
            Total User
          </button>
          <button className="text-muted hover:text-main px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
            Daily Activity User
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="flex items-center gap-2 bg-acc-blue text-white hover:bg-acc-blue/90 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refetch Data</span>
          </button>
          <div className="flex items-center gap-1.5 bg-card border border-border-custom px-3 py-2 rounded-xl text-xs text-muted shadow-sm">
            <Clock size={14} className="text-acc-blue" />
            <span>
              Last Fetched At <strong className="text-main">{new Date().toLocaleTimeString('id-ID')} (just now)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Header Title */}
      <div>
        <div className="text-[10px] font-bold text-acc-blue uppercase tracking-widest">Analytics Overview</div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-main mt-0.5">Pemantauan Trafik & Aktivitas Pengguna</h2>
      </div>

      {/* STATS CARD GRID (Matching Gambar 1 & Gambar 3 100%) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: USERS (TRAFFIC) */}
        <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm space-y-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sub-blue text-acc-blue flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="font-extrabold text-sm text-main">Users</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-sub-blue text-acc-blue flex items-center justify-center">
              <ArrowUpRight size={14} />
            </div>
          </div>

          <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-sm shadow-blue-600/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-85 block">Total Users</span>
              <span className="text-3xl font-extrabold mt-1 block">{formatNumber(analytics?.summary.totalTraffic || 0)}</span>
            </div>
            <User size={28} className="opacity-90" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-sub-slate/60 p-3 rounded-2xl border border-border-custom/30">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted block">Active Now</span>
              <span className="text-base font-extrabold text-main mt-0.5 block">1</span>
            </div>
            <div className="bg-sub-slate/60 p-3 rounded-2xl border border-border-custom/30">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted block">Daily Active</span>
              <span className="text-base font-extrabold text-main mt-0.5 block">1</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-bold text-muted pt-1">
            <span className="flex items-center gap-1 text-acc-blue"><Activity size={12} /> Realtime</span>
            <span>•</span>
            <span className="flex items-center gap-1"><TrendingUp size={12} /> Avg / day</span>
          </div>
        </div>

        {/* CARD 2: DOWNLOADS */}
        <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm space-y-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Download size={16} />
              </div>
              <span className="font-extrabold text-sm text-main">Unduh PNG</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <ArrowUpRight size={14} />
            </div>
          </div>

          <div className="bg-purple-600 text-white rounded-2xl p-5 shadow-sm shadow-purple-600/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-85 block">Total Unduh PNG</span>
              <span className="text-3xl font-extrabold mt-1 block">{formatNumber(analytics?.summary.totalDownloads || 0)}</span>
            </div>
            <Download size={28} className="opacity-90" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-sub-slate/60 p-3 rounded-2xl border border-border-custom/30">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted block">Aksi Unduh</span>
              <span className="text-base font-extrabold text-main mt-0.5 block">{analytics?.summary.totalDownloads || 0}</span>
            </div>
            <div className="bg-sub-slate/60 p-3 rounded-2xl border border-border-custom/30">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted block">Kalkulator Aktif</span>
              <span className="text-base font-extrabold text-main mt-0.5 block">3</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-muted pt-1">
            <Activity size={12} className="text-purple-600" />
            <span>Performa Ekspor PNG Pengguna</span>
          </div>
        </div>

        {/* CARD 3: SHARES */}
        <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm space-y-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Share2 size={16} />
              </div>
              <span className="font-extrabold text-sm text-main">Bagikan PNG</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight size={14} />
            </div>
          </div>

          <div className="bg-emerald-600 text-white rounded-2xl p-5 shadow-sm shadow-emerald-600/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-85 block">Total Bagikan PNG</span>
              <span className="text-3xl font-extrabold mt-1 block">{formatNumber(analytics?.summary.totalShares || 0)}</span>
            </div>
            <Share2 size={28} className="opacity-90" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-sub-slate/60 p-3 rounded-2xl border border-border-custom/30">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted block">Aksi Bagikan</span>
              <span className="text-base font-extrabold text-main mt-0.5 block">{analytics?.summary.totalShares || 0}</span>
            </div>
            <div className="bg-sub-slate/60 p-3 rounded-2xl border border-border-custom/30">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted block">Status Revenue</span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">Rp 0</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-muted pt-1">
            <Activity size={12} className="text-emerald-600" />
            <span>Interaksi Sosial & Share Link</span>
          </div>
        </div>
      </div>

      {/* TRAFFIC & ACTION DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm">
          <h3 className="font-extrabold text-sm tracking-tight border-b border-border-custom pb-4 mb-4 text-main">
            Sumber Trafik Masuk (Referrer)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border-custom text-muted font-bold">
                  <th className="py-2.5">Sumber / Rujukan</th>
                  <th className="py-2.5 text-right">Jumlah Kunjungan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/50">
                {analytics?.referrers.map((ref, idx) => (
                  <tr key={idx} className="hover:bg-sub-slate/30 text-main">
                    <td className="py-3 font-semibold">{ref.name}</td>
                    <td className="py-3 text-right font-bold">{formatNumber(ref.value)}</td>
                  </tr>
                ))}
                {(!analytics?.referrers || analytics.referrers.length === 0) && (
                  <tr>
                    <td colSpan={2} className="py-6 text-center text-muted font-semibold">
                      Belum ada data kunjungan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm">
          <h3 className="font-extrabold text-sm tracking-tight border-b border-border-custom pb-4 mb-4 text-main">
            Aktivitas per Kalkulator
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border-custom text-muted font-bold">
                  <th className="py-2.5">Jenis Kalkulator</th>
                  <th className="py-2.5 text-center">Unduh PNG</th>
                  <th className="py-2.5 text-center">Bagikan PNG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/50 text-main">
                <tr className="hover:bg-sub-slate/30">
                  <td className="py-3 font-semibold">ARA / ARB Limit</td>
                  <td className="py-3 text-center font-bold text-acc-green">
                    {analytics?.calculatorStats['ara-arb']?.download || 0}
                  </td>
                  <td className="py-3 text-center font-bold text-acc-blue">
                    {analytics?.calculatorStats['ara-arb']?.share || 0}
                  </td>
                </tr>
                <tr className="hover:bg-sub-slate/30">
                  <td className="py-3 font-semibold">Average Up/Down</td>
                  <td className="py-3 text-center font-bold text-acc-green">
                    {analytics?.calculatorStats['average']?.download || 0}
                  </td>
                  <td className="py-3 text-center font-bold text-acc-blue">
                    {analytics?.calculatorStats['average']?.share || 0}
                  </td>
                </tr>
                <tr className="hover:bg-sub-slate/30">
                  <td className="py-3 font-semibold">Prediksi Jual/Beli</td>
                  <td className="py-3 text-center font-bold text-acc-green">
                    {analytics?.calculatorStats['prediction']?.download || 0}
                  </td>
                  <td className="py-3 text-center font-bold text-acc-blue">
                    {analytics?.calculatorStats['prediction']?.share || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Aktivitas Terbaru */}
      <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm">
        <h3 className="font-extrabold text-sm tracking-tight border-b border-border-custom pb-4 mb-4 text-main">
          Log Aktivitas Pengguna Terbaru (Download / Share)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border-custom text-muted font-bold">
                <th className="py-2.5">Waktu</th>
                <th className="py-2.5">Kalkulator</th>
                <th className="py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/50 text-main">
              {analytics?.recentActions.map((log) => (
                <tr key={log.id} className="hover:bg-sub-slate/30">
                  <td className="py-3 text-muted">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 font-semibold">
                    {log.calculatorType === 'ara-arb'
                      ? 'ARA / ARB Limit'
                      : log.calculatorType === 'average'
                      ? 'Average Up/Down'
                      : 'Prediksi Jual/Beli'}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        log.action === 'download'
                          ? 'bg-sub-green border-acc-green/20 text-acc-green'
                          : 'bg-sub-blue border-acc-blue/20 text-acc-blue'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                </tr>
              ))}
              {(!analytics?.recentActions || analytics.recentActions.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-muted font-semibold">
                    Belum ada log aktivitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
