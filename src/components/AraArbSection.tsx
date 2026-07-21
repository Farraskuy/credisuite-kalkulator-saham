'use client';

import React, { useState } from 'react';
import { ShieldAlert, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Board, calculateAraArb, formatIDR, FractionRule } from '@/lib/calculations';
import ExportCardWrapper from './ExportCardWrapper';

interface Props {
  fractionRules?: FractionRule[];
  ticker?: string;
  onTickerChange?: (ticker: string) => void;
}

export default function AraArbSection({ fractionRules, ticker: propTicker, onTickerChange }: Props) {
  const [internalTicker, setInternalTicker] = useState<string>('BBRI');
  const [price, setPrice] = useState<number>(2110);
  const [board, setBoard] = useState<Board>('Utama');

  const ticker = propTicker !== undefined ? propTicker : internalTicker;

  const result = calculateAraArb(price, board, fractionRules);

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanTicker = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
    if (onTickerChange) {
      onTickerChange(cleanTicker);
    } else {
      setInternalTicker(cleanTicker);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setPrice(rawVal ? parseInt(rawVal, 10) : 0);
  };

  const cleanFileName = ticker
    ? `kalkulator-ara-arb-${ticker}-${price}`
    : `kalkulator-ara-arb-${price}`;

  return (
    <section id="ara-arb" className="space-y-6 scroll-mt-20">
      <div className="pb-2">
        <div className="text-xs font-bold text-acc-blue uppercase tracking-wider">Kalkulator #1</div>
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 text-main mt-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-acc-blue">
            <ShieldAlert size={20} />
          </div>
          Batas Auto Rejection (ARA / ARB)
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Form Input Card - NO SHADOW, NO BORDER */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-blue text-acc-blue">
                  <ShieldAlert size={20} />
                </div>
                <span className="font-bold text-main">Parameter Penutupan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="ara-ticker" className="text-xs font-bold text-muted block leading-tight">
                    Kode Ticker (A-Z)
                  </label>
                </div>
                <input
                  id="ara-ticker"
                  type="text"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-bold outline-none focus:ring-2 focus:ring-acc-blue/20 transition-all uppercase placeholder-gray-400"
                  value={ticker}
                  onChange={handleTickerChange}
                  placeholder="e.g. BBRI"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="ara-board" className="text-xs font-bold text-muted block leading-tight">
                    Klasifikasi Papan BEI
                  </label>
                </div>
                <select
                  id="ara-board"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-blue/20 transition-all cursor-pointer"
                  value={board}
                  onChange={(e) => setBoard(e.target.value as Board)}
                >
                  <option value="Utama">Papan Utama / Pengembang</option>
                  <option value="Akselerasi">Papan Akselerasi</option>
                  <option value="Watchlist">Papan Watchlist (FTS)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-end mb-4">
              <div className="min-h-[32px] flex items-end pb-1">
                <label htmlFor="ara-price" className="text-xs font-bold text-muted block leading-tight">
                  Harga Penutupan Kemarin (Previous Price)
                </label>
              </div>
              <input
                id="ara-price"
                type="text"
                inputMode="numeric"
                className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-blue/20 transition-all"
                value={price ? new Intl.NumberFormat('id-ID').format(price) : ''}
                onChange={handlePriceChange}
                placeholder="Masukkan harga e.g. 2110"
              />
            </div>
          </div>

          <div className="bg-sub-blue text-acc-blue rounded-2xl p-4 space-y-1.5 mt-4 text-[0.82rem]">
            <div className="flex items-center gap-1.5 font-bold">
              <HelpCircle size={16} /> Aturan Pembulatan BEI:
            </div>
            <span className="text-sub">
              ARA dibulatkan ke bawah (Math.floor) ke tick terdekat untuk mencegah harga melebihi batas persentase maksimal. ARB dibulatkan ke atas (Math.ceil) agar penurunan tidak melewati batas maksimal.
            </span>
          </div>
        </div>

        {/* Right Output Card - NO SHADOW, NO BORDER, NO GRADIENT */}
        <ExportCardWrapper fileName={cleanFileName} calculatorType="ara-arb">
          <div className="flex items-center justify-between pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-blue text-acc-blue">
                <TrendingUp size={20} />
              </div>
              <div>
                <span className="font-extrabold text-main block leading-tight">
                  Batas Harga {ticker ? ticker : 'SAHAM'}
                </span>
                <span className="text-[10px] text-muted block mt-0.5">Papan: {board}</span>
              </div>
            </div>
          </div>

          {/* ARA Box - SOLID COLOR */}
          <div className="bg-acc-blue text-white rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-85">Batas Auto Rejection Atas (ARA)</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-1">{formatIDR(result.ara)}</div>
            </div>
            <div>
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
            <div className="bg-sub-green text-acc-green rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Persentase ARA</span>
              <span className="text-base font-extrabold block text-acc-green">+{result.araPercent.toFixed(2)}%</span>
            </div>
            <div className="bg-sub-blue text-acc-blue rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Harga Mentah ARA (Max {result.araPercentMax}%)</span>
              <span className="text-base font-extrabold block text-main">
                {formatIDR(result.araRaw)}
              </span>
            </div>
          </div>

          {/* ARB Box - SOLID COLOR */}
          <div className="bg-acc-pink text-white rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-85">Batas Auto Rejection Bawah (ARB)</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-1">{formatIDR(result.arb)}</div>
            </div>
            <div>
              <TrendingDown size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-sub-pink text-acc-pink rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Persentase ARB</span>
              <span className="text-base font-extrabold block text-acc-pink">-{result.arbPercent.toFixed(2)}%</span>
            </div>
            <div className="bg-sub-slate text-sub rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Harga Mentah ARB (Max {result.arbPercentMax}%)</span>
              <span className="text-base font-extrabold block text-main">
                {formatIDR(result.arbRaw)}
              </span>
            </div>
          </div>
        </ExportCardWrapper>
      </div>
    </section>
  );
}
