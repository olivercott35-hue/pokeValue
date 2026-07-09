"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  Database,
  ArrowDownUp,
  Loader2,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import PremiumCard from "@/components/PremiumCard";

type SortOption = "value-desc" | "value-asc" | "released" | "number";

const PAGE_SIZE = 48;

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};

function getCardValueGBP(card: any) {
  const cm = card?.cardmarket?.prices;
  const tcg = card?.tcgplayer?.prices;
  const firstTcg: any = tcg ? Object.values(tcg)[0] : null;

  const cardmarketValue =
    Number(cm?.trendPrice || 0) ||
    Number(cm?.averageSellPrice || 0) ||
    Number(cm?.avg7 || 0) ||
    Number(cm?.avg30 || 0);

  if (cardmarketValue > 0) return cardmarketValue * 0.86;

  const tcgValue =
    Number(firstTcg?.market || 0) ||
    Number(firstTcg?.mid || 0) ||
    Number(firstTcg?.low || 0) ||
    Number(firstTcg?.high || 0);

  if (tcgValue > 0) return tcgValue * 0.79;

  return 0;
}

function getReleaseTime(card: any) {
  const time = new Date(card?.set?.releaseDate || "1900-01-01").getTime();
  return Number.isNaN(time) ? 0 : time;
}

function parseCardNumber(value: string | undefined) {
  if (!value) return 0;
  const number = Number(value.replace(/[^0-9]/g, ""));
  return Number.isNaN(number) ? 0 : number;
}

function compareNames(a: any, b: any) {
  return String(a?.name || "").localeCompare(String(b?.name || ""));
}

function sortCards(cards: any[], sortBy: SortOption) {
  const sorted = [...cards];

  sorted.sort((a, b) => {
    if (sortBy === "value-desc") {
      const diff = getCardValueGBP(b) - getCardValueGBP(a);
      return diff !== 0 ? diff : compareNames(a, b);
    }

    if (sortBy === "value-asc") {
      const valueA = getCardValueGBP(a);
      const valueB = getCardValueGBP(b);

      if (valueA === 0 && valueB > 0) return 1;
      if (valueB === 0 && valueA > 0) return -1;

      const diff = valueA - valueB;
      return diff !== 0 ? diff : compareNames(a, b);
    }

    if (sortBy === "released") {
      const diff = getReleaseTime(b) - getReleaseTime(a);
      return diff !== 0 ? diff : compareNames(a, b);
    }

    if (sortBy === "number") {
      const diff = parseCardNumber(a?.number) - parseCardNumber(b?.number);
      return diff !== 0 ? diff : compareNames(a, b);
    }

    return 0;
  });

  return sorted;
}

function getApiSortQuery(sort: SortOption) {
  if (sort === "value-desc") {
    return "-cardmarket.prices.trendPrice,-cardmarket.prices.averageSellPrice,-tcgplayer.prices.holofoil.market";
  }

  if (sort === "value-asc") {
    return "cardmarket.prices.trendPrice,cardmarket.prices.averageSellPrice,tcgplayer.prices.holofoil.market";
  }

  if (sort === "number") return "number,name";

  return "-set.releaseDate,name";
}

function buildSearchQuery(query: string) {
  const cleaned = query.trim();

  if (!cleaned) return "";

  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `name:${word}*`)
    .join(" ");
}

