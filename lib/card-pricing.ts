export type PriceSourceCurrency = "GBP" | "USD" | "EUR";

export type MarketplacePricePoint = {
  label: string;
  value: number;
};

export type ResolvedCardPrice = {
  market: number;
  low: number;
  average: number;
  highestReference: number;
  gbpValue: number;
  source: "Cardmarket" | "TCGplayer" | "No market data";
  sourceCurrency: PriceSourceCurrency;
  sourceUrl: string | null;
  updatedAt: string | null;
  variantKey: string | null;
  variantLabel: string;
  label: string;
  referenceValues: MarketplacePricePoint[];
};

export type ResolvedCardTrend = {
  direction: "up" | "down" | "flat";
  changePercent: number | null;
  label: string;
};

type PriceShape = {
  low?: number;
  mid?: number;
  high?: number;
  market?: number;
  directLow?: number;
};

type CardLike = {
  tcgplayer?: {
    url?: string;
    updatedAt?: string;
    prices?: Record<string, PriceShape>;
  };
  cardmarket?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
    };
  };
};

export const PRICE_CONVERSION_TO_GBP: Record<PriceSourceCurrency, number> = {
  GBP: 1,
  USD: 0.79,
  EUR: 0.86,
};

const TCGPLAYER_VARIANT_PRIORITY: Array<{
  key: string;
  label: string;
}> = [
  { key: "holofoil", label: "Holofoil" },
  { key: "normal", label: "Normal" },
  { key: "unlimitedHolofoil", label: "Unlimited holofoil" },
  { key: "unlimitedNormal", label: "Unlimited normal" },
  { key: "1stEditionHolofoil", label: "1st edition holofoil" },
  { key: "1stEditionNormal", label: "1st edition normal" },
  { key: "reverseHolofoil", label: "Reverse holofoil" },
];

function validNumber(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function firstPositive(...values: unknown[]) {
  for (const value of values) {
    const parsed = validNumber(value);
    if (parsed > 0) return parsed;
  }

  return 0;
}

function makeReferenceValues(
  entries: Array<[string, unknown]>
): MarketplacePricePoint[] {
  return entries
    .map(([label, rawValue]) => ({
      label,
      value: validNumber(rawValue),
    }))
    .filter((item) => item.value > 0);
}

function resolveCardmarketPrice(card: CardLike): ResolvedCardPrice | null {
  const prices = card.cardmarket?.prices;

  if (!prices) return null;

  const market = firstPositive(
    prices.trendPrice,
    prices.averageSellPrice,
    prices.avg7,
    prices.avg30
  );

  if (market <= 0) return null;

  const referenceValues = makeReferenceValues([
    ["30-day average", prices.avg30],
    ["7-day average", prices.avg7],
    ["1-day average", prices.avg1],
    ["Average sale", prices.averageSellPrice],
    ["Trend price", prices.trendPrice],
    ["Low listing", prices.lowPrice],
  ]);

  const values = referenceValues.map((item) => item.value);
  const low = firstPositive(prices.lowPrice, Math.min(...values), market);
  const average = firstPositive(
    prices.averageSellPrice,
    prices.avg7,
    prices.avg30,
    market
  );
  const highestReference = values.length ? Math.max(...values) : market;

  return {
    market,
    low,
    average,
    highestReference,
    gbpValue: market * PRICE_CONVERSION_TO_GBP.EUR,
    source: "Cardmarket",
    sourceCurrency: "EUR",
    sourceUrl: card.cardmarket?.url || null,
    updatedAt: card.cardmarket?.updatedAt || null,
    variantKey: "cardmarket-trend",
    variantLabel: "Trend price",
    label: "Cardmarket trend price",
    referenceValues,
  };
}

function resolveTcgplayerPrice(card: CardLike): ResolvedCardPrice | null {
  const prices = card.tcgplayer?.prices;

  if (!prices) return null;

  let selectedKey: string | null = null;
  let selectedLabel = "Market";
  let selectedPrice: PriceShape | undefined;

  for (const option of TCGPLAYER_VARIANT_PRIORITY) {
    const candidate = prices[option.key];

    if (validNumber(candidate?.market) > 0) {
      selectedKey = option.key;
      selectedLabel = option.label;
      selectedPrice = candidate;
      break;
    }
  }

  if (!selectedPrice) {
    const fallback = Object.entries(prices)
      .map(([key, price]) => ({
        key,
        price,
        market: validNumber(price?.market),
      }))
      .filter((item) => item.market > 0)
      .sort((a, b) => b.market - a.market)[0];

    if (fallback) {
      selectedKey = fallback.key;
      selectedLabel = fallback.key;
      selectedPrice = fallback.price;
    }
  }

  if (!selectedPrice) return null;

  const market = validNumber(selectedPrice.market);

  if (market <= 0) return null;

  const referenceValues = makeReferenceValues([
    ["Low", selectedPrice.low],
    ["Mid", selectedPrice.mid],
    ["Market", selectedPrice.market],
    ["High", selectedPrice.high],
  ]);
  const values = referenceValues.map((item) => item.value);
  const low = firstPositive(selectedPrice.low, Math.min(...values), market);
  const average = firstPositive(selectedPrice.mid, market);
  const highestReference = values.length ? Math.max(...values) : market;

  return {
    market,
    low,
    average,
    highestReference,
    gbpValue: market * PRICE_CONVERSION_TO_GBP.USD,
    source: "TCGplayer",
    sourceCurrency: "USD",
    sourceUrl: card.tcgplayer?.url || null,
    updatedAt: card.tcgplayer?.updatedAt || null,
    variantKey: selectedKey,
    variantLabel: selectedLabel,
    label: `TCGplayer ${selectedLabel.toLowerCase()} market`,
    referenceValues,
  };
}

/**
 * PokeValue uses one deterministic pricing rule everywhere:
 * Cardmarket first for a UK/EU audience, then one clearly labelled available TCGplayer variant.
 */
export function getResolvedCardPrice(card: CardLike): ResolvedCardPrice {
  return (
    resolveCardmarketPrice(card) ||
    resolveTcgplayerPrice(card) || {
      market: 0,
      low: 0,
      average: 0,
      highestReference: 0,
      gbpValue: 0,
      source: "No market data",
      sourceCurrency: "GBP",
      sourceUrl: null,
      updatedAt: null,
      variantKey: null,
      variantLabel: "No market data",
      label: "No market data",
      referenceValues: [],
    }
  );
}

export function getResolvedCardTrend(card: CardLike): ResolvedCardTrend {
  const prices = card.cardmarket?.prices;
  const trendPrice = validNumber(prices?.trendPrice);
  const sevenDayAverage = validNumber(prices?.avg7);

  if (!trendPrice || !sevenDayAverage) {
    return {
      direction: "flat",
      changePercent: null,
      label: "No comparable trend data",
    };
  }

  const changePercent =
    ((trendPrice - sevenDayAverage) / sevenDayAverage) * 100;

  if (Math.abs(changePercent) < 1.5) {
    return {
      direction: "flat",
      changePercent,
      label: "Trend price is close to the 7-day average",
    };
  }

  return {
    direction: changePercent > 0 ? "up" : "down",
    changePercent,
    label: "Trend price compared with the 7-day average",
  };
}

export function getCardPriceGBP(card: CardLike) {
  return getResolvedCardPrice(card).gbpValue;
}
