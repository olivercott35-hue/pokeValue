"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  Gem,
  Layers,
  Loader2,
  Minus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";

type SortOption =
  | "number"
  | "value-desc"
  | "value-asc"
  | "rarity"
  | "name";

type TrendDirection = "up" | "down" | "flat";

type SetItem = {
  id: string;
  name: string;
  series?: string;
  printedTotal?: number;
  total?: number;
  releaseDate?: string;
  images?: {
    symbol?: string;
    logo?: string;
  };
  pokeValueCardCount?: number;
  pokeValueReleaseYear?: string;
  pokeValueReleaseTime?: number;
};

type CardItem = {
  id: string;
  name: string;
  number?: string;
  rarity?: string;
  types?: string[];
  supertype?: string;
  subtypes?: string[];
  images?: {
    small?: string;
    large?: string;
  };
  set?: {
    id?: string;
    name?: string;
    series?: string;
    releaseDate?: string;
    images?: {
      symbol?: string;
      logo?: string;
    };
  };
  pokeValueMarketPriceUSD?: number;
  pokeValuePriceGBP?: number;
  pokeValuePriceSource?: string;
  pokeValuePriceKey?: string | null;
  pokeValueTrendDirection?: TrendDirection;
  pokeValueTrendPercent?: number | null;
  pokeValueTrendLabel?: string;
  pokeValueCardNumberSort?: number;
};

type SetClientProps = {
  set: SetItem;
  cards: CardItem[];
  highestCard: CardItem | null;
  totalMarketValue: number;
};

const INITIAL_VISIBLE = 48;
const LOAD_STEP = 36;

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sortOptions: { id: SortOption; label: string; description: string }[] = [
  {
    id: "number",
    label: "Card number",
    description: "Official set order",
  },
  {
    id: "value-desc",
    label: "High value",
    description: "Highest market prices first",
  },
  {
    id: "value-asc",
    label: "Low value",
    description: "Lowest available prices first",
  },
  {
    id: "rarity",
    label: "Rarity",
    description: "Grouped by rarity",
  },
  {
    id: "name",
    label: "Name",
    description: "Alphabetical card order",
  },
];

function safeNumber(value: unknown, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function formatNumber(value: unknown) {
  return safeNumber(value).toLocaleString();
}

function formatPrice(value?: number) {
  const price = safeNumber(value);

  if (price <= 0) {
    return "No market";
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: price >= 100 ? 0 : 2,
    maximumFractionDigits: price >= 100 ? 0 : 2,
  }).format(price);
}

function formatReleaseDate(value?: string) {
  if (!value) return "Unknown release";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown release";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function normalizeSearch(value: string) {
  return value.toLowerCase().trim();
}

function getCardNumberValue(card: CardItem) {
  return safeNumber(card.pokeValueCardNumberSort, Number.MAX_SAFE_INTEGER);
}

function getShortPriceSource(source?: string) {
  if (!source) return "Market estimate";

  return source
    .replace("TCGplayer ", "")
    .replace(" market", "")
    .replace("Market", "")
    .replace("holofoil", "holo")
    .replace("Holofoil", "holo")
    .replace("Reverse holofoil", "reverse")
    .replace("Unlimited", "unlimited")
    .replace("1st edition", "1st ed")
    .trim();
}

