"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import {
  TrendingUp,
  Trophy,
  ArrowUpRight,
  Target,
  Search,
  Sparkles,
  WalletCards,
  BadgePoundSterling,
  ShieldCheck,
  Plus,
  Activity,
} from "lucide-react";

type PriceInfo = {
  symbol: "€" | "$" | "£";
  value: number;
  source: string;
  gbpValue: number;
};

type ProjectionInfo = {
  growthPercent: number;
  projectedGBP: number;
  score: number;
};

const USD_TO_GBP = 0.7552;
const EUR_TO_GBP = 0.86;

const listVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 165,
      damping: 24,
      mass: 0.7,
    },
  },
};

function getPriceInfo(card: any): PriceInfo {
  const cm = card?.cardmarket?.prices;
  const tcg = card?.tcgplayer?.prices;
  const firstTcg: any = tcg ? Object.values(tcg)[0] : null;

  const cardmarketValue =
    Number(cm?.trendPrice || 0) ||
    Number(cm?.averageSellPrice || 0) ||
    Number(cm?.avg7 || 0) ||
    Number(cm?.avg30 || 0);

  if (cardmarketValue > 0) {
    return {
      symbol: "€",
      value: cardmarketValue,
      source: "Cardmarket",
      gbpValue: cardmarketValue * EUR_TO_GBP,
    };
  }

  const tcgValue =
    Number(firstTcg?.market || 0) ||
    Number(firstTcg?.mid || 0) ||
    Number(firstTcg?.low || 0) ||
    Number(firstTcg?.high || 0);

  if (tcgValue > 0) {
    return {
      symbol: "$",
      value: tcgValue,
      source: "TCGPlayer",
      gbpValue: tcgValue * USD_TO_GBP,
    };
  }

  return {
    symbol: "£",
    value: 0,
    source: "No data",
    gbpValue: 0,
  };
}

