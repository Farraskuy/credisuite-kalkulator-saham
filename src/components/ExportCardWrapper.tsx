'use client';

import React, { useRef, useState } from 'react';
import { Download, Share2, Check, TrendingUp } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  children: React.ReactNode;
  fileName: string;
  calculatorType: 'ara-arb' | 'average' | 'prediction';
}

export default function ExportCardWrapper({ children, fileName, calculatorType }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const logAction = async (action: 'download' | 'share') => {
    try {
      await fetch('/api/analytics/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculatorType, action }),
      });
    } catch {
      // Fail silently
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
      logAction('download');
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${fileName}.png`, { type: 'image/png' });

      logAction('share');

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Hasil Kalkulator Saham',
          text: 'Lihat simulasi perhitungan saham dari KalkulatorSaham.id',
        });
      } else {
        // Fallback to copying image or link
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div ref={cardRef} className="flat-card export-output-card">
        {children}

        {/* Watermark in Bottom-Left */}
        <div className="watermark-footer">
          <div className="watermark-badge">
            <TrendingUp size={14} />
            <span>KalkulatorSaham.id</span>
          </div>
          <span>Simulasi Saham BEI</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-primary"
          style={{ flex: 1 }}
        >
          <Download size={17} />
          <span>{downloading ? 'Membuat PNG...' : 'Unduh Gambar PNG'}</span>
        </button>

        <button
          onClick={handleShare}
          className="btn-secondary"
          title="Bagikan Gambar"
        >
          {copied ? <Check size={17} color="#059669" /> : <Share2 size={17} />}
          <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
        </button>
      </div>
    </div>
  );
}