export default function SetClient({
  set,
  cards,
  highestCard,
  totalMarketValue,
}: SetClientProps) {
  const shouldReduceMotion = useReducedMotion();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("number");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [softLoading, setSoftLoading] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const safeCards = Array.isArray(cards) ? cards : [];
  const pricedCards = safeCards.filter(
    (card) => safeNumber(card.pokeValuePriceGBP) > 0
  );

  const activeSort = useMemo(
    () => sortOptions.find((option) => option.id === sortBy),
    [sortBy]
  );

  const filteredCards = useMemo(() => {
    const query = normalizeSearch(search);

    return [...safeCards]
      .filter((card) => {
        if (!query) return true;

        const searchable = normalizeSearch(
          [
            card.id,
            card.name,
            card.number,
            card.rarity,
            card.supertype,
            card.set?.name,
            ...(card.types || []),
            ...(card.subtypes || []),
          ]
            .filter(Boolean)
            .join(" ")
        );

        return searchable.includes(query);
      })
      .sort((a, b) => {
        if (sortBy === "number") {
          const numberDiff = getCardNumberValue(a) - getCardNumberValue(b);
          if (numberDiff !== 0) return numberDiff;
          return String(a.number || "").localeCompare(String(b.number || ""));
        }

        if (sortBy === "value-desc") {
          const priceA = safeNumber(a.pokeValuePriceGBP);
          const priceB = safeNumber(b.pokeValuePriceGBP);

          if (priceA <= 0 && priceB > 0) return 1;
          if (priceB <= 0 && priceA > 0) return -1;

          const priceDiff = priceB - priceA;
          if (priceDiff !== 0) return priceDiff;

          return getCardNumberValue(a) - getCardNumberValue(b);
        }

        if (sortBy === "value-asc") {
          const priceA = safeNumber(a.pokeValuePriceGBP);
          const priceB = safeNumber(b.pokeValuePriceGBP);

          if (priceA <= 0 && priceB > 0) return 1;
          if (priceB <= 0 && priceA > 0) return -1;

          const priceDiff = priceA - priceB;
          if (priceDiff !== 0) return priceDiff;

          return getCardNumberValue(a) - getCardNumberValue(b);
        }

        if (sortBy === "rarity") {
          const rarityCompare = String(a.rarity || "zzz").localeCompare(
            String(b.rarity || "zzz")
          );

          if (rarityCompare !== 0) return rarityCompare;

          return getCardNumberValue(a) - getCardNumberValue(b);
        }

        return String(a.name || "").localeCompare(String(b.name || ""));
      });
  }, [safeCards, search, sortBy]);

  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCards.length;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [search, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const target = loaderRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) return;
        if (loadingRef.current) return;
        if (visibleCount >= filteredCards.length) return;

        loadingRef.current = true;
        setSoftLoading(true);

        window.setTimeout(() => {
          setVisibleCount((current) =>
            Math.min(current + LOAD_STEP, filteredCards.length)
          );
          setSoftLoading(false);
          loadingRef.current = false;
        }, 160);
      },
      {
        root: null,
        rootMargin: "340px 0px 520px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [filteredCards.length, visibleCount]);

  return (
    <AppLayout>
      <main className="relative min-h-full overflow-hidden px-4 py-6 text-white sm:px-6 lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            aria-hidden
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.55, 0.85, 0.55],
                    scale: [1, 1.06, 1],
                  }
            }
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-[-360px] h-[760px] w-[1080px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.25),transparent_68%)] blur-3xl"
          />

          <motion.div
            aria-hidden
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, -34, 0],
                    opacity: [0.34, 0.56, 0.34],
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[-320px] top-[300px] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.17),transparent_70%)] blur-3xl"
          />

          <motion.div
            aria-hidden
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, 26, 0],
                    y: [0, -18, 0],
                    opacity: [0.24, 0.48, 0.24],
                  }
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[-340px] left-[-300px] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.13),transparent_72%)] blur-3xl"
          />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_50%_18%,black,transparent_72%)]" />
        </div>

        <div className="relative mx-auto max-w-[1540px]">
          <motion.section
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: smoothEase }}
            className="mb-6 overflow-hidden rounded-[2.4rem] border border-white/[0.1] bg-[linear-gradient(135deg,rgba(255,255,255,0.105),rgba(255,255,255,0.025))] shadow-[0_38px_150px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,180,254,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.10),transparent_36%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-100/90 to-transparent" />

              <motion.div
                aria-hidden
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        x: ["-120%", "120%"],
                      }
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                className="absolute top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
              />

              <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_430px] lg:items-end lg:p-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/20 bg-purple-300/[0.09] px-3 py-2 text-purple-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                      Premium Set Archive
                    </span>
                  </div>

                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
                    {set.images?.logo && (
                      <div className="relative h-24 w-56 shrink-0 overflow-hidden rounded-[1.65rem] border border-white/[0.09] bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
                        <Image
                          src={set.images.logo}
                          alt={`${set.name} logo`}
                          fill
                          sizes="224px"
                          className="object-contain p-5"
                          priority
                        />
                      </div>
                    )}

                    <div>
                      <h1 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                        {set.name}
                      </h1>

                      <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                        Explore every card in {set.name} with market prices,
                        rarity data, collector numbers, smooth filtering and
                        premium glass card tiles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <HeroMetric
                    label="Cards"
                    value={formatNumber(set.pokeValueCardCount)}
                    icon={<Layers className="h-4 w-4" />}
                  />

                  <HeroMetric
                    label="Visible"
                    value={formatNumber(visibleCards.length)}
                    icon={<Sparkles className="h-4 w-4" />}
                  />

                  <HeroMetric
                    label="Released"
                    value={set.pokeValueReleaseYear || "—"}
                    icon={<CalendarDays className="h-4 w-4" />}
                  />

                  <HeroMetric
                    label="Top Card"
                    value={
                      highestCard
                        ? formatPrice(highestCard.pokeValuePriceGBP)
                        : "—"
                    }
                    icon={<Trophy className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.04, ease: smoothEase }}
            className="sticky top-[76px] z-30 mb-8 rounded-[1.85rem] border border-white/[0.1] bg-[rgba(8,8,14,0.82)] p-3 shadow-[0_26px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-4"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="group flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/[0.085] bg-white/[0.045] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.065)] transition-colors duration-200 focus-within:border-purple-200/45 focus-within:bg-white/[0.065]">
                <Search className="h-4 w-4 shrink-0 text-zinc-500 transition-colors duration-200 group-focus-within:text-purple-100" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search this set by card name, rarity, type or number..."
                  className="h-12 w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-600"
                />

                <AnimatePresence initial={false}>
                  {search && (
                    <motion.button
                      type="button"
                      onClick={() => setSearch("")}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: smoothEase }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.075] text-zinc-500 transition-colors hover:bg-white/[0.13] hover:text-white"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowSortMenu((value) => !value)}
                  className="flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.085] bg-white/[0.045] px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.065)] transition-colors duration-200 hover:border-purple-200/35 hover:bg-white/[0.065] lg:w-72"
                  aria-expanded={showSortMenu}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-200/16 bg-purple-300/[0.1] text-purple-100">
                      <ArrowDownUp className="h-4 w-4" />
                    </span>

                    <span>
                      <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                        Sort
                      </span>
                      <span className="block text-sm font-bold text-white">
                        {activeSort?.label || "Card number"}
                      </span>
                    </span>
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
                      showSortMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 6, scale: 0.99 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 6, scale: 0.99 }
                      }
                      transition={{ duration: 0.18, ease: smoothEase }}
                      className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/[0.11] bg-[rgba(7,7,12,0.98)] p-2 shadow-[0_34px_100px_rgba(0,0,0,0.62)] backdrop-blur-2xl lg:w-80"
                    >
                      <div className="flex items-center gap-2 px-3 py-2 text-purple-100">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                          Sort set cards
                        </span>
                      </div>

                      <div className="space-y-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setSortBy(option.id);
                              setShowSortMenu(false);
                            }}
                            className={`w-full rounded-xl px-3 py-3 text-left transition-colors duration-150 ${
                              sortBy === option.id
                                ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_16px_42px_rgba(168,85,247,0.24)]"
                                : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                            }`}
                          >
                            <span className="block text-sm font-bold">
                              {option.label}
                            </span>
                            <span
                              className={`mt-0.5 block text-xs leading-5 ${
                                sortBy === option.id
                                  ? "text-purple-50/80"
                                  : "text-zinc-600"
                              }`}
                            >
                              {option.description}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <StatusPill>{search ? "Filtered cards" : "Full set"}</StatusPill>
              <StatusPill>{activeSort?.label || "Card number"}</StatusPill>
              <StatusPill>
                {pricedCards.length.toLocaleString()} cards with market prices
              </StatusPill>
              <StatusPill>{formatPrice(totalMarketValue)} total shown</StatusPill>
            </div>
          </motion.section>

          {visibleCards.length > 0 ? (
            <section className="grid auto-rows-fr grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {visibleCards.map((card, index) => (
                <SetCardTile
                  key={card.id}
                  card={card}
                  index={index}
                  reduceMotion={Boolean(shouldReduceMotion)}
                />
              ))}
            </section>
          ) : (
            <EmptyState search={search} setName={set.name} />
          )}

          <div ref={loaderRef} className="h-1 w-full" />

          <div className="flex min-h-28 items-center justify-center py-10">
            {softLoading && hasMore && (
              <div className="flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.045] px-5 py-3 text-purple-100 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em]">
                  Loading more cards
                </span>
              </div>
            )}

            {!softLoading && !hasMore && visibleCards.length > 0 && (
              <p className="rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-center text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
                End of set
              </p>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

function SetCardTile({
  card,
  index,
  reduceMotion,
}: {
  card: CardItem;
  index: number;
  reduceMotion: boolean;
}) {
  const image = card.images?.large || card.images?.small || "";
  const price = safeNumber(card.pokeValuePriceGBP);
  const source = getShortPriceSource(card.pokeValuePriceSource);
  const trendDirection = card.pokeValueTrendDirection || "flat";

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: Math.min((index % 12) * 0.016, 0.14),
        ease: smoothEase,
      }}
      className="h-full"
    >
      <Link href={`/cards/${card.id}`} prefetch={true} className="group block h-full">
        <article className="relative flex h-full min-h-[420px] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.025))] p-[1px] shadow-[0_20px_62px_rgba(0,0,0,0.36)] backdrop-blur-2xl transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_96px_rgba(139,92,246,0.24)]">
          <div className="absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.035)_28%,rgba(168,85,247,0.12)_50%,rgba(56,189,248,0.06)_72%,rgba(255,255,255,0.08))] opacity-55 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative flex h-full w-full overflow-hidden rounded-[1.7rem] border border-white/[0.06] bg-[rgba(13,13,18,0.78)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(216,180,254,0.22),transparent_38%),radial-gradient(circle_at_20%_90%,rgba(56,189,248,0.12),transparent_36%)]" />
              <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/75 to-transparent" />
              <div className="absolute -inset-10 rounded-full bg-purple-400/10 blur-2xl" />
            </div>

            <div className="pointer-events-none absolute -left-[120%] top-0 h-full w-[85%] -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.13] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]" />

            <div className="relative flex h-full w-full flex-col">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),rgba(21,21,28,0.98)_44%,rgba(7,7,10,1))] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]">
                <div className="absolute left-2 top-2 z-10 rounded-full border border-white/[0.12] bg-black/45 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-zinc-300 backdrop-blur-xl">
                  {card.number ? `#${card.number}` : card.supertype || "Card"}
                </div>

                <div className="absolute bottom-2 right-2 z-10 rounded-full border border-white/[0.1] bg-black/40 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400 backdrop-blur-xl">
                  {card.types?.[0] || card.supertype || "TCG"}
                </div>

                <div className="relative aspect-[5/7] w-full">
                  {image ? (
                    <Image
                      src={image}
                      alt={card.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      className="object-contain p-2.5 drop-shadow-[0_24px_28px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out group-hover:scale-[1.018]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-bold text-zinc-600">
                      No image
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                <div className="min-h-[82px]">
                  <h2 className="line-clamp-2 text-[15px] font-black leading-5 text-white">
                    {card.name}
                  </h2>

                  <p className="mt-3 line-clamp-1 text-[12px] font-semibold text-zinc-500">
                    {card.rarity || "Pokémon Card"}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.28em] text-zinc-600">
                        {source || "Market estimate"}
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-zinc-600">
                        {card.id}
                      </p>
                    </div>

                    <PriceTrendValue
                      price={price}
                      direction={trendDirection}
                      trendPercent={card.pokeValueTrendPercent}
                    />
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

function PriceTrendValue({
  price,
  direction,
  trendPercent,
}: {
  price: number;
  direction: TrendDirection;
  trendPercent?: number | null;
}) {
  if (price <= 0) {
    return (
      <div className="shrink-0 text-right">
        <p className="text-base font-black tracking-tight text-zinc-500">
          No market
        </p>
      </div>
    );
  }

  const percent =
    typeof trendPercent === "number" && Number.isFinite(trendPercent)
      ? Math.abs(trendPercent)
      : null;

  if (direction === "up") {
    return (
      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1.5 text-emerald-400">
          <ArrowUp className="h-3.5 w-3.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          <p className="text-lg font-black tracking-tight text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.22)]">
            {formatPrice(price)}
          </p>
        </div>

        {percent !== null && (
          <p className="mt-0.5 text-[10px] font-semibold text-emerald-500/90">
            +{percent.toFixed(1)}%
          </p>
        )}
      </div>
    );
  }

  if (direction === "down") {
    return (
      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1.5 text-rose-400">
          <ArrowDown className="h-3.5 w-3.5 drop-shadow-[0_0_8px_rgba(251,113,133,0.48)]" />
          <p className="text-lg font-black tracking-tight text-rose-300 drop-shadow-[0_0_10px_rgba(251,113,133,0.18)]">
            {formatPrice(price)}
          </p>
        </div>

        {percent !== null && (
          <p className="mt-0.5 text-[10px] font-semibold text-rose-500/90">
            -{percent.toFixed(1)}%
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="shrink-0 text-right">
      <div className="flex items-center justify-end gap-1.5 text-zinc-400">
        <Minus className="h-3.5 w-3.5" />
        <p className="text-lg font-black tracking-tight text-zinc-100">
          {formatPrice(price)}
        </p>
      </div>

      {percent !== null && (
        <p className="mt-0.5 text-[10px] font-semibold text-zinc-500">
          {percent.toFixed(1)}%
        </p>
      )}
    </div>
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
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.075)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </span>

        <span className="text-purple-100">{icon}</span>
      </div>

      <p className="text-xl font-black tracking-tight text-white sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-1.5 font-semibold text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      {children}
    </span>
  );
}

function EmptyState({
  search,
  setName,
}: {
  search: string;
  setName: string;
}) {
  return (
    <div className="mx-auto flex min-h-[360px] max-w-2xl items-center justify-center">
      <div className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-8 text-center shadow-[0_30px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200/15 bg-purple-300/[0.09] text-purple-100">
          <Search className="h-6 w-6" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-100">
          No cards found
        </p>

        <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
          Try a different search
        </h2>

        <p className="mt-3 text-sm leading-7 text-zinc-500">
          No cards in {setName} matched{" "}
          <span className="font-bold text-zinc-300">
            {search ? `"${search}"` : "that query"}
          </span>
          . Search by card name, rarity, type or collector number.
        </p>
      </div>
    </div>
  );
}