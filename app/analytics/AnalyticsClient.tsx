"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { getResolvedCardPrice } from "@/lib/card-pricing";
import {
  PieChart,
  TrendingUp,
  Star,
  Layers,
  Activity,
  Search,
  WalletCards,
  BadgePoundSterling,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Plus,
} from "lucide-react";

type PriceInfo = {
  symbol: "€" | "$" | "£";
  value: number;
  source: string;
  gbpValue: number;
};

type DistributionItem = {
  name: string;
  count: number;
  percentage: number;
};


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
  const price = getResolvedCardPrice(card);
  const symbol =
    price.sourceCurrency === "EUR"
      ? "€"
      : price.sourceCurrency === "USD"
        ? "$"
        : "£";

  return {
    symbol,
    value: price.market,
    source: price.source,
    gbpValue: price.gbpValue,
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

function makeDistribution(cards: any[], getter: (card: any) => string) {
  const counts = cards.reduce((acc: Record<string, number>, card: any) => {
    const key = getter(card) || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const total = cards.length || 1;

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

export default function AnalyticsClient() {
  const [collection, setCollection] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const savedCollection = JSON.parse(
        localStorage.getItem("collection") || "[]"
      );

      const savedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      setCollection(Array.isArray(savedCollection) ? savedCollection : []);
      setFavorites(Array.isArray(savedFavorites) ? savedFavorites : []);
    } catch {
      setCollection([]);
      setFavorites([]);
    }
  }, []);

  const visibleTopCards = useMemo(() => {
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

    return sortByValue(filtered).slice(0, 10);
  }, [collection, searchQuery]);

  const analytics = useMemo(() => {
    const portfolioValueGBP = collection.reduce(
      (sum, card) => sum + getPriceInfo(card).gbpValue,
      0
    );

    const pricedCards = collection.filter(
      (card) => getPriceInfo(card).gbpValue > 0
    );

    const averageCardValueGBP =
      collection.length > 0 ? portfolioValueGBP / collection.length : 0;

    const setDistribution = makeDistribution(
      collection,
      (card) => card?.set?.name || "Unknown Set"
    );

    const rarityDistribution = makeDistribution(
      collection,
      (card) => card?.rarity || "Unknown Rarity"
    );

    return {
      portfolioValueGBP,
      averageCardValueGBP,
      pricedCards: pricedCards.length,
      setDistribution,
      rarityDistribution,
      largestSet: setDistribution[0],
      mostCommonRarity: rarityDistribution[0],
      uniqueSets: setDistribution.length,
    };
  }, [collection]);

  const maxTopValue = useMemo(() => {
    return Math.max(
      ...visibleTopCards.map((card) => getPriceInfo(card).gbpValue),
      0
    );
  }, [visibleTopCards]);

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
                <BarChart3 size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Portfolio Analytics
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
                Analytics
              </h1>

              <p className="text-zinc-500 mt-3 max-w-2xl">
                Performance, distribution, valuation, and collection insights
                across your saved assets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="group flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 backdrop-blur-xl hover:border-purple-500/20 transition-all">
                <Search className="w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search analytics..."
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
              label="Portfolio Value"
              value={`£${analytics.portfolioValueGBP.toFixed(2)}`}
              sublabel="Converted estimate"
              icon={<BadgePoundSterling size={14} />}
            />

            <MetricCard
              label="Cards Owned"
              value={collection.length.toString()}
              sublabel="Collection assets"
              icon={<Layers size={14} />}
            />

            <MetricCard
              label="Favorites"
              value={favorites.length.toString()}
              sublabel="Pinned cards"
              icon={<Star size={14} />}
            />

            <MetricCard
              label="Average Value"
              value={`£${analytics.averageCardValueGBP.toFixed(2)}`}
              sublabel="Across all assets"
              icon={<Activity size={14} />}
            />
          </div>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <MiniStat
              label="Priced Assets"
              value={analytics.pricedCards.toString()}
              icon={<ShieldCheck size={14} />}
            />

            <MiniStat
              label="Unique Sets"
              value={analytics.uniqueSets.toString()}
              icon={<PieChart size={14} />}
            />

            <MiniStat
              label="Largest Set"
              value={analytics.largestSet?.name || "None"}
              icon={<Sparkles size={14} />}
            />
          </div>

          <div className="grid xl:grid-cols-12 gap-8">
            <section className="xl:col-span-7 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 backdrop-blur-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                      Top Holdings
                    </span>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight">
                    Top 10 Most Valuable
                  </h2>
                </div>

                <p className="text-xs text-zinc-500">
                  Cards without price data are treated as lowest value.
                </p>
              </div>

              {collection.length === 0 ? (
                <EmptyState
                  title="No Analytics Yet"
                  body="Add cards to your collection to generate analytics."
                />
              ) : visibleTopCards.length === 0 ? (
                <EmptyState
                  title="No Cards Found"
                  body="Try searching another card, set, or rarity."
                />
              ) : (
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleTopCards.map((card, index) => {
                      const price = getPriceInfo(card);

                      const percentage =
                        maxTopValue > 0
                          ? Math.max((price.gbpValue / maxTopValue) * 100, 3)
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
                                  <div className="h-9 w-9 rounded-2xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center text-purple-300 text-xs font-black shrink-0">
                                    #{index + 1}
                                  </div>

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
                                    £{price.gbpValue.toFixed(2)}
                                  </p>

                                  <p className="text-[10px] text-zinc-500 mt-1">
                                    {price.value > 0
                                      ? `${price.symbol}${price.value.toFixed(
                                          2
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

            <div className="xl:col-span-5 space-y-8">
              <DistributionPanel
                title="Collection Distribution"
                subtitle="Most represented sets"
                icon={<PieChart size={14} />}
                items={analytics.setDistribution.slice(0, 6)}
              />

              <DistributionPanel
                title="Rarity Distribution"
                subtitle="Most common card rarities"
                icon={<Sparkles size={14} />}
                items={analytics.rarityDistribution.slice(0, 6)}
              />

              <section className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl">
                <div className="flex items-center gap-2 text-purple-400 mb-4">
                  <Activity size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                    Summary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
                  <SummaryItem
                    label="Largest Set"
                    value={analytics.largestSet?.name || "-"}
                  />

                  <SummaryItem
                    label="Most Common Rarity"
                    value={analytics.mostCommonRarity?.name || "-"}
                  />

                  <SummaryItem
                    label="Valuation"
                    value={`£${analytics.portfolioValueGBP.toFixed(0)}`}
                  />
                </div>
              </section>
            </div>
          </div>
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

function DistributionPanel({
  title,
  subtitle,
  icon,
  items,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  items: DistributionItem[];
}) {
  return (
    <section className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            {icon}

            <span className="text-[10px] font-black uppercase tracking-[0.28em]">
              Breakdown
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">{title}</h2>
          <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">No distribution data yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between gap-4 mb-2">
                <span className="text-sm text-zinc-300 truncate">
                  {item.name}
                </span>

                <span className="text-xs font-black text-white">
                  {item.count}
                </span>
              </div>

              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.45)]"
                  style={{
                    width: `${Math.max(item.percentage, 3)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-4">
      <p className="text-[9px] text-purple-400 font-black uppercase tracking-[0.22em]">
        {label}
      </p>

      <p className="text-sm font-black mt-2 truncate">{value}</p>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
      <WalletCards className="mx-auto mb-4 text-purple-400" size={38} />

      <h3 className="text-2xl font-black mb-2">{title}</h3>

      <p className="text-zinc-500 mb-8">{body}</p>

      <Link
        href="/cards"
        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
      >
        <Plus size={14} />
        Browse Cards
      </Link>
    </div>
  );
}