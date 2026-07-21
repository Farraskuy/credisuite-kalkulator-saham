'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { kalkulasiTargetSaham, formatIDR, formatNumber, FractionRule } from '@/lib/calculations';
import ExportCardWrapper from './ExportCardWrapper';

interface Props {
  fractionRules?: FractionRule[];
  tax?: number;
}

export default function PredictionSection({ fractionRules, tax = 0.0 }: Props) {
  const [ticker, setTicker] = useState<string>('BBRI');
  const [clientName, setClientName] = useState<string>('');
  const [hargaBeli, setHargaBeli] = useState<number>(1000);
  const [lot, setLot] = useState<number>(10);
  const [feeBeli, setFeeBeli] = useState<number>(0.15); // 0.15%
  const [feeJual, setFeeJual] = useState<number>(0.25); // 0.25%
  const [targetUntungRp, setTargetUntungRp] = useState<number>(250000);
  const [targetRugiRp, setTargetRugiRp] = useState<number>(100000);

  const result = kalkulasiTargetSaham(
    {
      hargaBeli,
      lot,
      feeBeli,
      feeJual,
      targetUntungRp,
      targetRugiRp,
      pajak: tax,
    },
    fractionRules
  );

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Validasi JS: Hapus semua karakter non-huruf (angka & simbol) dan batasi maksimal 4 karakter
    const cleanTicker = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
    setTicker(cleanTicker);
  };

  const handleNumChange = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setter(rawVal ? parseInt(rawVal, 10) : 0);
  };

  const cleanFileName = clientName 
    ? `kalkulator-prediksi-${ticker}-${clientName.replace(/\s+/g, '-')}` 
    : `kalkulator-prediksi-${ticker}`;

  return (
    <section id="prediction" className="space-y-6 scroll-mt-20">
      <div className="border-b border-border-custom pb-4">
        <div className="text-xs font-bold text-acc-green uppercase tracking-wider">Kalkulator #3</div>
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 text-main mt-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-acc-green shadow-sm shadow-acc-green/20">
            <Target size={20} />
          </div>
          Prediksi Jual / Beli & Target Untung Rugi
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Form Card */}
        <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-green text-acc-green">
                  <Target size={20} />
                </div>
                <span className="font-bold text-main">Parameter Target & Fee</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label htmlFor="pred-ticker" className="text-xs font-bold text-muted block">
                  Kode Ticker Saham (Max 4 Huruf)
                </label>
                <input
                  id="pred-ticker"
                  type="text"
                  className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-bold outline-none focus:border-acc-green focus:ring-2 focus:ring-acc-green/10 transition-all uppercase placeholder-gray-400"
                  value={ticker}
                  onChange={handleTickerChange}
                  placeholder="e.g. BBRI"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="pred-name" className="text-xs font-bold text-muted block">
                  Nama Anda (Opsional)
                </label>
                <input
                  id="pred-name"
                  type="text"
                  className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-green focus:ring-2 focus:ring-acc-green/10 transition-all placeholder-gray-400"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Budi"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label htmlFor="pred-price" className="text-xs font-bold text-muted block">
                  Harga Beli Saham (Rp)
                </label>
                <input
                  id="pred-price"
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-green focus:ring-2 focus:ring-acc-green/10 transition-all"
                  value={hargaBeli ? formatNumber(hargaBeli) : ''}
                  onChange={handleNumChange(setHargaBeli)}
                  placeholder="e.g. 1000"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="pred-lot" className="text-xs font-bold text-muted block">
                  Jumlah Lot
                </label>
                <input
                  id="pred-lot"
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-green focus:ring-2 focus:ring-acc-green/10 transition-all"
                  value={lot ? formatNumber(lot) : ''}
                  onChange={handleNumChange(setLot)}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label htmlFor="pred-feebeli" className="text-xs font-bold text-muted block">
                  Fee Beli Sekuritas (%)
                </label>
                <input
                  id="pred-feebeli"
                  type="number"
                  step="0.01"
                  className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-green focus:ring-2 focus:ring-acc-green/10 transition-all"
                  value={feeBeli}
                  onChange={(e) => setFeeBeli(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="pred-feejual" className="text-xs font-bold text-muted block">
                  Fee Jual Sekuritas (%)
                </label>
                <input
                  id="pred-feejual"
                  type="number"
                  step="0.01"
                  className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-green focus:ring-2 focus:ring-acc-green/10 transition-all"
                  value={feeJual}
                  onChange={(e) => setFeeJual(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="pred-profit" className="text-xs font-bold text-muted block">
                  Target Untung (Rp)
                </label>
                <input
                  id="pred-profit"
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-green focus:ring-2 focus:ring-acc-green/10 transition-all"
                  value={targetUntungRp ? formatNumber(targetUntungRp) : ''}
                  onChange={handleNumChange(setTargetUntungRp)}
                  placeholder="e.g. 250000"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="pred-loss" className="text-xs font-bold text-muted block">
                  Batas Maksimal Rugi (Rp)
                </label>
                <input
                  id="pred-loss"
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-page border border-border-custom rounded-xl px-4 py-3 text-main font-semibold outline-none focus:border-acc-green focus:ring-2 focus:ring-acc-green/10 transition-all"
                  value={targetRugiRp ? formatNumber(targetRugiRp) : ''}
                  onChange={handleNumChange(setTargetRugiRp)}
                  placeholder="e.g. 100000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <ExportCardWrapper fileName={cleanFileName} calculatorType="prediction">
          <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-green text-acc-green">
                <DollarSign size={20} />
              </div>
              <div>
                <span className="font-extrabold text-main block leading-tight">
                  Proyeksi {ticker ? ticker : 'SAHAM'}
                </span>
                {clientName && (
                  <span className="text-[10px] text-muted block mt-0.5">Dihitung oleh: {clientName}</span>
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-acc-green bg-sub-green px-2.5 py-1 rounded-lg">
              {formatNumber(result.rincian.totalLembar)} Lembar
            </span>
          </div>

          <div className="bg-gradient-to-r from-acc-green to-acc-green/90 text-white rounded-2xl p-5 flex items-center justify-between shadow-md shadow-acc-green/10">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-85">Total Modal Pembelian (+ Fee Beli)</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-1">{formatIDR(result.rincian.totalModal)}</div>
            </div>
            <div>
              <DollarSign size={24} />
            </div>
          </div>

          {/* Skenario Untung Box */}
          <div className="bg-sub-green border border-acc-green rounded-2xl p-4 mt-4 mb-3">
            <div className="flex items-center justify-between mb-3 border-b border-acc-green/10 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-acc-green">
                <TrendingUp size={18} />
                <span>SKENARIO TARGET UNTUNG (TAKE PROFIT)</span>
              </div>
              <span className="font-bold text-acc-green text-sm">
                +{result.skenarioUntung.persentase}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Harga Jual Valid BEI (Ceil)</span>
                <div className="text-base sm:text-lg font-extrabold text-main">
                  {formatIDR(result.skenarioUntung.hargaBEI)}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Profit Bersih Real</span>
                <div className="text-base sm:text-lg font-extrabold text-acc-green">
                  +{formatIDR(result.skenarioUntung.labaBersihReal)}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-muted mt-2">
              Harga Exact Matematik: {formatIDR(result.skenarioUntung.hargaExact)}
            </div>
          </div>

          {/* Skenario Rugi Box */}
          <div className="bg-sub-pink border border-acc-pink rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 border-b border-acc-pink/10 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-acc-pink">
                <TrendingDown size={18} />
                <span>SKENARIO BATAS RUGI (STOP LOSS)</span>
              </div>
              <span className="font-bold text-acc-pink text-sm">
                -{result.skenarioRugi.persentase}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Harga Jual Valid BEI (Floor)</span>
                <div className="text-base sm:text-lg font-extrabold text-main">
                  {formatIDR(result.skenarioRugi.hargaBEI)}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Rugi Bersih Real</span>
                <div className="text-base sm:text-lg font-extrabold text-acc-pink">
                  -{formatIDR(result.skenarioRugi.rugiBersihReal)}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-muted mt-2">
              Harga Exact Matematik: {formatIDR(result.skenarioRugi.hargaExact)}
            </div>
          </div>
        </ExportCardWrapper>
      </div>
    </section>
  );
}
