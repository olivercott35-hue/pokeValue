"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import {
  TrendingUp,
  Award,
  LayoutGrid,
  BadgePoundSterling,
  Search,
  Sparkles,
  WalletCards,
  ShieldCheck,
  Plus,
} from "lucide-react";
import {
  useCurrency,
  type PriceSourceCurrency,
} from "@/components/CurrencyProvider";

type PriceInfo = {
  value: number;
  source: string;
  sourceCurrency: PriceSourceCurrency;
  gbpValue: number;
};

const USD_TO_GBP = 0.79;
const EUR_TO_GBP = 0.86;

const listVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
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
      value: cardmarketValue,
      source: "Cardmarket",
      sourceCurrency: "EUR",
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
      value: tcgValue,
      source: "TCGPlayer",
      sourceCurrency: "USD",
      gbpValue: tcgValue * USD_TO_GBP,
    };
  }

  return {
    value: 0,
    source: "No data",
    sourceCurrency: "GBP",
    gbpValue: 0,
  };
}

function sortByValue(cards: any[]) {
  return [...cards].sort((a, b) => {
    const valueA = getPriceInfo(a).gbpValue;
    const valueB = getPriceInfo(b).gbpValue;

    if (valueA !== valueB) {
      return valueB - valueA;
    }

    return String(a?.name || "").localeCompare(String(b?.name || ""));
  });
}

export default function PortfolioPage() {
  const { formatPrice } = useCurrency();

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

  const visibleHoldings = useMemo(() => {
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

    return sortByValue(filtered);
  }, [collection, searchQuery]);

  const portfolioStats = useMemo(() => {
    const totalValueGBP = collection.reduce(
      (sum, card) => sum + getPriceInfo(card).gbpValue,
      0
    );

    const pricedCards = collection.filter(
      (card) => getPriceInfo(card).gbpValue > 0
    );

    const averageValueGBP =
      collection.length > 0 ? totalValueGBP / collection.length : 0;

    const mostValuableCard = sortByValue(collection)[0];

    return {
      totalValueGBP,
      averageValueGBP,
      pricedCards: pricedCards.length,
      mostValuableCard,
    };
  }, [collection]);

  const maxVisibleValue = useMemo(() => {
    return Math.max(
      ...visibleHoldings.map((card) => getPriceInfo(card).gbpValue),
      0
    );
  }, [visibleHoldings]);

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
                <TrendingUp size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Portfolio Intelligence
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
                Portfolio
              </h1>

              <p className="text-zinc-500 mt-3 max-w-2xl">
                Strategic overview of your collection value, top assets, and
                holdings ranked by estimated market value.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="group flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 backdrop-blur-xl hover:border-purple-500/20 transition-all">
                <Search className="w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search holdings..."
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
            <MetricCard
              label="Total Valuation"
              value={formatPrice(portfolioStats.totalValueGBP, "GBP")}
              sublabel="Converted estimate"
              icon={<BadgePoundSterling size={14} />}
            />

            <MetricCard
              label="Assets Held"
              value={collection.length.toString()}
              sublabel="Cards in collection"
              icon={<LayoutGrid size={14} />}
            />

            <MetricCard
              label="Average Value"
              value={formatPrice(portfolioStats.averageValueGBP, "GBP")}
              sublabel="Across all assets"
              icon={<TrendingUp size={14} />}
            />

            <MetricCard
              label="Top Asset"
              value={portfolioStats.mostValuableCard?.name || "None"}
              sublabel={
                portfolioStats.mostValuableCard
                  ? formatPrice(
                      getPriceInfo(portfolioStats.mostValuableCard).value,
                      getPriceInfo(portfolioStats.mostValuableCard)
                        .sourceCurrency
                    )
                  : "No holdings"
              }
              icon={<Award size={14} />}
            />
          </div>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <MiniStat
              label="Priced Assets"
              value={portfolioStats.pricedCards.toString()}
              icon={<Sparkles size={14} />}
            />

            <MiniStat
              label="Visible Holdings"
              value={visibleHoldings.length.toString()}
              icon={<WalletCards size={14} />}
            />

            <MiniStat
              label="Portfolio Status"
              value={collection.length > 0 ? "Active" : "Empty"}
              icon={<ShieldCheck size={14} />}
            />
          </div>

          <section className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 backdrop-blur-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <WalletCards size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                    Asset Breakdown
                  </span>
                </div>

                <h2 className="text-3xl font-black tracking-tight">
                  Holdings Ranked By Value
                </h2>
              </div>

              <p className="text-xs text-zinc-500">
                Values are estimated from Cardmarket or TCGPlayer data when
                available.
              </p>
            </div>

            {collection.length === 0 ? (
              <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                <WalletCards
                  className="mx-auto mb-4 text-purple-400"
                  size={38}
                />

                <h3 className="text-2xl font-black mb-2">
                  No Assets In Portfolio
                </h3>

                <p className="text-zinc-500 mb-8">
                  Add cards to your collection to start tracking your portfolio.
                </p>

                <Link
                  href="/cards"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
                >
                  <Plus size={14} />
                  Browse Cards
                </Link>
              </div>
            ) : visibleHoldings.length === 0 ? (
              <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                <Search className="mx-auto mb-4 text-purple-400" size={38} />

                <h3 className="text-2xl font-black mb-2">No Holdings Found</h3>

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
                  {visibleHoldings.map((card) => {
                    const price = getPriceInfo(card);

                    const percentage =
                      maxVisibleValue > 0
                        ? Math.max((price.gbpValue / maxVisibleValue) * 100, 3)
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
                              style={{ width: `${percentage}%` }}
                            />

                            <div className="relative z-10 flex items-center justify-between gap-5">
                              <div className="flex items-center gap-4 min-w-0">
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

                              <div className="text-right shrink-0">
                                <p className="text-lg font-black text-white">
                                  {formatPrice(
                                    price.value,
                                    price.sourceCurrency
                                  )}
                                </p>

                                <p className="text-[10px] text-zinc-500 mt-1">
                                  {price.value > 0
                                    ? `Base ${formatPrice(
                                        price.gbpValue,
                                        "GBP"
                                      )}`
                                    : "No data"}
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

function MetricCard({
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

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-4 backdrop-blur-xl hover:border-purple-500/20 transition-all">
      <div className="flex items-center gap-2 text-purple-400 mb-1">
        {icon}

        <span className="text-[8px] font-black uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>

      <p className="text-xl font-black tracking-tight truncate">{value}</p>
    </div>
  );
}