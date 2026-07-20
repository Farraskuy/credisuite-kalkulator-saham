'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { kalkulasiTargetSaham, formatIDR, formatNumber, FractionRule } from '@/lib/calculations';
import ExportCardWrapper from './ExportCardWrapper';

interface Props {
  fractionRules?: FractionRule[];
}

export default function PredictionSection({ fractionRules }: Props) {
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
    },
    fractionRules
  );

  const handleNumChange = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setter(rawVal ? parseInt(rawVal, 10) : 0);
  };

  return (
    <section id="prediction" className="calculator-section">
      <div className="section-header">
        <div className="section-breadcrumb">Kalkulator #3</div>
        <h2 className="section-title">
          <div className="section-badge-icon" style={{ background: 'var(--accent-green)' }}>
            <Target size={20} />
          </div>
          Prediksi Jual / Beli & Target Untung Rugi
        </h2>
      </div>

      <div className="calculator-grid">
        {/* Left Form Card */}
        <div className="flat-card">
          <div>
            <div className="card-top">
              <div className="card-title-group">
                <div
                  className="card-title-icon"
                  style={{ background: 'var(--bg-sub-green)', color: 'var(--accent-green)' }}
                >
                  <Target size={20} />
                </div>
                <span className="card-title-text">Parameter Target & Fee</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label htmlFor="pred-price" className="form-label">
                  Harga Beli Saham (Rp)
                </label>
                <input
                  id="pred-price"
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  value={hargaBeli ? formatNumber(hargaBeli) : ''}
                  onChange={handleNumChange(setHargaBeli)}
                  placeholder="e.g. 1000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pred-lot" className="form-label">
                  Jumlah Lot
                </label>
                <input
                  id="pred-lot"
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  value={lot ? formatNumber(lot) : ''}
                  onChange={handleNumChange(setLot)}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label htmlFor="pred-feebeli" className="form-label">
                  Fee Beli Sekuritas (%)
                </label>
                <input
                  id="pred-feebeli"
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={feeBeli}
                  onChange={(e) => setFeeBeli(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pred-feejual" className="form-label">
                  Fee Jual Sekuritas (%)
                </label>
                <input
                  id="pred-feejual"
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={feeJual}
                  onChange={(e) => setFeeJual(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label htmlFor="pred-profit" className="form-label">
                  Target Untung (Rp)
                </label>
                <input
                  id="pred-profit"
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  value={targetUntungRp ? formatNumber(targetUntungRp) : ''}
                  onChange={handleNumChange(setTargetUntungRp)}
                  placeholder="e.g. 250000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pred-loss" className="form-label">
                  Batas Maksimal Rugi (Rp)
                </label>
                <input
                  id="pred-loss"
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  value={targetRugiRp ? formatNumber(targetRugiRp) : ''}
                  onChange={handleNumChange(setTargetRugiRp)}
                  placeholder="e.g. 100000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <ExportCardWrapper fileName={`kalkulator-prediksi-target-${hargaBeli}`} calculatorType="prediction">
          <div className="card-top">
            <div className="card-title-group">
              <div
                className="card-title-icon"
                style={{ background: 'var(--bg-sub-green)', color: 'var(--accent-green)' }}
              >
                <DollarSign size={20} />
              </div>
              <span className="card-title-text">Hasil Proyeksi Transaksi</span>
            </div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-green)',
                background: 'var(--bg-sub-green)',
                padding: '0.25rem 0.65rem',
                borderRadius: '8px',
              }}
            >
              {formatNumber(result.rincian.totalLembar)} Lembar Saham
            </span>
          </div>

          <div className="accent-banner green">
            <div>
              <div className="accent-banner-label">Total Modal Pembelian (+ Fee Beli)</div>
              <div className="accent-banner-value">{formatIDR(result.rincian.totalModal)}</div>
            </div>
            <div className="accent-banner-icon">
              <DollarSign size={24} />
            </div>
          </div>

          {/* Skenario Untung Box */}
          <div
            style={{
              background: 'var(--bg-sub-green)',
              borderRadius: '14px',
              padding: '1rem',
              marginBottom: '0.85rem',
              border: '1px solid var(--accent-green)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 800,
                  color: 'var(--accent-green)',
                }}
              >
                <TrendingUp size={18} />
                <span>SKENARIO TARGET UNTUNG (TAKE PROFIT)</span>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--accent-green)', fontSize: '0.95rem' }}>
                +{result.skenarioUntung.persentase}%
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <span className="sub-box-label">Harga Jual Valid BEI (Ceil)</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {formatIDR(result.skenarioUntung.hargaBEI)}
                </div>
              </div>
              <div>
                <span className="sub-box-label">Profit Bersih Real</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                  +{formatIDR(result.skenarioUntung.labaBersihReal)}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Harga Exact Matematik: {formatIDR(result.skenarioUntung.hargaExact)}
            </div>
          </div>

          {/* Skenario Rugi Box */}
          <div
            style={{
              background: 'var(--bg-sub-pink)',
              borderRadius: '14px',
              padding: '1rem',
              border: '1px solid var(--accent-pink)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 800,
                  color: 'var(--accent-pink)',
                }}
              >
                <TrendingDown size={18} />
                <span>SKENARIO BATAS RUGI (STOP LOSS)</span>
              </div>
              <span style={{ fontWeight: 800, color: 'var(--accent-pink)', fontSize: '0.95rem' }}>
                {result.skenarioRugi.persentase}%
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <span className="sub-box-label">Harga Jual Valid BEI (Floor)</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {formatIDR(result.skenarioRugi.hargaBEI)}
                </div>
              </div>
              <div>
                <span className="sub-box-label">Rugi Bersih Real</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-pink)' }}>
                  -{formatIDR(result.skenarioRugi.rugiBersihReal)}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Harga Exact Matematik: {formatIDR(result.skenarioRugi.hargaExact)}
            </div>
          </div>
        </ExportCardWrapper>
      </div>
    </section>
  );
}
