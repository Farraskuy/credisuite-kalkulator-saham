'use client';

import React, { useState } from 'react';
import { Layers, Plus, Trash2, Calculator } from 'lucide-react';
import { calculateAverage, formatIDR, formatNumber, PurchaseRow } from '@/lib/calculations';
import ExportCardWrapper from './ExportCardWrapper';

export default function AvgUpDownSection() {
  const [rows, setRows] = useState<PurchaseRow[]>([
    { id: '1', price: 1000, lot: 10 },
    { id: '2', price: 800, lot: 15 },
  ]);

  const [targetAvg, setTargetAvg] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);

  const result = calculateAverage(rows);

  const handleUpdateRow = (index: number, field: 'price' | 'lot', value: string) => {
    const rawVal = value.replace(/\D/g, '');
    const num = rawVal ? parseInt(rawVal, 10) : 0;
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: num };
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now().toString(), price: 0, lot: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  // Calculate needed lots for Target Average
  let neededLots = 0;
  let neededCapital = 0;

  if (targetAvg > 0 && newPrice > 0 && result.totalLembar > 0 && targetAvg !== newPrice) {
    const numerator = targetAvg * result.totalLembar - result.totalInvestment;
    const denominator = 100 * (newPrice - targetAvg);
    if (denominator !== 0) {
      const calcLot = Math.ceil(numerator / denominator);
      if (calcLot > 0) {
        neededLots = calcLot;
        neededCapital = neededLots * 100 * newPrice;
      }
    }
  }

  return (
    <section id="avg-up-down" className="space-y-6 scroll-mt-20">
      <div className="border-b border-border-custom pb-4">
        <div className="text-xs font-bold text-acc-purple uppercase tracking-wider">Kalkulator #2</div>
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5 text-main mt-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-acc-purple   shadow-acc-purple/20">
            <Layers size={20} />
          </div>
          Simulasi Average Up / Down
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Input Card */}
        <div className="bg-card  rounded-3xl p-6 sm:p-8   flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-purple text-acc-purple">
                  <Layers size={20} />
                </div>
                <span className="font-bold text-main">Daftar Transaksi Pembelian</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {rows.map((row, idx) => (
                <div
                  key={row.id || idx}
                  className="grid grid-cols-[1.2fr_1fr_auto] gap-2.5 items-end bg-sub-slate p-3 rounded-xl"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted block">
                      Harga Beli #{idx + 1}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-card  rounded-lg px-3 py-2 text-main font-semibold outline-none focus:border-acc-purple transition-all"
                      value={row.price ? formatNumber(row.price) : ''}
                      onChange={(e) => handleUpdateRow(idx, 'price', e.target.value)}
                      placeholder="e.g. 1000"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted block">
                      Lot
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-full bg-card  rounded-lg px-3 py-2 text-main font-semibold outline-none focus:border-acc-purple transition-all"
                      value={row.lot ? formatNumber(row.lot) : ''}
                      onChange={(e) => handleUpdateRow(idx, 'lot', e.target.value)}
                      placeholder="e.g. 10"
                    />
                  </div>

                  {rows.length > 1 && (
                    <button
                      onClick={() => handleRemoveRow(idx)}
                      className="bg-sub-pink border border-acc-pink text-acc-pink w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-acc-pink hover:text-white"
                      title="Hapus baris"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddRow}
              className="w-full bg-card  text-main font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 hover:border-acc-purple hover:text-acc-purple cursor-pointer mt-4 flex items-center justify-center gap-1.5"
            >
              <Plus size={16} />
              <span>Tambah Baris Pembelian</span>
            </button>

            {/* Target Average Calculator Drawer */}
            <div className="mt-6 pt-4 border-t border-dashed border-border-custom">
              <div className="flex items-center gap-1.5 font-bold text-sm mb-3">
                <Calculator size={16} className="text-acc-purple" />
                <span>Simulasi Target Price Average (Opsional)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted block">
                    Target Avg Diharapkan
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-page  rounded-xl px-3 py-2.5 text-main font-semibold outline-none focus:border-acc-purple transition-all"
                    value={targetAvg ? formatNumber(targetAvg) : ''}
                    onChange={(e) =>
                      setTargetAvg(parseInt(e.target.value.replace(/\D/g, ''), 10) || 0)
                    }
                    placeholder="e.g. 900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted block">
                    Harga Pembelian Baru
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-page  rounded-xl px-3 py-2.5 text-main font-semibold outline-none focus:border-acc-purple transition-all"
                    value={newPrice ? formatNumber(newPrice) : ''}
                    onChange={(e) =>
                      setNewPrice(parseInt(e.target.value.replace(/\D/g, ''), 10) || 0)
                    }
                    placeholder="e.g. 750"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <ExportCardWrapper fileName={`kalkulator-average-${result.avgPrice}`} calculatorType="average">
          <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sub-purple text-acc-purple">
                <Layers size={20} />
              </div>
              <span className="font-bold text-main">Ringkasan Posisi Saham</span>
            </div>
            <span className="text-xs font-bold text-acc-purple bg-sub-purple px-2.5 py-1 rounded-lg">
              {result.rowCount} Transaksi Beli
            </span>
          </div>

          <div className="bg-gradient-to-r from-acc-purple to-acc-purple/90 text-white rounded-2xl p-5 flex items-center justify-between shadow-md shadow-acc-purple/10">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-85">Harga Rata-Rata (Average Price)</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-1">{formatIDR(result.avgPrice)}</div>
            </div>
            <div>
              <Layers size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
            <div className="bg-sub-purple text-acc-purple rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Total Pemilikan Lot</span>
              <span className="text-base font-extrabold block text-main">{formatNumber(result.totalLot)} Lot</span>
            </div>
            <div className="bg-sub-purple text-acc-purple rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Total Lembar Saham</span>
              <span className="text-base font-extrabold block text-main">{formatNumber(result.totalLembar)} lembar</span>
            </div>
          </div>

          <div className="bg-sub-slate text-sub rounded-2xl p-4 space-y-1 mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Total Modal Pembelian (Investasi)</span>
            <span className="text-xl font-extrabold block text-main">
              {formatIDR(result.totalInvestment)}
            </span>
          </div>

          {neededLots > 0 && (
            <div className="bg-sub-green border border-acc-green rounded-2xl p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-muted">Rekomendasi Beli Baru Untuk Target Avg</span>
              <div className="text-base font-extrabold text-acc-green">
                Beli +{formatNumber(neededLots)} Lot ({formatNumber(neededLots * 100)} lembar) pada
                harga {formatIDR(newPrice)}
              </div>
              <span className="text-[11px] text-muted block">
                Tambahan modal dibutuhkan: {formatIDR(neededCapital)}
              </span>
            </div>
          )}
        </ExportCardWrapper>
      </div>
    </section>
  );
}