export default function CardsClient({ initialCards }: { initialCards: any[] }) {
  const [cards, setCards] = useState<any[]>(initialCards || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("value-desc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasMore, setHasMore] = useState(
    (initialCards || []).length === PAGE_SIZE
  );
  const [showMenu, setShowMenu] = useState(false);

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sortedCards = useMemo(() => sortCards(cards, sortBy), [cards, sortBy]);
  const isFirstLoad = loading && cards.length === 0;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCards = useCallback(
    async (
      pageNum: number,
      query: string,
      sort: SortOption,
      isReset: boolean
    ) => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const params = new URLSearchParams();

        params.set("pageSize", String(PAGE_SIZE));
        params.set("page", String(pageNum));
        params.set("orderBy", getApiSortQuery(sort));

        const searchQuery = buildSearchQuery(query);

        if (searchQuery) params.set("q", searchQuery);

        const res = await fetch(
          `https://api.pokemontcg.io/v2/cards?${params.toString()}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        const nextCards = data.data || [];

        setCards((prev) => {
          const merged = isReset ? nextCards : [...prev, ...nextCards];

          return Array.from(
            new Map(merged.map((card: any) => [card.id, card])).values()
          );
        });

        setHasMore(nextCards.length === PAGE_SIZE);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("API Error:", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const isInitialServerState =
      debouncedSearch === "" &&
      sortBy === "value-desc" &&
      page === 1 &&
      cards.length > 0;

    if (isInitialServerState) return;

    setCards([]);
    setPage(1);
    setHasMore(true);
    fetchCards(1, debouncedSearch, sortBy, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sortBy, fetchCards]);

  useEffect(() => {
    if (page > 1) fetchCards(page, debouncedSearch, sortBy, false);
  }, [page, debouncedSearch, sortBy, fetchCards]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((currentPage) => currentPage + 1);
        }
      },
      { threshold: 0.25, rootMargin: "360px" }
    );

    const target = observerTarget.current;

    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  return (
    <AppLayout>
      <div className="relative min-h-full w-full overflow-hidden px-4 py-6 text-white sm:px-6 md:px-10 md:py-10">
        <div className="pointer-events-none absolute top-0 right-[-120px] h-80 w-80 rounded-full bg-purple-500/10 blur-[120px] sm:right-24 sm:h-96 sm:w-96 sm:blur-[130px]" />
        <div className="pointer-events-none absolute bottom-20 left-[-140px] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[130px] sm:left-16 sm:h-96 sm:w-96 sm:blur-[150px]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 24 }}
            className="mb-8 flex flex-col gap-6 border-b border-white/[0.05] pb-7 md:mb-10 md:pb-8 xl:flex-row xl:items-end xl:justify-between"
          >
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-purple-400">
                <Database size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.24em] sm:text-[10px] sm:tracking-[0.3em]">
                  Global Database
                </span>
              </div>

              <h1 className="bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl md:text-7xl">
                Global Archive
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                Explore Pokémon TCG cards with official artwork, set details,
                rarity information and available market estimates. Some newer or
                less-traded cards may show no market data until reliable pricing
                becomes available.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
              <div className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-xl transition-all hover:border-purple-500/20 sm:flex-1 xl:w-auto xl:flex-none">
                <Search className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-focus-within:text-purple-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cards..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder-zinc-600 sm:w-64"
                />
              </div>

              <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-3 text-xs font-black uppercase tracking-widest backdrop-blur-xl transition-all hover:border-purple-500/30 sm:w-auto"
                >
                  <ArrowDownUp size={13} className="text-purple-400" />
                  Sort
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-white/[0.08] bg-[#07070a]/95 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:left-auto sm:right-0 sm:w-64"
                    >
                      <div className="flex items-center gap-2 px-3 py-2 text-purple-400">
                        <SlidersHorizontal size={13} />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em]">
                          Sort Archive
                        </span>
                      </div>

                      {[
                        { id: "value-desc", label: "Value high to low" },
                        { id: "value-asc", label: "Value low to high" },
                        { id: "released", label: "Newest release" },
                        { id: "number", label: "Card number" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id as SortOption);
                            setShowMenu(false);
                          }}
                          className={`w-full rounded-xl px-4 py-3 text-left text-[10px] font-black uppercase transition-all ${
                            sortBy === opt.id
                              ? "bg-purple-600 text-white shadow-[0_0_24px_rgba(168,85,247,0.25)]"
                              : "text-zinc-500 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ArchiveStat
              label="Loaded Assets"
              value={sortedCards.length.toString()}
              icon={<Sparkles size={14} />}
            />

            <ArchiveStat
              label="Sort Mode"
              value={
                sortBy === "value-desc"
                  ? "High Value"
                  : sortBy === "value-asc"
                  ? "Low Value"
                  : sortBy === "released"
                  ? "Newest"
                  : "Number"
              }
              icon={<ArrowDownUp size={14} />}
            />

            <ArchiveStat
              label="Status"
              value={loading ? "Syncing" : hasMore ? "Live" : "Complete"}
              icon={
                loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Database size={14} />
                )
              }
            />
          </div>

          {isFirstLoad ? (
            <div className="flex min-h-[45vh] flex-col items-center justify-center">
              <div className="relative mb-6 flex items-center justify-center">
                <div className="absolute h-20 w-20 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                <Loader2 className="relative z-10 h-10 w-10 animate-spin text-purple-400" />
              </div>

              <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
                Loading archive
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {sortedCards.map((card) => (
                <Link key={card.id} href={`/cards/${card.id}`}>
                  <div className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] p-1.5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/20 hover:bg-white/[0.04] hover:shadow-[0_16px_50px_rgba(168,85,247,0.08)] sm:rounded-3xl sm:p-2">
                    <PremiumCard card={card} />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div
            ref={observerTarget}
            className="flex justify-center py-14 sm:py-16"
          >
            {loading && cards.length > 0 && (
              <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-3 text-purple-400 backdrop-blur-xl">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                  Loading more
                </span>
              </div>
            )}

            {!loading && !hasMore && sortedCards.length > 0 && (
              <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-zinc-600">
                End of archive
              </p>
            )}

            {!loading && sortedCards.length === 0 && (
              <div className="max-w-2xl rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 text-center backdrop-blur-2xl">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-400">
                  No cards found
                </p>

                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  The live Pokémon TCG card explorer could not find cards for
                  this search. Try another Pokémon name, set, rarity, or card
                  number.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ArchiveStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-5 backdrop-blur-2xl transition-all hover:border-purple-500/20 sm:rounded-3xl">
      <div className="mb-2 flex items-center gap-2 text-purple-400">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.24em]">
          {label}
        </span>
      </div>

      <p className="text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}