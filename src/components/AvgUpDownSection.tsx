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
    // Equation: (currentInvestment + neededLot*100*newPrice) / (currentLembar + neededLot*100) = targetAvg
    // => currentInvestment + neededLot*100*newPrice = targetAvg*currentLembar + targetAvg*neededLot*100
    // => neededLot*100*(newPrice - targetAvg) = targetAvg*currentLembar - currentInvestment
    // => neededLot = (targetAvg*currentLembar - currentInvestment) / (100 * (newPrice - targetAvg))
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
    <section id="avg-up-down" className="calculator-section">
      <div className="section-header">
        <div className="section-breadcrumb">Kalkulator #2</div>
        <h2 className="section-title">
          <div className="section-badge-icon" style={{ background: 'var(--accent-purple)' }}>
            <Layers size={20} />
          </div>
          Simulasi Average Up / Down
        </h2>
      </div>

      <div className="calculator-grid">
        {/* Left Input Card */}
        <div className="flat-card">
          <div>
            <div className="card-top">
              <div className="card-title-group">
                <div
                  className="card-title-icon"
                  style={{ background: 'var(--bg-sub-purple)', color: 'var(--accent-purple)' }}
                >
                  <Layers size={20} />
                </div>
                <span className="card-title-text">Daftar Transaksi Pembelian</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {rows.map((row, idx) => (
                <div
                  key={row.id || idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr auto',
                    gap: '0.65rem',
                    alignItems: 'end',
                    background: 'var(--bg-sub-slate)',
                    padding: '0.75rem',
                    borderRadius: '12px',
                  }}
                >
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>
                      Harga Beli #{idx + 1}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      value={row.price ? formatNumber(row.price) : ''}
                      onChange={(e) => handleUpdateRow(idx, 'price', e.target.value)}
                      placeholder="e.g. 1000"
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>
                      Lot
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      value={row.lot ? formatNumber(row.lot) : ''}
                      onChange={(e) => handleUpdateRow(idx, 'lot', e.target.value)}
                      placeholder="e.g. 10"
                    />
                  </div>

                  {rows.length > 1 && (
                    <button
                      onClick={() => handleRemoveRow(idx)}
                      className="btn-icon-danger"
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
              className="btn-secondary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <Plus size={16} />
              <span>Tambah Baris Pembelian</span>
            </button>

            {/* Target Average Calculator Drawer */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px dashed var(--border-color)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem',
                }}
              >
                <Calculator size={16} color="var(--accent-purple)" />
                <span>Simulasi Target Price Average (Opsional)</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    Target Avg Diharapkan
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input"
                    value={targetAvg ? formatNumber(targetAvg) : ''}
                    onChange={(e) =>
                      setTargetAvg(parseInt(e.target.value.replace(/\D/g, ''), 10) || 0)
                    }
                    placeholder="e.g. 900"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    Harga Pembelian Baru
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input"
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
          <div className="card-top">
            <div className="card-title-group">
              <div
                className="card-title-icon"
                style={{ background: 'var(--bg-sub-purple)', color: 'var(--accent-purple)' }}
              >
                <Layers size={20} />
              </div>
              <span className="card-title-text">Ringkasan Posisi Saham</span>
            </div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-purple)',
                background: 'var(--bg-sub-purple)',
                padding: '0.25rem 0.65rem',
                borderRadius: '8px',
              }}
            >
              {result.rowCount} Transaksi Beli
            </span>
          </div>

          <div className="accent-banner purple">
            <div>
              <div className="accent-banner-label">Harga Rata-Rata (Average Price)</div>
              <div className="accent-banner-value">{formatIDR(result.avgPrice)}</div>
            </div>
            <div className="accent-banner-icon">
              <Layers size={24} />
            </div>
          </div>

          <div className="sub-grid">
            <div className="sub-box purple">
              <span className="sub-box-label">Total Pemilikan Lot</span>
              <span className="sub-box-val">{formatNumber(result.totalLot)} Lot</span>
            </div>
            <div className="sub-box purple">
              <span className="sub-box-label">Total Lembar Saham</span>
              <span className="sub-box-val">{formatNumber(result.totalLembar)} lembar</span>
            </div>
          </div>

          <div className="sub-box slate" style={{ marginBottom: '1rem' }}>
            <span className="sub-box-label">Total Modal Pembelian (Investasi)</span>
            <span className="sub-box-val" style={{ fontSize: '1.4rem' }}>
              {formatIDR(result.totalInvestment)}
            </span>
          </div>

          {neededLots > 0 && (
            <div className="sub-box green" style={{ border: '1px solid var(--accent-green)' }}>
              <span className="sub-box-label">Rekomendasi Beli Baru Untuk Target Avg</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                Beli +{formatNumber(neededLots)} Lot ({formatNumber(neededLots * 100)} lembar) pada
                harga {formatIDR(newPrice)}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                Tambahan modal dibutuhkan: {formatIDR(neededCapital)}
              </span>
            </div>
          )}
        </ExportCardWrapper>
      </div>
    </section>
  );
}
