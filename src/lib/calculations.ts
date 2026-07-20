export type Board = 'Utama' | 'Pengembangan' | 'Akselerasi' | 'Watchlist';

export interface FractionRule {
  minPrice: number;
  maxPrice: number;
  tick: number;
}

export interface AraArbRule {
  board: Board;
  minPrice?: number;
  maxPrice?: number;
  ara: number;
  arb: number;
}

// Default BEI Fraction rules
export const DEFAULT_FRACTION_RULES: FractionRule[] = [
  { minPrice: 1, maxPrice: 200, tick: 1 },
  { minPrice: 201, maxPrice: 500, tick: 2 },
  { minPrice: 501, maxPrice: 2000, tick: 5 },
  { minPrice: 2001, maxPrice: 5000, tick: 10 },
  { minPrice: 5001, maxPrice: Infinity, tick: 25 },
];

// Default ARA / ARB Percentage rules
export const DEFAULT_ARA_ARB_RULES: Record<string, { ara: number; arb: number }[]> = {
  Utama: [
    { ara: 35, arb: 15 }, // <= 200
    { ara: 25, arb: 15 }, // 201 - 5000
    { ara: 20, arb: 15 }, // > 5000
  ],
  Pengembangan: [
    { ara: 35, arb: 15 },
    { ara: 25, arb: 15 },
    { ara: 20, arb: 15 },
  ],
  Akselerasi: [{ ara: 10, arb: 10 }],
  Watchlist: [{ ara: 10, arb: 10 }],
};

export function getTickSize(price: number, rules: FractionRule[] = DEFAULT_FRACTION_RULES): number {
  if (price <= 0) return 1;
  const match = rules.find((r) => price >= r.minPrice && price <= r.maxPrice);
  if (match) return match.tick;
  if (price > 5000) return 25;
  return 1;
}

export function bulatkanHargaBEI(
  hargaExact: number,
  type: 'ceil' | 'floor' = 'ceil',
  rules: FractionRule[] = DEFAULT_FRACTION_RULES
): number {
  if (hargaExact <= 0) return 0;
  const tick = getTickSize(hargaExact, rules);
  if (type === 'ceil') {
    return Math.ceil(hargaExact / tick) * tick;
  } else {
    return Math.floor(hargaExact / tick) * tick;
  }
}

export function getAraArbPercentages(
  price: number,
  board: Board
): { araPercent: number; arbPercent: number } {
  if (board === 'Akselerasi' || board === 'Watchlist') {
    return { araPercent: 10, arbPercent: 10 };
  }
  if (price <= 200) {
    return { araPercent: 35, arbPercent: 15 };
  } else if (price <= 5000) {
    return { araPercent: 25, arbPercent: 15 };
  } else {
    return { araPercent: 20, arbPercent: 15 };
  }
}

export function calculateAraArb(
  previousPrice: number,
  board: Board,
  fractionRules: FractionRule[] = DEFAULT_FRACTION_RULES
) {
  if (previousPrice <= 0) {
    return { ara: 0, arb: 0, araPercent: 0, arbPercent: 0, araRaw: 0, arbRaw: 0 };
  }

  const { araPercent, arbPercent } = getAraArbPercentages(previousPrice, board);

  const araRaw = previousPrice * (1 + araPercent / 100);
  const arbRaw = previousPrice * (1 - arbPercent / 100);

  // Per aturan BEI:
  // ARA dibulatkan ke bawah (floor) ke tick terdekat
  // ARB dibulatkan ke atas (ceil) ke tick terdekat
  const ara = bulatkanHargaBEI(araRaw, 'floor', fractionRules);
  const arb = bulatkanHargaBEI(arbRaw, 'ceil', fractionRules);

  return {
    ara,
    arb,
    araPercent,
    arbPercent,
    araRaw,
    arbRaw,
  };
}

export interface PurchaseRow {
  id?: string;
  price: number;
  lot: number;
}

export function calculateAverage(rows: PurchaseRow[]) {
  const valid = rows.filter((r) => r.price > 0 && r.lot > 0);
  const totalLot = valid.reduce((acc, r) => acc + r.lot, 0);
  const totalLembar = totalLot * 100;
  const totalInvestment = valid.reduce((acc, r) => acc + r.price * r.lot * 100, 0);
  const avgPrice = totalLembar > 0 ? totalInvestment / totalLembar : 0;

  return {
    totalLot,
    totalLembar,
    totalInvestment,
    avgPrice: Math.round(avgPrice),
    avgPriceExact: avgPrice,
    rowCount: valid.length,
  };
}

export interface TargetPredictionInput {
  hargaBeli: number;
  lot: number;
  feeBeli: number; // in percent e.g. 0.15
  feeJual: number; // in percent e.g. 0.25
  targetUntungRp: number;
  targetRugiRp: number;
}

export function kalkulasiTargetSaham(
  input: TargetPredictionInput,
  fractionRules: FractionRule[] = DEFAULT_FRACTION_RULES
) {
  const { hargaBeli, lot, feeBeli, feeJual, targetUntungRp, targetRugiRp } = input;

  const pctFeeBeli = feeBeli / 100;
  const pctFeeJual = feeJual / 100;
  const pajakJual = 0.001; // 0.1% pajak final penjualan BEI

  const totalLembar = lot * 100;
  const totalModal = hargaBeli * totalLembar * (1 + pctFeeBeli);
  const pengaliJual = totalLembar * (1 - pctFeeJual - pajakJual);

  if (pengaliJual <= 0 || totalLembar <= 0) {
    return {
      rincian: { totalLembar: 0, totalModal: 0 },
      skenarioUntung: { hargaExact: 0, hargaBEI: 0, persentase: '0.00', labaBersihReal: 0 },
      skenarioRugi: { hargaExact: 0, hargaBEI: 0, persentase: '0.00', rugiBersihReal: 0 },
    };
  }

  // --- SKENARIO UNTUNG ---
  const hargaUntungExact = (totalModal + targetUntungRp) / pengaliJual;
  const hargaUntungBEI = bulatkanHargaBEI(hargaUntungExact, 'ceil', fractionRules);
  const nilaiBersihUntung = hargaUntungBEI * pengaliJual;
  const persentaseUntung = ((nilaiBersihUntung - totalModal) / totalModal) * 100;

  // --- SKENARIO RUGI ---
  const hargaRugiExact = (totalModal - targetRugiRp) / pengaliJual;
  const hargaRugiBEI = bulatkanHargaBEI(hargaRugiExact, 'floor', fractionRules);
  const nilaiBersihRugi = hargaRugiBEI * pengaliJual;
  const persentaseRugi = ((nilaiBersihRugi - totalModal) / totalModal) * 100;

  return {
    rincian: {
      totalLembar,
      totalModal,
    },
    skenarioUntung: {
      hargaExact: hargaUntungExact,
      hargaBEI: hargaUntungBEI,
      persentase: persentaseUntung.toFixed(2),
      labaBersihReal: nilaiBersihUntung - totalModal,
    },
    skenarioRugi: {
      hargaExact: hargaRugiExact,
      hargaBEI: hargaRugiBEI,
      persentase: persentaseRugi.toFixed(2),
      rugiBersihReal: totalModal - nilaiBersihRugi,
    },
  };
}

export function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}