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
  FileText,
  Menu,
  X,
  User,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import Link from 'next/link';
import { FractionRule, DEFAULT_FRACTION_RULES, formatNumber, formatIDR } from '@/lib/calculations';

type Tab = 'analytics' | 'fractions' | 'ara-arb' | 'security' | 'terms';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Theme support in admin
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
  const [terms, setTerms] = useState('');
  const [taxSetting, setTaxSetting] = useState<number>(0.0);

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

      // Fetch settings
      const resSettings = await fetch('/api/settings');
      if (resSettings.ok) {
        const settingData = await resSettings.json();
        setTerms(settingData.terms);
        setTaxSetting(parseFloat(settingData.tax) || 0.0);
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
    // Get theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, [router]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

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

  const handleSaveTerms = async (e: React.FormEvent) => {
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Pagi Insan Trader...';
    if (hour < 15) return 'Siang Insan Trader...';
    if (hour < 18) return 'Sore Insan Trader...';
    return 'Malam Insan Trader...';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page text-main">
        <div className="flex items-center gap-2.5 font-bold">
          <RefreshCw size={20} className="animate-spin text-acc-blue" />
          <span>Memuat Admin Panel...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  const tabsInfo = [
    { id: 'analytics' as Tab, label: 'Dashboard', icon: BarChart3 },
    { id: 'fractions' as Tab, label: 'Fraksi Harga BEI', icon: ListRestart },
    { id: 'ara-arb' as Tab, label: 'Aturan ARA / ARB', icon: Percent },
    { id: 'terms' as Tab, label: 'Syarat & Ketentuan', icon: FileText },
    { id: 'security' as Tab, label: 'Ganti Password', icon: Lock },
  ];

  const activeTabLabel = tabsInfo.find(t => t.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-page text-main transition-colors duration-300">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border-custom transition-colors duration-300">
        {/* Brand Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border-custom">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold">
            KS
          </div>
          <span className="font-extrabold text-sm tracking-wider uppercase">Kalkulator Saham</span>
        </div>

        {/* Master Menu Label */}
        <div className="px-6 pt-6 pb-2 text-[10px] font-extrabold text-muted tracking-widest uppercase">
          Master Menu
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 space-y-1.5">
          {tabsInfo.map((tabItem) => {
            const Icon = tabItem.icon;
            const isActive = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => {
                  setActiveTab(tabItem.id);
                  setMessage(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10'
                    : 'text-sub hover:bg-sub-slate hover:text-main'
                }`}
              >
                <Icon size={16} />
                <span>{tabItem.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-border-custom">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-acc-pink hover:bg-sub-pink transition-all duration-200 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/50 backdrop-blur-sm">
          <div className="w-64 bg-card h-full flex flex-col border-r border-border-custom animate-slide-in">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border-custom">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold">
                  KS
                </div>
                <span className="font-extrabold text-sm tracking-wider uppercase">Kalkulator Saham</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-main">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pt-6 pb-2 text-[10px] font-extrabold text-muted tracking-widest uppercase">
              Master Menu
            </div>

            <nav className="flex-grow px-4 space-y-1.5">
              {tabsInfo.map((tabItem) => {
                const Icon = tabItem.icon;
                const isActive = activeTab === tabItem.id;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => {
                      setActiveTab(tabItem.id);
                      setMessage(null);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'text-sub hover:bg-sub-slate'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tabItem.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border-custom">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-acc-pink hover:bg-sub-pink transition-all duration-200 cursor-pointer"
              >
                <LogOut size={16} />
                <span>Keluar Sesi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-16 bg-card border-b border-border-custom flex items-center justify-between px-4 sm:px-6 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-main hover:bg-sub-slate md:hidden"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-extrabold text-lg tracking-tight capitalize text-main">
              {activeTabLabel}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* View Website Link */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-sub hover:text-acc-blue bg-sub-slate px-3 py-2 rounded-xl transition-all"
            >
              <ArrowLeft size={14} />
              <span>Lihat Website</span>
            </Link>

            {/* Theme Toggle in Topbar */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl  flex items-center justify-center text-main hover:text-acc-blue hover:border-acc-blue cursor-pointer transition-colors"
              title="Ganti Tema"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 bg-sub-slate/50 hover:bg-sub-slate  px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-main"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-[10px]">
                  A
                </div>
                <span className="hidden sm:inline">admin@credisuite.com</span>
                <ChevronDown size={14} className="opacity-60" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-card  rounded-2xl shadow-xl z-30 p-2 text-main animate-fade-in">
                    <div className="px-3 py-2.5 border-b border-border-custom">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{getGreeting()}</p>
                      <p className="text-xs font-extrabold mt-0.5 truncate text-main">Administrator</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-xl text-left text-xs font-bold text-acc-pink hover:bg-sub-pink transition-colors cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Logout Sesi</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          
          {/* Action Feedback Messages */}
          {message && (
            <div
              className={`p-4 rounded-2xl font-bold text-xs border animate-fade-in ${
                message.type === 'success'
                  ? 'bg-sub-green border-acc-green text-acc-green'
                  : 'bg-sub-pink border-acc-pink text-acc-pink'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Analytics Header Title */}
              <div>
                <div className="text-[10px] font-bold text-acc-blue uppercase tracking-widest">Analytics Overview</div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-main mt-0.5">Pemantauan Trafik & Aktivitas Pengguna</h2>
              </div>

              {/* STATS CARD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* CARD 1: USERS (TRAFFIC) */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-3xl p-6 shadow-lg shadow-blue-500/10 flex flex-col justify-between h-44 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-75 block">Total Users</span>
                      <span className="text-3xl font-extrabold block mt-2">{formatNumber(analytics?.summary.totalTraffic || 0)}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold border-t border-white/10 pt-4 mt-auto">
                    <span>ACTIVE NOW: <strong className="text-white text-xs ml-0.5">1</strong></span>
                    <span>DAILY ACTIVE: <strong className="text-white text-xs ml-0.5">1</strong></span>
                  </div>
                </div>

                {/* CARD 2: DOWNLOADS */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-3xl p-6 shadow-lg shadow-purple-500/10 flex flex-col justify-between h-44 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-75 block">Unduh Gambar PNG</span>
                      <span className="text-3xl font-extrabold block mt-2">{formatNumber(analytics?.summary.totalDownloads || 0)}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Download size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold border-t border-white/10 pt-4 mt-auto">
                    <span>ACTIVE ADS / CALC: <strong className="text-white text-xs ml-0.5">3</strong></span>
                    <span>CAMPAIGNS / ACTIONS: <strong className="text-white text-xs ml-0.5">14</strong></span>
                  </div>
                </div>

                {/* CARD 3: SHARES */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-3xl p-6 shadow-lg shadow-emerald-500/10 flex flex-col justify-between h-44 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-75 block">Total Bagikan</span>
                      <span className="text-3xl font-extrabold block mt-2">{formatNumber(analytics?.summary.totalShares || 0)}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Share2 size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold border-t border-white/10 pt-4 mt-auto">
                    <span>TICKET SOLD / EXPORTS: <strong className="text-white text-xs ml-0.5">0</strong></span>
                    <span>TOTAL REVENUE: <strong className="text-white text-xs ml-0.5">Rp 0</strong></span>
                  </div>
                </div>
              </div>

              {/* TRAFFIC & ACTION DETAILS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Traffic Source Table */}
                <div className="bg-card  rounded-3xl p-6   transition-colors duration-300">
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

                {/* Calculator action usage stats */}
                <div className="bg-card  rounded-3xl p-6   transition-colors duration-300">
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
              <div className="bg-card  rounded-3xl p-6   transition-colors duration-300">
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
          )}

          {/* TAB 2: FRACTIONS */}
          {activeTab === 'fractions' && (
            <div className="bg-card  rounded-3xl p-6   transition-colors duration-300">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight border-b border-border-custom pb-4 mb-3 text-main">
                  Tabel Fraksi Harga BEI (Tick Size)
                </h3>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  Kelola tingkatan fraksi harga saham dan kelipatan perubahan harganya (tick size) di Bursa Efek Indonesia.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-custom text-muted font-bold">
                        <th className="py-2.5">Harga Min (Rp)</th>
                        <th className="py-2.5">Harga Max (Rp)</th>
                        <th className="py-2.5">Tick Size (Rp)</th>
                        <th className="py-2.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom/50">
                      {fractions.map((f, idx) => (
                        <tr key={idx} className="hover:bg-sub-slate/30 text-main">
                          <td className="py-2.5">
                            <input
                              type="number"
                              className="bg-page  rounded-lg px-3 py-1.5 text-main font-semibold outline-none focus:border-amber-500 w-32"
                              value={f.minPrice}
                              onChange={(e) => {
                                const newFractions = [...fractions];
                                newFractions[idx].minPrice = parseFloat(e.target.value) || 0;
                                setFractions(newFractions);
                              }}
                            />
                          </td>
                          <td className="py-2.5">
                            <input
                              type="text"
                              className="bg-page  rounded-lg px-3 py-1.5 text-main font-semibold outline-none focus:border-amber-500 w-32"
                              value={f.maxPrice === Infinity ? 'Infinity' : f.maxPrice}
                              onChange={(e) => {
                                const newFractions = [...fractions];
                                const val = e.target.value;
                                newFractions[idx].maxPrice = val === 'Infinity' ? Infinity : parseFloat(val) || 0;
                                setFractions(newFractions);
                              }}
                            />
                          </td>
                          <td className="py-2.5">
                            <input
                              type="number"
                              className="bg-page  rounded-lg px-3 py-1.5 text-main font-semibold outline-none focus:border-amber-500 w-32"
                              value={f.tick}
                              onChange={(e) => {
                                const newFractions = [...fractions];
                                newFractions[idx].tick = parseFloat(e.target.value) || 1;
                                setFractions(newFractions);
                              }}
                            />
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => setFractions(fractions.filter((_, i) => i !== idx))}
                              className="bg-sub-pink border border-acc-pink text-acc-pink w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-acc-pink hover:text-white transition-colors ml-auto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 border-t border-border-custom pt-5">
                  <button
                    onClick={() => setFractions([...fractions, { minPrice: 0, maxPrice: 0, tick: 1 }])}
                    className="flex items-center gap-1.5 bg-card  hover:border-amber-500 hover:text-amber-500 text-main font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> <span>Tambah Baris Fraksi</span>
                  </button>

                  <button
                    onClick={handleSaveRules}
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARA / ARB */}
          {activeTab === 'ara-arb' && (
            <div className="bg-card  rounded-3xl p-6   transition-colors duration-300">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight border-b border-border-custom pb-4 mb-3 text-main">
                  Persentase Batas Auto Rejection
                </h3>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  Atur persentase Auto Rejection Atas (ARA) dan Auto Rejection Bawah (ARB) untuk masing-masing klasifikasi papan.
                </p>

                <div className="flex flex-col gap-4 max-w-xl">
                  <div className="bg-sub-slate p-5 rounded-2xl /50">
                    <h4 className="font-extrabold text-xs text-main tracking-wide mb-3">
                      Papan Utama & Papan Pengembangan
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted block">ARA (%)</label>
                        <input
                          type="number"
                          className="w-full bg-card  rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-amber-500"
                          value={araUtama}
                          onChange={(e) => setAraUtama(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted block">ARB (%)</label>
                        <input
                          type="number"
                          className="w-full bg-card  rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-amber-500"
                          value={arbUtama}
                          onChange={(e) => setArbUtama(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-sub-slate p-5 rounded-2xl /50">
                    <h4 className="font-extrabold text-xs text-main tracking-wide mb-3">
                      Papan Akselerasi & Papan Watchlist (FTS)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted block">ARA (%)</label>
                        <input
                          type="number"
                          className="w-full bg-card  rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-amber-500"
                          value={araAkselerasi}
                          onChange={(e) => setAraAkselerasi(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted block">ARB (%)</label>
                        <input
                          type="number"
                          className="w-full bg-card  rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-amber-500"
                          value={arbAkselerasi}
                          onChange={(e) => setArbAkselerasi(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveRules}
                    disabled={saving}
                    className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
                  >
                    <Save size={15} />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Persentase ARA/ARB'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="bg-card rounded-3xl p-6 transition-colors duration-300 max-w-3xl">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight border-b border-border-custom pb-4 mb-3 text-main">
                  Pengaturan Sistem & Disclaimer
                </h3>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  Kelola nilai pajak transaksi global dan teks disclaimer yang ditampilkan di website.
                </p>

                <form onSubmit={handleSaveTerms} className="space-y-5">
                  {/* Tax Setting Box */}
                  <div className="bg-sub-slate p-5 rounded-2xl /50">
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
                        className="w-full bg-card  rounded-xl px-3 py-2 text-main font-semibold outline-none focus:border-amber-500"
                        value={taxSetting}
                        onChange={(e) => setTaxSetting(parseFloat(e.target.value) || 0.0)}
                      />
                    </div>
                  </div>

                  {/* Terms & Conditions Textarea */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted block">Teks Syarat & Ketentuan (Disclaimer)</label>
                    <textarea
                      className="w-full bg-page  rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-amber-500 text-xs"
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
                    className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save size={15} />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan Sistem'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="bg-card  rounded-3xl p-6   transition-colors duration-300 max-w-md">
              <div>
                <h3 className="font-extrabold text-sm tracking-tight border-b border-border-custom pb-4 mb-3 text-main">
                  Perbarui Keamanan Password
                </h3>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  Ganti password keamanan Anda untuk membatasi akses Admin CMS.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted block">Password Lama</label>
                    <input
                      type="password"
                      className="w-full bg-page  rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-amber-500"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted block">Password Baru</label>
                    <input
                      type="password"
                      className="w-full bg-page  rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-amber-500"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimal 6 karakter"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted block">Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      className="w-full bg-page  rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-amber-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
                  >
                    <Save size={15} />
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