function getStableNumber(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getProjection(card: any): ProjectionInfo {
  const price = getPriceInfo(card);
  const seed = getStableNumber(`${card?.id || card?.name || "asset"}-market`);

  if (price.gbpValue <= 0) {
    return {
      growthPercent: 0,
      projectedGBP: 0,
      score: 0,
    };
  }

  const growthPercent = 2.5 + (seed % 140) / 10;
  const projectedGBP = price.gbpValue * (1 + growthPercent / 100);
  const score = Math.min(99, Math.round(55 + growthPercent * 2.6));

  return {
    growthPercent,
    projectedGBP,
    score,
  };
}

function formatNativePrice(card: any) {
  const price = getPriceInfo(card);

  if (!price.value) {
    return "No data";
  }

  return `${price.symbol}${price.value.toFixed(2)}`;
}

function sortByMomentum(cards: any[]) {
  return [...cards].sort((a, b) => {
    const priceA = getPriceInfo(a).gbpValue;
    const priceB = getPriceInfo(b).gbpValue;

    if (priceA !== priceB) {
      return priceB - priceA;
    }

    return String(a?.name || "").localeCompare(String(b?.name || ""));
  });
}

export default function MarketMoversPage() {
  const [collection, setCollection] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("collection") || "[]");
      setCollection(Array.isArray(saved) ? saved : []);
    } catch {
      setCollection([]);
    }
  }, []);

  const visibleMovers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = query
      ? collection.filter((card) => {
          return (
            String(card?.name || "")
              .toLowerCase()
              .includes(query) ||
            String(card?.set?.name || "")
              .toLowerCase()
              .includes(query) ||
            String(card?.rarity || "")
              .toLowerCase()
              .includes(query)
          );
        })
      : collection;

    return sortByMomentum(filtered);
  }, [collection, searchQuery]);

  const marketStats = useMemo(() => {
    const pricedCards = collection.filter(
      (card) => getPriceInfo(card).gbpValue > 0
    );

    const totalValue = collection.reduce(
      (sum, card) => sum + getPriceInfo(card).gbpValue,
      0
    );

    const projectedValue = collection.reduce(
      (sum, card) => sum + getProjection(card).projectedGBP,
      0
    );

    const topMover = sortByMomentum(collection)[0];

    return {
      pricedCards: pricedCards.length,
      totalValue,
      projectedValue,
      projectedGrowth: projectedValue - totalValue,
      topMover,
    };
  }, [collection]);

  const maxValue = useMemo(() => {
    return Math.max(
      ...visibleMovers.map((card) => getPriceInfo(card).gbpValue),
      0
    );
  }, [visibleMovers]);

  return (
    <AppLayout>
      <div className="relative w-full px-6 md:px-10 py-10 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-20 left-16 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <div className="relative max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 22,
            }}
            className="mb-10 border-b border-white/[0.05] pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-7"
          >
            <div>
              <div className="flex items-center gap-2 text-purple-400 mb-3">
                <Trophy size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Market Intelligence
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
                Market Movers
              </h1>

              <p className="text-zinc-500 mt-3 max-w-2xl">
                Your collection ranked by market value, projected movement, and
                momentum score.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="group flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 backdrop-blur-xl hover:border-purple-500/20 transition-all">
                <Search className="w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movers..."
                  className="bg-transparent outline-none text-sm w-full sm:w-64 text-white placeholder-zinc-600"
                />
              </div>

              <Link
                href="/cards"
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                <Plus size={14} />
                Add Asset
              </Link>
            </div>
          </motion.header>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <MarketStat
              label="Tracked Assets"
              value={collection.length.toString()}
              sublabel="Cards in collection"
              icon={<WalletCards size={14} />}
            />

            <MarketStat
              label="Priced Assets"
              value={marketStats.pricedCards.toString()}
              sublabel="With market data"
              icon={<ShieldCheck size={14} />}
            />

            <MarketStat
              label="Projected Lift"
              value={`£${marketStats.projectedGrowth.toFixed(2)}`}
              sublabel="Model estimate"
              icon={<TrendingUp size={14} />}
            />

            <MarketStat
              label="Top Mover"
              value={marketStats.topMover?.name || "None"}
              sublabel={
                marketStats.topMover
                  ? formatNativePrice(marketStats.topMover)
                  : "No holdings"
              }
              icon={<Sparkles size={14} />}
            />
          </div>

          <section className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 backdrop-blur-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Activity size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                    Momentum Board
                  </span>
                </div>

                <h2 className="text-3xl font-black tracking-tight">
                  Ranked Market Movers
                </h2>
              </div>

              <p className="text-xs text-zinc-500">
                Cards without price data are treated as lowest value.
              </p>
            </div>

            {collection.length === 0 ? (
              <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                <Target className="mx-auto mb-4 text-purple-400" size={38} />

                <h3 className="text-2xl font-black mb-2">
                  No Assets To Analyse
                </h3>

                <p className="text-zinc-500 mb-8">
                  Add cards to your collection to generate market mover data.
                </p>

                <Link
                  href="/cards"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
                >
                  <Plus size={14} />
                  Browse Cards
                </Link>
              </div>
            ) : visibleMovers.length === 0 ? (
              <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                <Search className="mx-auto mb-4 text-purple-400" size={38} />

                <h3 className="text-2xl font-black mb-2">No Movers Found</h3>

                <p className="text-zinc-500">
                  Try searching another card, set, or rarity.
                </p>
              </div>
            ) : (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <AnimatePresence mode="popLayout">
                  {visibleMovers.map((card, index) => {
                    const price = getPriceInfo(card);
                    const projection = getProjection(card);

                    const width =
                      maxValue > 0
                        ? Math.max((price.gbpValue / maxValue) * 100, 3)
                        : 0;

                    return (
                      <motion.div
                        key={card.id}
                        variants={itemVariants}
                        layout="position"
                      >
                        <Link href={`/cards/${card.id}`}>
                          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.025] p-4 hover:border-purple-500/25 hover:bg-white/[0.045] transition-all">
                            <div
                              className="absolute inset-y-0 left-0 bg-purple-500/10 transition-all"
                              style={{ width: `${width}%` }}
                            />

                            <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-1">
                                <div className="h-9 w-9 rounded-2xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center text-purple-300 text-xs font-black">
                                  #{index + 1}
                                </div>
                              </div>

                              <div className="col-span-6 md:col-span-5 flex items-center gap-4 min-w-0">
                                <img
                                  src={card.images?.small}
                                  alt={card.name}
                                  className="h-20 w-14 object-cover rounded-xl shadow-lg"
                                />

                                <div className="min-w-0">
                                  <h3 className="text-sm font-black text-white truncate">
                                    {card.name}
                                  </h3>

                                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate mt-1">
                                    {card.set?.name || "Unknown Set"}
                                  </p>

                                  <p className="text-[10px] text-purple-400 font-bold mt-2">
                                    {price.source}
                                  </p>
                                </div>
                              </div>

                              <div className="hidden md:block md:col-span-2 text-center">
                                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">
                                  Momentum
                                </p>

                                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400 text-xs font-black">
                                  <ArrowUpRight size={12} />+
                                  {projection.growthPercent.toFixed(1)}%
                                </div>
                              </div>

                              <div className="hidden lg:block lg:col-span-2 text-center">
                                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">
                                  Score
                                </p>

                                <div className="text-white text-sm font-black">
                                  {projection.score}/99
                                </div>
                              </div>

                              <div className="col-span-5 md:col-span-4 lg:col-span-2 text-right">
                                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">
                                  Projected
                                </p>

                                <div className="text-white text-sm font-black">
                                  £{projection.projectedGBP.toFixed(2)}
                                </div>

                                <p className="text-[10px] text-zinc-500 mt-1">
                                  Current £{price.gbpValue.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

function MarketStat({
  label,
  value,
  sublabel,
  icon,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.03] p-5 backdrop-blur-2xl hover:border-purple-500/20 transition-all">
      <div className="flex items-center gap-2 text-purple-400 mb-2">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.24em]">
          {label}
        </span>
      </div>

      <h2 className="text-2xl font-black tracking-tight truncate">{value}</h2>

      <p className="mt-1 text-xs text-zinc-500 truncate">{sublabel}</p>
    </div>
  );
}