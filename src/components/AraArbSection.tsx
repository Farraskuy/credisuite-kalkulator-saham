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
    <section id="ara-arb" className="space-y-6 scroll-mt-20">
      <div className="border-b border-border-custom pb-4">
        <div className="text-xs font-bold text-acc-blue uppercase tracking-wider">Kalkulator #1</div>
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 text-main mt-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-acc-blue   shadow-acc-blue/20">
            <ShieldAlert size={20} />
          </div>
          Batas Auto Rejection (ARA / ARB)
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Form Input Card */}
        <div className="bg-card  rounded-3xl p-6 sm:p-8   flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-blue text-acc-blue">
                  <ShieldAlert size={20} />
                </div>
                <span className="font-bold text-main">Parameter Penutupan</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <label htmlFor="ara-price" className="text-xs font-bold text-muted block">
                Harga Penutupan Kemarin (Previous Price)
              </label>
              <input
                id="ara-price"
                type="text"
                inputMode="numeric"
                className="w-full bg-page  rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-blue focus:ring-2 focus:ring-acc-blue/10 transition-all"
                value={price ? new Intl.NumberFormat('id-ID').format(price) : ''}
                onChange={handlePriceChange}
                placeholder="Masukkan harga e.g. 1500"
              />
            </div>

            <div className="space-y-2 mb-4">
              <label htmlFor="ara-board" className="text-xs font-bold text-muted block">
                Klasifikasi Papan Saham
              </label>
              <select
                id="ara-board"
                className="w-full bg-page  rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-blue focus:ring-2 focus:ring-acc-blue/10 transition-all cursor-pointer"
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

          <div className="bg-sub-blue text-acc-blue rounded-2xl p-4 space-y-1.5 mt-4 text-[0.82rem]">
            <div className="flex items-center gap-1.5 font-bold">
              <HelpCircle size={16} /> Aturan Pembulatan BEI:
            </div>
            <span className="text-sub">
              ARA dibulatkan ke bawah (Math.floor) ke tick terdekat, sedangkan ARB dibulatkan ke
              atas (Math.ceil) agar tetap presisi sesuai aturan Order Book IDX.
            </span>
          </div>
        </div>

        {/* Right Output Card */}
        <ExportCardWrapper fileName={`kalkulator-ara-arb-${price}`} calculatorType="ara-arb">
          <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-blue text-acc-blue">
                <TrendingUp size={20} />
              </div>
              <span className="font-bold text-main">Batas Harga {board}</span>
            </div>
            <span className="text-xs font-bold text-acc-blue bg-sub-blue px-2.5 py-1 rounded-lg">
              Penutupan: {formatIDR(price)}
            </span>
          </div>

          {/* Accent Banners */}
          <div className="bg-gradient-to-r from-acc-blue to-acc-blue/90 text-white rounded-2xl p-5 flex items-center justify-between shadow-md shadow-acc-blue/10">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-85">Batas Auto Rejection Atas (ARA)</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-1">{formatIDR(result.ara)}</div>
            </div>
            <div>
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
            <div className="bg-sub-green text-acc-green rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Persentase ARA</span>
              <span className="text-base font-extrabold block text-acc-green">+{result.araPercent}%</span>
            </div>
            <div className="bg-sub-blue text-acc-blue rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Harga Mentah ARA</span>
              <span className="text-base font-extrabold block text-main">
                {formatIDR(result.araRaw)}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-acc-pink to-acc-pink/90 text-white rounded-2xl p-5 flex items-center justify-between shadow-md shadow-acc-pink/10">
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
              <span className="text-base font-extrabold block text-acc-red">-{result.arbPercent}%</span>
            </div>
            <div className="bg-sub-slate text-sub rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Harga Mentah ARB</span>
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
