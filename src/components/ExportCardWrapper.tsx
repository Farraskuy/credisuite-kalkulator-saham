'use client';

import React, { useRef, useState } from 'react';
import { Download, Share2, Check, TrendingUp } from 'lucide-react';
import { toPng } from 'html-to-image';
import WebsiteBrand from './WebsiteBrand';

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
          text: 'Lihat simulasi perhitungan saham dari { window.location.hostname }',
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
      {/* Target export card container */}
      <div ref={cardRef} className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {children}

        {/* Watermark in Bottom-Left */}
        <div className="flex items-center justify-between text-[11px] text-muted border-t border-border-custom pt-4 mt-6">
          <div className="flex items-center gap-1.5 font-bold text-acc-blue">
            <i className="fa-solid fa-chart-line text-xs"></i>
            <WebsiteBrand />
          </div>
          <span>Simulasi Saham BEI</span>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-grow flex items-center justify-center gap-2 bg-acc-blue hover:bg-acc-blue/90 text-white font-bold py-3 px-6 rounded-2xl text-sm transition-all duration-200 shadow-md shadow-acc-blue/15 cursor-pointer disabled:opacity-50"
        >
          <Download size={17} />
          <span>{downloading ? 'Membuat PNG...' : 'Unduh Gambar PNG'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-card border border-border-custom text-main font-semibold py-3 px-5 rounded-2xl text-sm transition-all duration-200 hover:border-acc-blue hover:text-acc-blue cursor-pointer"
          title="Bagikan Gambar"
        >
          {copied ? <Check size={17} className="text-acc-green" /> : <Share2 size={17} />}
          <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
        </button>
      </div>
    </div>
  );
}
