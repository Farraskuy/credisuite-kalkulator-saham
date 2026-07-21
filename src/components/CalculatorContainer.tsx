'use client';

import React, { useState } from 'react';
import AraArbSection from './AraArbSection';
import AvgUpDownSection from './AvgUpDownSection';
import PredictionSection from './PredictionSection';
import { FractionRule } from '@/lib/calculations';

interface Props {
  fractionRules?: FractionRule[];
  tax?: number;
}

export default function CalculatorContainer({ fractionRules, tax = 0.0 }: Props) {
  const [ticker, setTicker] = useState<string>('BBRI');

  const handleTickerChange = (newTicker: string) => {
    setTicker(newTicker);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: ARA / ARB */}
      <AraArbSection
        fractionRules={fractionRules}
        ticker={ticker}
        onTickerChange={handleTickerChange}
      />

      {/* SECTION 2: AVERAGE UP / DOWN */}
      <AvgUpDownSection
        ticker={ticker}
        onTickerChange={handleTickerChange}
      />

      {/* SECTION 3: PREDIKSI TARGET JUAL / BELI */}
      <PredictionSection
        fractionRules={fractionRules}
        tax={tax}
        ticker={ticker}
        onTickerChange={handleTickerChange}
      />
    </div>
  );
}
