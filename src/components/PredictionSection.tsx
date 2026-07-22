'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { kalkulasiTargetSaham, formatIDR, formatNumber, FractionRule } from '@/lib/calculations';
import ExportCardWrapper from './ExportCardWrapper';
import WebsiteBrand from './WebsiteBrand';

interface Props {
  fractionRules?: FractionRule[];
  tax?: number;
  ticker?: string;
  onTickerChange?: (ticker: string) => void;
}

export default function PredictionSection({
  fractionRules,
  tax = 0.0,
  ticker: propTicker,
  onTickerChange,
}: Props) {
  const [internalTicker, setInternalTicker] = useState<string>('BBRI');
  const [clientName, setClientName] = useState<string>('');
  const [hargaBeli, setHargaBeli] = useState<number>(1000);
  const [lot, setLot] = useState<number>(10);
  const [feeBeli, setFeeBeli] = useState<number>(0.15); // 0.15%
  const [feeJual, setFeeJual] = useState<number>(0.25); // 0.25%
  const [targetUntungRp, setTargetUntungRp] = useState<number>(250000);
  const [targetRugiRp, setTargetRugiRp] = useState<number>(100000);

  const ticker = propTicker !== undefined ? propTicker : internalTicker;

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
    const cleanTicker = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
    if (onTickerChange) {
      onTickerChange(cleanTicker);
    } else {
      setInternalTicker(cleanTicker);
    }
  };

  const handleNumChange = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setter(rawVal ? parseInt(rawVal, 10) : 0);
  };

  const getFormattedDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  const domain = typeof window !== 'undefined' ? window.location.hostname : 'hitungsaham.com';
  const cleanFileName = `${domain}-Rencana-${ticker || 'SAHAM'}-${hargaBeli || 0}-${getFormattedDate()}`;

  return (
    <section id="prediction" className="space-y-6 scroll-mt-20">
      <div className="pb-2">
        <div className="text-xs font-bold text-acc-green uppercase tracking-wider">Kalkulator #3</div>
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 text-main mt-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-acc-green">
            <Target size={20} />
          </div>
          Prediksi Jual / Beli & Target Untung Rugi
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Form Card - NO SHADOW, NO BORDER */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-green text-acc-green">
                  <Target size={20} />
                </div>
                <span className="font-bold text-main">Parameter Target & Fee</span>
              </div>
            </div>

            {/* Row 1: Ticker & Nama */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="pred-ticker" className="text-xs font-bold text-muted block leading-tight">
                    Kode Ticker (A-Z)
                  </label>
                </div>
                <input
                  id="pred-ticker"
                  type="text"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-bold outline-none focus:ring-2 focus:ring-acc-green/20 transition-all uppercase placeholder-gray-400"
                  value={ticker}
                  onChange={handleTickerChange}
                  placeholder="e.g. BBRI"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="pred-name" className="text-xs font-bold text-muted block leading-tight">
                    Nama Anda (Opsional)
                  </label>
                </div>
                <input
                  id="pred-name"
                  type="text"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-green/20 transition-all placeholder-gray-400"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Budi"
                />
              </div>
            </div>

            {/* Row 2: Harga Beli & Lot */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="pred-price" className="text-xs font-bold text-muted block leading-tight">
                    Harga Beli Saham (Rp)
                  </label>
                </div>
                <input
                  id="pred-price"
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-green/20 transition-all"
                  value={hargaBeli ? formatNumber(hargaBeli) : ''}
                  onChange={handleNumChange(setHargaBeli)}
                  placeholder="e.g. 1000"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="pred-lot" className="text-xs font-bold text-muted block leading-tight">
                    Jumlah Lot
                  </label>
                </div>
                <input
                  id="pred-lot"
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-green/20 transition-all"
                  value={lot ? formatNumber(lot) : ''}
                  onChange={handleNumChange(setLot)}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            {/* Row 3: Fee Beli & Fee Jual */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="pred-feebeli" className="text-xs font-bold text-muted block leading-tight">
                    Fee Beli Sekuritas (%)
                  </label>
                </div>
                <input
                  id="pred-feebeli"
                  type="number"
                  step="0.01"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-green/20 transition-all"
                  value={feeBeli}
                  onChange={(e) => setFeeBeli(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="pred-feejual" className="text-xs font-bold text-muted block leading-tight">
                    Fee Jual Sekuritas (%)
                  </label>
                </div>
                <input
                  id="pred-feejual"
                  type="number"
                  step="0.01"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-green/20 transition-all"
                  value={feeJual}
                  onChange={(e) => setFeeJual(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Row 4: Target Profit & Batas Rugi */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="pred-profit" className="text-xs font-bold text-muted block leading-tight">
                    Target Untung (Rp)
                  </label>
                </div>
                <input
                  id="pred-profit"
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-green/20 transition-all"
                  value={targetUntungRp ? formatNumber(targetUntungRp) : ''}
                  onChange={handleNumChange(setTargetUntungRp)}
                  placeholder="e.g. 250000"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="min-h-[32px] flex items-end pb-1">
                  <label htmlFor="pred-loss" className="text-xs font-bold text-muted block leading-tight">
                    Batas Maksimal Rugi (Rp)
                  </label>
                </div>
                <input
                  id="pred-loss"
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-page rounded-xl px-4 py-3 text-main font-semibold outline-none focus:ring-2 focus:ring-acc-green/20 transition-all"
                  value={targetRugiRp ? formatNumber(targetRugiRp) : ''}
                  onChange={handleNumChange(setTargetRugiRp)}
                  placeholder="e.g. 100000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Card - NO SHADOW, NO BORDER, NO GRADIENT */}
        <ExportCardWrapper
          fileName={cleanFileName}
          calculatorType="prediction"
          hideDefaultWatermark={true}
        >
          {({ isExporting }) => (
            <>
              <div className="flex items-center justify-between pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-green text-acc-green">
                    <Coins size={20} />
                  </div>
                  <div>
                    <span className="font-extrabold text-main block leading-tight">
                      Proyeksi {ticker ? ticker : 'SAHAM'}
                    </span>
                    {clientName.trim() && (
                      <span className="text-[10px] text-muted block mt-0.5 font-medium">
                        Dihitung oleh: {clientName.trim()}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-acc-green bg-sub-green px-2.5 py-1 rounded-lg">
                  {formatNumber(result.rincian.totalLembar)} Lembar
                </span>
              </div>

              {/* Total Modal Box - SOLID COLOR */}
              <div className="bg-acc-green text-white rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-85">
                    Total Modal Pembelian (+ Fee Beli)
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold mt-1">
                    {formatIDR(result.rincian.totalModal)}
                  </div>
                </div>
                <div>
                  <Coins size={28} />
                </div>
              </div>

              {/* Skenario Untung Box */}
              <div className="bg-sub-green rounded-2xl p-4 mt-4 mb-3">
                <div className="flex items-center justify-between mb-3 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-acc-green">
                    <TrendingUp size={18} />
                    <span>SKENARIO TARGET UNTUNG (TAKE PROFIT)</span>
                  </div>
                  <span className="font-bold text-acc-green text-sm">
                    +{result.skenarioUntung.persentase}%
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">
                      Harga Jual Valid BEI (Ceil)
                    </span>
                    <div className="text-xs xs:text-sm sm:text-base md:text-lg font-extrabold text-main truncate">
                      {formatIDR(result.skenarioUntung.hargaBEI)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">
                      Profit Bersih Real
                    </span>
                    <div className="text-xs xs:text-sm sm:text-base md:text-lg font-extrabold text-acc-green truncate">
                      +{formatIDR(result.skenarioUntung.labaBersihReal)}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-muted mt-2">
                  Harga Exact Matematik: {formatIDR(result.skenarioUntung.hargaExact)}
                </div>
              </div>

              {/* Watermark Export In Middle (Only visible when exporting) */}
              {isExporting && (
                <div className="flex items-center justify-between text-[11px] text-muted py-3 my-2">
                  <div className="bg-acc-blue rounded-full px-5 py-2 text-white font-semibold text-xs">
                    <WebsiteBrand />
                  </div>
                  <span>Kalkulator Saham</span>
                </div>
              )}

              {/* Skenario Rugi Box */}
              <div className="bg-sub-pink rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-acc-pink">
                    <TrendingDown size={18} />
                    <span>SKENARIO BATAS RUGI (STOP LOSS)</span>
                  </div>
                  <span className="font-bold text-acc-pink text-sm">
                    -{result.skenarioRugi.persentase}%
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex flex-wrap items-center gap-1">
                      Harga Jual Valid BEI (Floor)
                      {result.skenarioRugi.hargaBEI === hargaBeli && (
                        <span className="text-[9px] bg-sub-pink text-acc-pink px-1.5 py-0.5 rounded font-extrabold">
                          (Harga Jual = Harga Beli)
                        </span>
                      )}
                    </span>
                    <div className="text-xs xs:text-sm sm:text-base md:text-lg font-extrabold text-main truncate mt-0.5">
                      {formatIDR(result.skenarioRugi.hargaBEI)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">
                      Rugi Bersih Real
                    </span>
                    <div className="text-xs xs:text-sm sm:text-base md:text-lg font-extrabold text-acc-pink truncate mt-0.5">
                      -{formatIDR(result.skenarioRugi.rugiBersihReal)}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-muted mt-2">
                  Harga Exact Matematik: {formatIDR(result.skenarioRugi.hargaExact)}
                </div>
              </div>
            </>
          )}
        </ExportCardWrapper>
      </div>
    </section>
  );
}
