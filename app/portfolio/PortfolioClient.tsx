"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Award,
  BadgePoundSterling,
  BarChart3,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import {
  useCurrency,
  type PriceSourceCurrency,
} from "@/components/CurrencyProvider";
import { getResolvedCardPrice } from "@/lib/card-pricing";

type PriceInfo = {
  value: number;
  source: string;
  sourceCurrency: PriceSourceCurrency;
  gbpValue: number;
};

type PortfolioHolding = {
  card: any;
  price: PriceInfo;
};


const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function getPriceInfo(card: any): PriceInfo {
  const price = getResolvedCardPrice(card);

  return {
    value: price.market,
    source: price.source,
    sourceCurrency: price.sourceCurrency,
    gbpValue: price.gbpValue,
  };
}

function sortHoldingsByValue(holdings: PortfolioHolding[]) {
  return [...holdings].sort((a, b) => {
    if (a.price.gbpValue !== b.price.gbpValue) {
      return b.price.gbpValue - a.price.gbpValue;
    }

    return String(a.card?.name || "").localeCompare(
      String(b.card?.name || "")
    );
  });
}

export default function PortfolioClient() {
  const shouldReduceMotion = useReducedMotion();
  const { formatPrice } = useCurrency();

  const [collection, setCollection] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("collection") || "[]");
      setCollection(Array.isArray(saved) ? saved : []);
    } catch {
      setCollection([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  const holdings = useMemo<PortfolioHolding[]>(() => {
    return collection.map((card) => ({
      card,
      price: getPriceInfo(card),
    }));
  }, [collection]);

  const visibleHoldings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filteredHoldings = query
      ? holdings.filter(({ card }) => {
          const searchableText = [
            card?.name,
            card?.set?.name,
            card?.rarity,
            card?.number,
            card?.types?.join(" "),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(query);
        })
      : holdings;

    return sortHoldingsByValue(filteredHoldings);
  }, [holdings, searchQuery]);

  const portfolioStats = useMemo(() => {
    const totalValueGBP = holdings.reduce(
      (sum, holding) => sum + holding.price.gbpValue,
      0
    );

    const pricedHoldings = holdings.filter(
      (holding) => holding.price.gbpValue > 0
    );

    const averageValueGBP =
      pricedHoldings.length > 0
        ? totalValueGBP / pricedHoldings.length
        : 0;

    const mostValuableHolding = sortHoldingsByValue(holdings)[0] || null;

    const representedSets = new Set(
      holdings
        .map(({ card }) => String(card?.set?.name || "").trim())
        .filter(Boolean)
    ).size;

    return {
      totalValueGBP,
      averageValueGBP,
      pricedCards: pricedHoldings.length,
      mostValuableHolding,
      representedSets,
    };
  }, [holdings]);

  const maxVisibleValue = useMemo(() => {
    return Math.max(
      ...visibleHoldings.map((holding) => holding.price.gbpValue),
      0
    );
  }, [visibleHoldings]);

  return (
    <AppLayout>
      <main className="relative min-h-full overflow-hidden bg-[#050506] px-4 py-6 text-white sm:px-6 lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-430px] h-[780px] w-[1120px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.09),rgba(76,29,149,0.03)_38%,transparent_72%)] blur-3xl" />

          <div className="absolute right-[-360px] top-[300px] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.05),transparent_72%)] blur-3xl" />

          <div className="absolute bottom-[-420px] left-[-340px] h-[740px] w-[740px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.03),transparent_74%)] blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_50%_12%,black,transparent_72%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(5,5,6,0.16)_42%,rgba(5,5,6,0.94)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-[1540px]">
          <motion.section
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="group/hero relative mb-6 overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(135deg,rgba(18,18,21,0.96),rgba(8,8,10,0.98))] shadow-[0_34px_120px_rgba(0,0,0,0.54)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.055),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(99,102,241,0.045),transparent_38%)]" />

            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />

            <div className="pointer-events-none absolute -left-[40%] top-[-90%] h-[285%] w-[26%] rotate-[20deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.045),transparent)] opacity-0 blur-[2px] transition-[transform,opacity] duration-[1400ms] ease-out group-hover/hero:translate-x-[625%] group-hover/hero:opacity-100" />

            <div className="relative grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_430px] lg:items-end lg:p-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
                  <TrendingUp className="h-3.5 w-3.5 text-violet-300/80" />

                  <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                    Portfolio Intelligence
                  </span>
                </div>

                <h1 className="max-w-4xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-zinc-50 sm:text-5xl lg:text-6xl">
                  Your collection, ranked by value.
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-500 sm:text-base">
                  Review your estimated portfolio value, identify your strongest
                  holdings and compare every saved card in one private dashboard.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/cards"
                    prefetch={false}
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-sm font-black text-black shadow-[0_16px_52px_rgba(255,255,255,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add holdings
                  </Link>

                  <div className="group flex min-h-12 flex-1 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-colors focus-within:border-white/[0.16] focus-within:bg-white/[0.04] sm:max-w-md">
                    <Search className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-focus-within:text-zinc-300" />

                    <input
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      placeholder="Search holdings..."
                      className="h-12 w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-700"
                    />

                    <AnimatePresence initial={false}>
                      {searchQuery && (
                        <motion.button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.035] text-zinc-600 transition hover:bg-white/[0.07] hover:text-zinc-200"
                          aria-label="Clear portfolio search"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <HeroMetric
                  label="Total Value"
                  value={formatPrice(
                    portfolioStats.totalValueGBP,
                    "GBP"
                  )}
                  icon={<BadgePoundSterling className="h-4 w-4" />}
                />

                <HeroMetric
                  label="Holdings"
                  value={collection.length.toLocaleString("en-GB")}
                  icon={<WalletCards className="h-4 w-4" />}
                />

                <HeroMetric
                  label="Average"
                  value={formatPrice(
                    portfolioStats.averageValueGBP,
                    "GBP"
                  )}
                  icon={<BarChart3 className="h-4 w-4" />}
                />

                <HeroMetric
                  label="Sets"
                  value={portfolioStats.representedSets.toLocaleString(
                    "en-GB"
                  )}
                  icon={<Layers className="h-4 w-4" />}
                />
              </div>
            </div>
          </motion.section>

          {!hydrated ? (
            <PortfolioSkeleton />
          ) : collection.length === 0 ? (
            <EmptyPortfolio />
          ) : (
            <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
              <TopHoldingPanel
                holding={portfolioStats.mostValuableHolding}
                formatPrice={formatPrice}
              />

              <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.95),rgba(8,8,10,0.98))] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-6">
                <div className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />

                <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-violet-300/75">
                      <WalletCards className="h-3.5 w-3.5" />

                      <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                        Holdings breakdown
                      </span>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-zinc-50 sm:text-3xl">
                      Ranked by estimated value
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <StatusPill>
                      {visibleHoldings.length.toLocaleString("en-GB")} visible
                    </StatusPill>

                    <StatusPill>
                      {portfolioStats.pricedCards.toLocaleString("en-GB")} priced
                    </StatusPill>
                  </div>
                </div>

                {visibleHoldings.length === 0 ? (
                  <NoResults query={searchQuery} />
                ) : (
                  <div className="relative space-y-3">
                    <AnimatePresence mode="popLayout">
                      {visibleHoldings.map((holding, index) => (
                        <HoldingRow
                          key={holding.card.id}
                          holding={holding}
                          index={index}
                          maxVisibleValue={maxVisibleValue}
                          formatPrice={formatPrice}
                          reduceMotion={Boolean(shouldReduceMotion)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </section>
            </section>
          )}
        </div>
      </main>
    </AppLayout>
  );
}

function TopHoldingPanel({
  holding,
  formatPrice,
}: {
  holding: PortfolioHolding | null;
  formatPrice: (
    value: number,
    sourceCurrency: PriceSourceCurrency
  ) => string;
}) {
  if (!holding) {
    return null;
  }

  const image =
    holding.card?.images?.large ||
    holding.card?.images?.small ||
    "";

  return (
    <aside className="group relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.95),rgba(8,8,10,0.98))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-6">
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-[40%] h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.15),rgba(79,70,229,0.06)_38%,transparent_72%)] opacity-70 blur-3xl transition duration-700 group-hover:scale-110 group-hover:opacity-100" />

      <div className="relative mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300/75">
            Top holding
          </p>

          <p className="mt-1 text-xs font-semibold text-zinc-600">
            Highest estimated market value
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-500">
          <Award className="h-5 w-5" />
        </div>
      </div>

      <Link
        href={`/cards/${holding.card.id}`}
        prefetch={false}
        className="relative block"
      >
        <div className="relative mx-auto aspect-[5/7] max-w-[230px] overflow-hidden rounded-[1.6rem] border border-white/[0.07] bg-[linear-gradient(180deg,#171719,#0a0a0c)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_70px_rgba(0,0,0,0.52)] transition duration-500 group-hover:-translate-y-1 group-hover:border-white/[0.14]">
          <div className="pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />

          {image ? (
            <Image
              src={image}
              alt={holding.card?.name || "Top portfolio card"}
              fill
              quality={70}
              loading="lazy"
              sizes="230px"
              className="object-contain p-3 drop-shadow-[0_24px_28px_rgba(0,0,0,0.44)] transition-transform duration-500 group-hover:scale-[1.018]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-zinc-700">
              No image
            </div>
          )}
        </div>

        <h3 className="mt-5 line-clamp-2 text-xl font-black tracking-tight text-zinc-50">
          {holding.card?.name || "Unknown card"}
        </h3>

        <p className="mt-2 line-clamp-1 text-sm font-semibold text-zinc-600">
          {holding.card?.set?.name || "Unknown set"}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/[0.055] pt-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">
              {holding.price.source}
            </p>

            <p className="mt-1 text-xs font-semibold text-zinc-600">
              Estimated value
            </p>
          </div>

          <p className="text-2xl font-black tracking-tight text-zinc-100">
            {formatPrice(
              holding.price.value,
              holding.price.sourceCurrency
            )}
          </p>
        </div>
      </Link>
    </aside>
  );
}

function HoldingRow({
  holding,
  index,
  maxVisibleValue,
  formatPrice,
  reduceMotion,
}: {
  holding: PortfolioHolding;
  index: number;
  maxVisibleValue: number;
  formatPrice: (
    value: number,
    sourceCurrency: PriceSourceCurrency
  ) => string;
  reduceMotion: boolean;
}) {
  const image =
    holding.card?.images?.small ||
    holding.card?.images?.large ||
    "";

  const percentage =
    maxVisibleValue > 0
      ? Math.max(
          (holding.price.gbpValue / maxVisibleValue) * 100,
          holding.price.gbpValue > 0 ? 4 : 0
        )
      : 0;

  return (
    <motion.article
      layout="position"
      initial={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 10, scale: 0.992 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        duration: 0.26,
        delay: Math.min((index % 12) * 0.012, 0.11),
        ease: smoothEase,
      }}
    >
      <Link
        href={`/cards/${holding.card.id}`}
        prefetch={false}
        className="group relative block overflow-hidden rounded-[1.45rem] border border-white/[0.06] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition duration-400 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.045]"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 bg-[linear-gradient(90deg,rgba(124,58,237,0.1),rgba(79,70,229,0.025),transparent)] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />

        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent transition-all duration-300 group-hover:inset-x-4 group-hover:via-white/30" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0b0d] shadow-[0_12px_30px_rgba(0,0,0,0.34)]">
              {image ? (
                <Image
                  src={image}
                  alt={holding.card?.name || "Portfolio card"}
                  fill
                  quality={60}
                  loading="lazy"
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[9px] font-semibold text-zinc-700">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-zinc-100">
                {holding.card?.name || "Unknown card"}
              </h3>

              <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-700">
                {holding.card?.set?.name || "Unknown set"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/[0.055] bg-white/[0.025] px-2 py-1 text-[9px] font-bold text-zinc-600">
                  {holding.price.source}
                </span>

                {holding.card?.rarity && (
                  <span className="rounded-full border border-white/[0.055] bg-white/[0.025] px-2 py-1 text-[9px] font-bold text-zinc-600">
                    {holding.card.rarity}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p
              className={`text-lg font-black tracking-tight ${
                holding.price.value > 0
                  ? "text-zinc-100"
                  : "text-zinc-600"
              }`}
            >
              {holding.price.value > 0
                ? formatPrice(
                    holding.price.value,
                    holding.price.sourceCurrency
                  )
                : "No market"}
            </p>

            <p className="mt-1 text-[10px] font-semibold text-zinc-700">
              {holding.price.gbpValue > 0
                ? `${new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                    minimumFractionDigits:
                      holding.price.gbpValue >= 100 ? 0 : 2,
                    maximumFractionDigits:
                      holding.price.gbpValue >= 100 ? 0 : 2,
                  }).format(holding.price.gbpValue)} GBP`
                : "No GBP estimate"}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function HeroMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.065] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.012))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl transition duration-300 hover:border-white/[0.11] hover:bg-white/[0.045]">
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent transition-all duration-300 group-hover:inset-x-3 group-hover:via-white/35" />

      <div className="relative mb-3 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
          {label}
        </span>

        <span className="text-zinc-500 transition-colors duration-300 group-hover:text-violet-300/80">
          {icon}
        </span>
      </div>

      <p className="relative truncate text-xl font-black tracking-tight text-zinc-50 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-xs font-semibold text-zinc-600">
      {children}
    </span>
  );
}

function EmptyPortfolio() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.95),rgba(8,8,10,0.98))] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-14">
      <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.12),transparent_68%)] blur-3xl" />

      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] text-violet-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_50px_rgba(0,0,0,0.36)]">
        <WalletCards className="h-9 w-9" />
      </div>

      <p className="relative text-[10px] font-black uppercase tracking-[0.24em] text-violet-300/70">
        Private portfolio
      </p>

      <h2 className="relative mt-3 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">
        Build your collection to unlock the dashboard.
      </h2>

      <p className="relative mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600">
        Add cards to your collection and PokeValue will rank your holdings,
        estimate your portfolio value and highlight your strongest card.
      </p>

      <Link
        href="/cards"
        prefetch={false}
        className="relative mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-zinc-100 px-6 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white"
      >
        <Plus className="h-4 w-4" />
        Browse cards
      </Link>
    </section>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-8 text-center sm:p-10">
      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-500">
        <Search className="h-7 w-7" />
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">
        No matching holdings
      </p>

      <h3 className="mt-3 text-2xl font-black tracking-tight text-zinc-100">
        Try another portfolio search.
      </h3>

      <p className="mt-3 text-sm leading-7 text-zinc-600">
        Nothing in your portfolio matches{" "}
        <span className="font-bold text-zinc-400">
          {query ? `"${query}"` : "that search"}
        </span>
        .
      </p>
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="min-h-[620px] animate-pulse rounded-[2rem] border border-white/[0.05] bg-white/[0.025]" />

      <div className="space-y-3 rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-[1.45rem] border border-white/[0.045] bg-white/[0.025]"
          />
        ))}
      </div>
    </section>
  );
}
