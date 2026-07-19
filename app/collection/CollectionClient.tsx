"use client";

import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgePoundSterling,
  FolderHeart,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import PremiumCard from "@/components/PremiumCard";
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

type CardEntry = {
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

function compareCardNames(a: any, b: any) {
  return String(a?.name || "").localeCompare(String(b?.name || ""));
}

export default function CollectionClient() {
  const shouldReduceMotion = useReducedMotion();
  const { formatPrice } = useCurrency();

  const [cards, setCards] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("collection") || "[]");
      setCards(Array.isArray(saved) ? saved : []);
    } catch {
      setCards([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  const cardEntries = useMemo<CardEntry[]>(() => {
    return cards.map((card) => ({
      card,
      price: getPriceInfo(card),
    }));
  }, [cards]);

  const visibleEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filteredEntries = query
      ? cardEntries.filter(({ card }) => {
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
      : cardEntries;

    return [...filteredEntries].sort((a, b) => {
      if (a.price.gbpValue !== b.price.gbpValue) {
        return b.price.gbpValue - a.price.gbpValue;
      }

      return compareCardNames(a.card, b.card);
    });
  }, [cardEntries, searchQuery]);

  const totalValueGBP = useMemo(() => {
    return cardEntries.reduce((sum, entry) => sum + entry.price.gbpValue, 0);
  }, [cardEntries]);

  const pricedCards = useMemo(() => {
    return cardEntries.filter((entry) => entry.price.gbpValue > 0).length;
  }, [cardEntries]);

  const highestEntry = useMemo(() => {
    return [...cardEntries].sort(
      (a, b) => b.price.gbpValue - a.price.gbpValue
    )[0];
  }, [cardEntries]);

  const averageValueGBP =
    pricedCards > 0 ? totalValueGBP / pricedCards : 0;

  const removeCard = (
    cardId: string,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const updatedCards = cards.filter((card) => card.id !== cardId);

    setCards(updatedCards);
    localStorage.setItem("collection", JSON.stringify(updatedCards));
  };

  return (
    <AppLayout>
      <main className="pv-page text-white">
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
                  <FolderHeart className="h-3.5 w-3.5 text-violet-300/80" />

                  <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                    Personal Collection
                  </span>
                </div>

                <h1 className="max-w-4xl text-4xl font-black leading-[0.96] tracking-[-0.05em] text-zinc-50 sm:text-5xl lg:text-6xl">
                  Your Pokémon card vault.
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-500 sm:text-base">
                  Track the cards you own, review estimated market values and
                  keep your collection organised in one private workspace.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/cards"
                    prefetch={false}
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-sm font-black text-black shadow-[0_16px_52px_rgba(255,255,255,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add cards
                  </Link>

                  <div className="group flex min-h-12 flex-1 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-colors focus-within:border-white/[0.16] focus-within:bg-white/[0.04] sm:max-w-md">
                    <Search className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-focus-within:text-zinc-300" />

                    <input
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      placeholder="Search your vault..."
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
                          aria-label="Clear collection search"
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
                  label="Vault Estimate"
                  value={formatPrice(totalValueGBP, "GBP")}
                  icon={<BadgePoundSterling className="h-4 w-4" />}
                />

                <HeroMetric
                  label="Tracked"
                  value={cards.length.toLocaleString("en-GB")}
                  icon={<WalletCards className="h-4 w-4" />}
                />

                <HeroMetric
                  label="Priced"
                  value={pricedCards.toLocaleString("en-GB")}
                  icon={<TrendingUp className="h-4 w-4" />}
                />

                <HeroMetric
                  label="Average"
                  value={formatPrice(averageValueGBP, "GBP")}
                  icon={<Layers className="h-4 w-4" />}
                />
              </div>
            </div>
          </motion.section>

          {!hydrated ? (
            <CollectionSkeleton />
          ) : cards.length === 0 ? (
            <EmptyCollection />
          ) : visibleEntries.length === 0 ? (
            <NoResults query={searchQuery} />
          ) : (
            <>
              <section className="mb-5 flex flex-col gap-3 rounded-[1.5rem] border border-white/[0.06] bg-[rgba(10,10,12,0.8)] px-4 py-3 shadow-[0_18px_56px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">
                    Collection overview
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-400">
                    Showing {visibleEntries.length.toLocaleString("en-GB")} of{" "}
                    {cards.length.toLocaleString("en-GB")} saved cards
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill>
                    Sorted by market value
                  </StatusPill>

                  <StatusPill>
                    {highestEntry?.card?.name
                      ? `Top: ${highestEntry.card.name}`
                      : "No priced cards"}
                  </StatusPill>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <AnimatePresence mode="popLayout">
                  {visibleEntries.map(({ card, price }, index) => (
                    <CollectionCard
                      key={card.id}
                      card={card}
                      price={price}
                      index={index}
                      removeCard={removeCard}
                      reduceMotion={Boolean(shouldReduceMotion)}
                    />
                  ))}
                </AnimatePresence>
              </section>
            </>
          )}
        </div>
      </main>
    </AppLayout>
  );
}

function CollectionCard({
  card,
  price,
  index,
  removeCard,
  reduceMotion,
}: {
  card: any;
  price: PriceInfo;
  index: number;
  removeCard: (
    cardId: string,
    event: MouseEvent<HTMLButtonElement>
  ) => void;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      layout="position"
      initial={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 12, scale: 0.988 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.28,
        delay: Math.min((index % 10) * 0.012, 0.1),
        ease: smoothEase,
      }}
      className="group relative h-full overflow-visible pt-1"
    >
      <div className="pointer-events-none absolute inset-x-[10%] bottom-[-20px] h-20 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.22)_0%,rgba(79,70,229,0.1)_42%,transparent_74%)] opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

      <Link
        href={`/cards/${card.id}`}
        prefetch={false}
        className="relative block h-full"
      >
        <div className="relative h-full overflow-hidden rounded-[1.65rem] border border-white/[0.065] bg-[linear-gradient(145deg,rgba(18,18,21,0.98),rgba(8,8,10,0.98))] p-[1px] shadow-[0_18px_54px_rgba(0,0,0,0.38)] transition duration-500 group-hover:-translate-y-1.5 group-hover:border-white/[0.13] group-hover:shadow-[0_30px_90px_rgba(0,0,0,0.58),0_0_40px_rgba(124,58,237,0.08)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.055),transparent_32%),radial-gradient(circle_at_90%_100%,rgba(124,58,237,0.04),transparent_34%)]" />

          <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/24 to-transparent transition-all duration-500 group-hover:inset-x-4 group-hover:via-white/42" />

          <div className="relative flex h-full flex-col rounded-[1.6rem] border border-white/[0.03] bg-[rgba(9,9,11,0.95)] p-2.5">
            <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.055] bg-[linear-gradient(180deg,#171719,#0a0a0c)]">
              <PremiumCard card={card} />
            </div>

            <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
              <div className="min-h-[68px]">
                <h2 className="line-clamp-2 text-[15px] font-black leading-5 text-zinc-100">
                  {card?.name || "Unknown card"}
                </h2>

                <p className="mt-2 line-clamp-1 text-xs font-semibold text-zinc-600">
                  {card?.set?.name || "Unknown set"}
                </p>
              </div>

              <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.055] pt-3">
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">
                    {card?.rarity || "Collection card"}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-zinc-700">
                    {price.source}
                  </p>
                </div>

                <p
                  className={`shrink-0 text-lg font-black tracking-tight ${
                    price.gbpValue > 0
                      ? "text-zinc-100"
                      : "text-zinc-600"
                  }`}
                >
                  {price.gbpValue > 0
                    ? new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                        minimumFractionDigits:
                          price.gbpValue >= 100 ? 0 : 2,
                        maximumFractionDigits:
                          price.gbpValue >= 100 ? 0 : 2,
                      }).format(price.gbpValue)
                    : "No market"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={(event) => removeCard(card.id, event)}
        className="absolute right-3 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-black/80 text-zinc-500 opacity-100 shadow-[0_10px_26px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Remove ${card?.name || "card"} from collection`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
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

function EmptyCollection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.95),rgba(8,8,10,0.98))] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-14">
      <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.12),transparent_68%)] blur-3xl" />

      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] text-violet-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_50px_rgba(0,0,0,0.36)]">
        <FolderHeart className="h-9 w-9" />
      </div>

      <p className="relative text-[10px] font-black uppercase tracking-[0.24em] text-violet-300/70">
        Your personal vault
      </p>

      <h2 className="relative mt-3 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">
        Your collection is ready to build.
      </h2>

      <p className="relative mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600">
        Browse the card archive and add the cards you own. Your collection and
        estimated values are stored privately in this browser.
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
    <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.95),rgba(8,8,10,0.98))] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:p-12">
      <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-500">
        <Search className="h-7 w-7" />
      </div>

      <p className="relative text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">
        No matching cards
      </p>

      <h2 className="relative mt-3 text-2xl font-black tracking-tight text-zinc-100">
        Try another collection search.
      </h2>

      <p className="relative mt-3 text-sm leading-7 text-zinc-600">
        Nothing in your vault matches{" "}
        <span className="font-bold text-zinc-400">
          {query ? `"${query}"` : "that search"}
        </span>
        .
      </p>
    </section>
  );
}

function CollectionSkeleton() {
  return (
    <section className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[430px] animate-pulse rounded-[1.65rem] border border-white/[0.05] bg-white/[0.025]"
        />
      ))}
    </section>
  );
}
