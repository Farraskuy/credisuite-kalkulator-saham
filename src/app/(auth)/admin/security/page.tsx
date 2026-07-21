'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminSecurityPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
      setSaving(false);
      return;
    }

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

      <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm max-w-md">
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
                className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-blue"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted block">Password Baru</label>
              <input
                type="password"
                className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-blue"
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
                className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-blue"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-1.5 bg-acc-blue hover:bg-acc-blue/90 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              <Save size={15} />
              <span>{saving ? 'Memperbarui...' : 'Perbarui Password Admin'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
