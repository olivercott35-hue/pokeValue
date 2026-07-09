"use client";

import { useEffect, useMemo, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import PremiumCard from "@/components/PremiumCard";
import {
  Trash2,
  Plus,
  TrendingUp,
  Sparkles,
  FolderHeart,
  Search,
  ShieldCheck,
  WalletCards,
  BadgePoundSterling,
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

type CardEntry = {
  card: any;
  price: PriceInfo;
};

const USD_TO_GBP = 0.79;
const EUR_TO_GBP = 0.86;

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

function compareCardNames(a: any, b: any) {
  return String(a?.name || "").localeCompare(String(b?.name || ""));
}

export default function CollectionPage() {
  const { formatPrice } = useCurrency();

  const [cards, setCards] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("collection") || "[]");
      setCards(Array.isArray(saved) ? saved : []);
    } catch {
      setCards([]);
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

    const filtered = query
      ? cardEntries.filter(({ card }) => {
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
      : cardEntries;

    return [...filtered].sort((a, b) => {
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

  const highestEntry = visibleEntries[0];

  const removeCard = (cardId: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = cards.filter((card) => card.id !== cardId);

    setCards(updated);
    localStorage.setItem("collection", JSON.stringify(updated));
  };

  return (
    <AppLayout>
      <div className="relative min-h-full w-full overflow-hidden px-4 py-6 text-white sm:px-6 md:px-10 md:py-10">
        <div className="pointer-events-none absolute top-0 right-[-120px] h-80 w-80 rounded-full bg-purple-500/10 blur-[120px] sm:right-24 sm:h-96 sm:w-96 sm:blur-[130px]" />
        <div className="pointer-events-none absolute bottom-20 left-[-140px] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[130px] sm:left-16 sm:h-96 sm:w-96 sm:blur-[150px]" />

        <div className="relative mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-6 border-b border-white/[0.05] pb-7 md:mb-10 md:pb-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-purple-400">
                <FolderHeart size={14} />

                <span className="text-[9px] font-black uppercase tracking-[0.24em] sm:text-[10px] sm:tracking-[0.3em]">
                  Collection Intelligence
                </span>
              </div>

              <h1 className="bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl md:text-7xl">
                My Vault
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                {cards.length} premium assets tracked and ranked by estimated
                market value.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
              <div className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-xl transition-all hover:border-purple-500/20 sm:flex-1 xl:w-auto xl:flex-none">
                <Search className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-focus-within:text-purple-400" />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vault..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder-zinc-600 sm:w-64"
                />
              </div>

              <Link
                href="/cards"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:bg-purple-500 active:scale-95 sm:w-auto"
              >
                <Plus size={14} />
                Add Asset
              </Link>
            </div>
          </header>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Vault Estimate"
              value={formatPrice(totalValueGBP, "GBP")}
              sublabel="Converted estimate"
              icon={<BadgePoundSterling size={14} />}
            />

            <MetricCard
              label="Tracked Assets"
              value={cards.length.toString()}
              sublabel="Saved cards"
              icon={<WalletCards size={14} />}
            />

            <MetricCard
              label="Priced Assets"
              value={pricedCards.toString()}
              sublabel="Cards with market data"
              icon={<TrendingUp size={14} />}
            />

            <MetricCard
              label="Top Asset"
              value={
                highestEntry
                  ? formatPrice(
                      highestEntry.price.value,
                      highestEntry.price.sourceCurrency
                    )
                  : "No data"
              }
              sublabel={highestEntry?.card?.name || "Nothing tracked"}
              icon={<Sparkles size={14} />}
            />
          </div>

          {cards.length === 0 && (
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-10 text-center backdrop-blur-2xl sm:p-14">
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl" />

                <FolderHeart
                  className="relative z-10 text-purple-400"
                  size={42}
                />
              </div>

              <h2 className="mb-3 text-3xl font-black">Your Vault Is Empty</h2>

              <p className="mb-8 text-zinc-500">
                Start tracking cards to build your collection portfolio.
              </p>

              <Link
                href="/cards"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:bg-purple-500 active:scale-95"
              >
                <Plus size={14} />
                Browse Cards
              </Link>
            </div>
          )}

          {cards.length > 0 && visibleEntries.length === 0 && (
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-10 text-center backdrop-blur-2xl sm:p-12">
              <ShieldCheck className="mx-auto mb-4 text-purple-400" size={36} />

              <h2 className="mb-2 text-2xl font-black">No cards found</h2>

              <p className="text-zinc-500">
                Try searching another card, set, or rarity.
              </p>
            </div>
          )}

          {visibleEntries.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {visibleEntries.map(({ card }) => (
                <div key={card.id} className="group relative">
                  <Link href={`/cards/${card.id}`}>
                    <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-1.5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/20 hover:bg-white/[0.04] hover:shadow-[0_16px_50px_rgba(168,85,247,0.08)] sm:rounded-3xl sm:p-2">
                      <PremiumCard card={card} />
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => removeCard(card.id, e)}
                    className="absolute right-2 top-2 z-20 rounded-full border border-white/10 bg-black/75 p-2 text-white opacity-100 backdrop-blur-xl transition-all hover:bg-red-500/25 sm:right-4 sm:top-4 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label={`Remove ${card.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-5 backdrop-blur-2xl transition-all hover:border-purple-500/20 sm:rounded-3xl">
      <div className="mb-2 flex items-center gap-2 text-purple-400">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.24em]">
          {label}
        </span>
      </div>

      <h2 className="truncate text-2xl font-black tracking-tight">{value}</h2>

      <p className="mt-1 truncate text-xs text-zinc-500">{sublabel}</p>
    </div>
  );
}