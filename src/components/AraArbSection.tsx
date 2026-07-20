'use client';

import React, { useState } from 'react';
import { ShieldAlert, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Board, calculateAraArb, formatIDR, FractionRule } from '@/lib/calculations';
import ExportCardWrapper from './ExportCardWrapper';

interface Props {
  fractionRules?: FractionRule[];
}

export default function AraArbSection({ fractionRules }: Props) {
  const [price, setPrice] = useState<number>(1500);
  const [board, setBoard] = useState<Board>('Utama');

  const result = calculateAraArb(price, board, fractionRules);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setPrice(rawVal ? parseInt(rawVal, 10) : 0);
  };

  return (
    <section id="ara-arb" className="calculator-section">
      <div className="section-header">
        <div className="section-breadcrumb">Kalkulator #1</div>
        <h2 className="section-title">
          <div className="section-badge-icon" style={{ background: 'var(--accent-blue)' }}>
            <ShieldAlert size={20} />
          </div>
          Batas Auto Rejection (ARA / ARB)
        </h2>
      </div>

      <div className="calculator-grid">
        {/* Left Form Input Card */}
        <div className="flat-card">
          <div>
            <div className="card-top">
              <div className="card-title-group">
                <div
                  className="card-title-icon"
                  style={{ background: 'var(--bg-sub-blue)', color: 'var(--accent-blue)' }}
                >
                  <ShieldAlert size={20} />
                </div>
                <span className="card-title-text">Parameter Penutupan</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ara-price" className="form-label">
                Harga Penutupan Kemarin (Previous Price)
              </label>
              <input
                id="ara-price"
                type="text"
                inputMode="numeric"
                className="form-input"
                value={price ? new Intl.NumberFormat('id-ID').format(price) : ''}
                onChange={handlePriceChange}
                placeholder="Masukkan harga e.g. 1500"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ara-board" className="form-label">
                Klasifikasi Papan Saham
              </label>
              <select
                id="ara-board"
                className="form-select"
                value={board}
                onChange={(e) => setBoard(e.target.value as Board)}
              >
                <option value="Utama">Papan Utama / Pengembangan</option>
                <option value="Pengembangan">Papan Pengembangan</option>
                <option value="Akselerasi">Papan Akselerasi</option>
                <option value="Watchlist">Papan Watchlist (FTS)</option>
              </select>
            </div>
          </div>

          <div
            className="sub-box blue"
            style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-sub)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <HelpCircle size={16} /> Aturan Pembulatan BEI:
            </div>
            <span>
              ARA dibulatkan ke bawah (Math.floor) ke tick terdekat, sedangkan ARB dibulatkan ke
              atas (Math.ceil) agar tetap presisi sesuai aturan Order Book IDX.
            </span>
          </div>
        </div>

        {/* Right Output Card */}
        <ExportCardWrapper fileName={`kalkulator-ara-arb-${price}`}>
          <div className="card-top">
            <div className="card-title-group">
              <div
                className="card-title-icon"
                style={{ background: 'var(--bg-sub-blue)', color: 'var(--accent-blue)' }}
              >
                <TrendingUp size={20} />
              </div>
              <span className="card-title-text">Batas Harga {board}</span>
            </div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-blue)',
                background: 'var(--bg-sub-blue)',
                padding: '0.25rem 0.65rem',
                borderRadius: '8px',
              }}
            >
              Penutupan: {formatIDR(price)}
            </span>
          </div>

          {/* Accent Banners */}
          <div className="accent-banner blue">
            <div>
              <div className="accent-banner-label">Batas Auto Rejection Atas (ARA)</div>
              <div className="accent-banner-value">{formatIDR(result.ara)}</div>
            </div>
            <div className="accent-banner-icon">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="sub-grid">
            <div className="sub-box green">
              <span className="sub-box-label">Persentase ARA</span>
              <span className="sub-box-val val-green">+{result.araPercent}%</span>
            </div>
            <div className="sub-box blue">
              <span className="sub-box-label">Harga Mentah ARA</span>
              <span className="sub-box-val" style={{ fontSize: '1rem' }}>
                {formatIDR(result.araRaw)}
              </span>
            </div>
          </div>

          <div className="accent-banner pink" style={{ marginTop: '0.5rem' }}>
            <div>
              <div className="accent-banner-label">Batas Auto Rejection Bawah (ARB)</div>
              <div className="accent-banner-value">{formatIDR(result.arb)}</div>
            </div>
            <div className="accent-banner-icon">
              <TrendingDown size={24} />
            </div>
          </div>

          <div className="sub-grid">
            <div className="sub-box pink">
              <span className="sub-box-label">Persentase ARB</span>
              <span className="sub-box-val val-red">-{result.arbPercent}%</span>
            </div>
            <div className="sub-box slate">
              <span className="sub-box-label">Harga Mentah ARB</span>
              <span className="sub-box-val" style={{ fontSize: '1rem' }}>
                {formatIDR(result.arbRaw)}
              </span>
            </div>
          </div>
        </ExportCardWrapper>
      </div>
    </section>
  );
}
