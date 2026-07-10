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
  ArrowDownUp,
  Boxes,
  CalendarDays,
  ChevronDown,
  Layers,
  Loader2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";

type SortOption = "newest" | "oldest" | "largest" | "smallest" | "name";
type SetFilter = "all" | string;

type SetItem = {
  id: string;
  name: string;
  series?: string;
  printedTotal?: number;
  total?: number;
  releaseDate?: string;
  updatedAt?: string;
  images?: {
    symbol?: string;
    logo?: string;
  };
  pokeValueCardCount?: number;
  pokeValueReleaseYear?: string;
  pokeValueReleaseTime?: number;
};

type SetsClientProps = {
  initialSets?: SetItem[];
  series?: string[];
};

const LOAD_STEP = 18;
const INITIAL_VISIBLE = 24;

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sortOptions: { id: SortOption; label: string; description: string }[] = [
  {
    id: "newest",
    label: "Newest sets",
    description: "Latest Pokémon TCG releases first",
  },
  {
    id: "oldest",
    label: "Oldest sets",
    description: "Classic eras and early releases first",
  },
  {
    id: "largest",
    label: "Most cards",
    description: "Sets with the biggest card totals first",
  },
  {
    id: "smallest",
    label: "Fewest cards",
    description: "Smaller specialist sets first",
  },
  {
    id: "name",
    label: "Name",
    description: "Alphabetical set order",
  },
];

function safeNumber(value: unknown, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function formatNumber(value: unknown) {
  return safeNumber(value).toLocaleString();
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

function isSeriesMatch(set: SetItem, selectedSeries: SetFilter) {
  if (selectedSeries === "all") return true;

  return set.series === selectedSeries;
}

function getCardCount(set: SetItem) {
  return safeNumber(set.pokeValueCardCount ?? set.printedTotal ?? set.total);
}

function getReleaseYear(set: SetItem) {
  return set.pokeValueReleaseYear || "—";
}

function getReleaseTime(set: SetItem) {
  return safeNumber(set.pokeValueReleaseTime);
}

export default function SetsClient({
  initialSets = [],
  series = [],
}: SetsClientProps) {
  const shouldReduceMotion = useReducedMotion();

  const safeSets = Array.isArray(initialSets) ? initialSets : [];
  const safeSeries = Array.isArray(series) ? series : [];

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedSeries, setSelectedSeries] = useState<SetFilter>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showSeriesMenu, setShowSeriesMenu] = useState(false);
  const [softLoading, setSoftLoading] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const seriesDropdownRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const activeSort = useMemo(
    () => sortOptions.find((option) => option.id === sortBy),
    [sortBy]
  );

  const filteredSets = useMemo(() => {
    const query = normalizeSearch(search);

    return [...safeSets]
      .filter((set) => {
        if (!isSeriesMatch(set, selectedSeries)) return false;

        if (!query) return true;

        const searchable = normalizeSearch(
          [
            set.id,
            set.name,
            set.series,
            set.releaseDate,
            getReleaseYear(set),
          ]
            .filter(Boolean)
            .join(" ")
        );

        return searchable.includes(query);
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          const releaseDiff = getReleaseTime(b) - getReleaseTime(a);
          if (releaseDiff !== 0) return releaseDiff;
          return String(a.name || "").localeCompare(String(b.name || ""));
        }

        if (sortBy === "oldest") {
          const releaseDiff = getReleaseTime(a) - getReleaseTime(b);
          if (releaseDiff !== 0) return releaseDiff;
          return String(a.name || "").localeCompare(String(b.name || ""));
        }

        if (sortBy === "largest") {
          const cardDiff = getCardCount(b) - getCardCount(a);
          if (cardDiff !== 0) return cardDiff;
          return String(a.name || "").localeCompare(String(b.name || ""));
        }

        if (sortBy === "smallest") {
          const cardDiff = getCardCount(a) - getCardCount(b);
          if (cardDiff !== 0) return cardDiff;
          return String(a.name || "").localeCompare(String(b.name || ""));
        }

        return String(a.name || "").localeCompare(String(b.name || ""));
      });
  }, [safeSets, search, selectedSeries, sortBy]);

  const visibleSets = filteredSets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSets.length;
  const newestSet = safeSets[0];

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [search, selectedSeries, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortMenu(false);
      }

      if (
        seriesDropdownRef.current &&
        !seriesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSeriesMenu(false);
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
        if (visibleCount >= filteredSets.length) return;

        loadingRef.current = true;
        setSoftLoading(true);

        window.setTimeout(() => {
          setVisibleCount((current) =>
            Math.min(current + LOAD_STEP, filteredSets.length)
          );
          setSoftLoading(false);
          loadingRef.current = false;
        }, 180);
      },
      {
        root: null,
        rootMargin: "360px 0px 560px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [filteredSets.length, visibleCount]);

  return (
    <AppLayout>
      <main className="relative min-h-full overflow-hidden bg-[#060607] px-4 py-6 text-white sm:px-6 lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            aria-hidden
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.55, 0.82, 0.55],
                    scale: [1, 1.06, 1],
                  }
            }
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-[-360px] h-[760px] w-[1080px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.12),transparent_68%)] blur-3xl"
          />

          <motion.div
            aria-hidden
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, -32, 0],
                    opacity: [0.34, 0.58, 0.34],
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[-320px] top-[320px] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(126,34,206,0.075),transparent_70%)] blur-3xl"
          />

          <motion.div
            aria-hidden
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, 26, 0],
                    y: [0, -18, 0],
                    opacity: [0.25, 0.5, 0.25],
                  }
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[-340px] left-[-300px] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.055),transparent_72%)] blur-3xl"
          />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_50%_18%,black,transparent_72%)]" />
        </div>

        <div className="relative mx-auto max-w-[1540px]">
          <motion.section
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: smoothEase }}
            className="mb-6 overflow-hidden rounded-[2.4rem] border border-white/[0.075] bg-[linear-gradient(135deg,rgba(255,255,255,0.065),rgba(255,255,255,0.018))] shadow-[0_38px_150px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:mb-8"
          >
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.04),transparent_36%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-200/35 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/22 to-transparent" />

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
                className="pointer-events-none absolute top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
              />

              <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_390px] lg:items-end lg:p-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/12 bg-violet-500/[0.045] px-3 py-2 text-violet-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                      Premium Set Explorer
                    </span>
                  </div>

                  <h1 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                    A glass-grade Pokémon set archive.
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                    Browse every Pokémon TCG era with the same premium glass
                    treatment as the card explorer, plus fast search, series
                    filtering, release data and smooth infinite loading.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <HeroMetric
                    label="Database"
                    value={formatNumber(safeSets.length)}
                    icon={<Boxes className="h-4 w-4" />}
                  />

                  <HeroMetric
                    label="Visible"
                    value={formatNumber(visibleSets.length)}
                    icon={<Sparkles className="h-4 w-4" />}
                  />

                  <HeroMetric
                    label="Matches"
                    value={formatNumber(filteredSets.length)}
                    icon={<Search className="h-4 w-4" />}
                  />

                  <HeroMetric
                    label="Newest"
                    value={getReleaseYear(newestSet || {})}
                    icon={<CalendarDays className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.04, ease: smoothEase }}
            className="sticky top-[76px] z-30 mb-8 rounded-[1.85rem] border border-white/[0.075] bg-[rgba(7,7,10,0.9)] p-3 shadow-[0_26px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-4"
          >
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="group flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.065)] transition-colors duration-200 focus-within:border-white/[0.18] focus-within:bg-white/[0.045]">
                <Search className="h-4 w-4 shrink-0 text-zinc-500 transition-colors duration-200 group-focus-within:text-zinc-300" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search sets, eras, series, or release years..."
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

              <div className="grid gap-3 sm:grid-cols-2 xl:flex">
                <div className="relative" ref={seriesDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSeriesMenu((value) => !value);
                      setShowSortMenu(false);
                    }}
                    className="flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.065)] transition-colors duration-200 hover:border-white/[0.15] hover:bg-white/[0.045] xl:w-64"
                    aria-expanded={showSeriesMenu}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-500/[0.045] text-violet-200/80">
                        <Layers className="h-4 w-4" />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                          Series
                        </span>
                        <span className="block truncate text-sm font-bold text-white">
                          {selectedSeries === "all" ? "All eras" : selectedSeries}
                        </span>
                      </span>
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${
                        showSeriesMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showSeriesMenu && (
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
                        className="absolute right-0 top-full z-50 mt-2 max-h-[420px] w-full overflow-auto rounded-2xl border border-white/[0.11] bg-[rgba(7,7,12,0.98)] p-2 shadow-[0_34px_100px_rgba(0,0,0,0.62)] backdrop-blur-2xl xl:w-80"
                      >
                        <SeriesButton
                          active={selectedSeries === "all"}
                          label="All eras"
                          onClick={() => {
                            setSelectedSeries("all");
                            setShowSeriesMenu(false);
                          }}
                        />

                        {safeSeries.map((item) => (
                          <SeriesButton
                            key={item}
                            active={selectedSeries === item}
                            label={item}
                            onClick={() => {
                              setSelectedSeries(item);
                              setShowSeriesMenu(false);
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative" ref={sortDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSortMenu((value) => !value);
                      setShowSeriesMenu(false);
                    }}
                    className="flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.065)] transition-colors duration-200 hover:border-white/[0.15] hover:bg-white/[0.045] xl:w-64"
                    aria-expanded={showSortMenu}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-500/[0.045] text-violet-200/80">
                        <ArrowDownUp className="h-4 w-4" />
                      </span>

                      <span>
                        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                          Sort
                        </span>
                        <span className="block text-sm font-bold text-white">
                          {activeSort?.label || "Newest sets"}
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
                        className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/[0.11] bg-[rgba(7,7,12,0.98)] p-2 shadow-[0_34px_100px_rgba(0,0,0,0.62)] backdrop-blur-2xl xl:w-80"
                      >
                        <div className="flex items-center gap-2 px-3 py-2 text-violet-200/80">
                          <SlidersHorizontal className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                            Sort archive
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
                                  ? "bg-gradient-to-r from-violet-800/90 to-indigo-800/80 text-white shadow-[0_16px_42px_rgba(76,29,149,0.22)]"
                                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                              }`}
                            >
                              <span className="block text-sm font-bold">
                                {option.label}
                              </span>
                              <span
                                className={`mt-0.5 block text-xs leading-5 ${
                                  sortBy === option.id
                                    ? "text-violet-100/70"
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
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <StatusPill>
                {search ? "Filtered results" : "Full archive"}
              </StatusPill>
              <StatusPill>
                {selectedSeries === "all" ? "All eras" : selectedSeries}
              </StatusPill>
              <StatusPill>{activeSort?.label || "Newest sets"}</StatusPill>
            </div>
          </motion.section>

          {visibleSets.length > 0 ? (
            <section className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
              {visibleSets.map((set, index) => (
                <SetTile
                  key={set.id}
                  set={set}
                  index={index}
                  reduceMotion={Boolean(shouldReduceMotion)}
                />
              ))}
            </section>
          ) : (
            <EmptyState search={search} />
          )}

          <div ref={loaderRef} className="h-1 w-full" />

          <div className="flex min-h-28 items-center justify-center py-10">
            {softLoading && hasMore && (
              <div className="flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.045] px-5 py-3 text-violet-200/80 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em]">
                  Loading more sets
                </span>
              </div>
            )}

            {!softLoading && !hasMore && visibleSets.length > 0 && (
              <p className="rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-center text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
                End of archive
              </p>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

function SetTile({
  set,
  index,
  reduceMotion,
}: {
  set: SetItem;
  index: number;
  reduceMotion: boolean;
}) {
  const logo = set.images?.logo || "";
  const symbol = set.images?.symbol || "";
  const releaseDate = formatReleaseDate(set.releaseDate);
  const cardCount = getCardCount(set);

  return (
    <motion.div
      initial={
        reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.99 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: Math.min((index % 10) * 0.016, 0.14),
        ease: smoothEase,
      }}
      className="h-full overflow-visible py-1"
    >
      <Link
        href={`/sets/${set.id}`}
        prefetch={false}
        className="group block h-full cursor-pointer"
      >
        <article className="relative flex h-full min-h-[228px] overflow-hidden rounded-[1.75rem] border border-white/[0.055] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.004))] p-[1px] shadow-[0_20px_62px_rgba(0,0,0,0.44)] backdrop-blur-2xl transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.1] hover:shadow-[0_30px_96px_rgba(50,20,100,0.17)]">
          <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.008)_30%,rgba(76,29,149,0.04)_58%,rgba(30,64,175,0.01)_78%,rgba(255,255,255,0.02))] opacity-45 transition-opacity duration-300 group-hover:opacity-90" />

          <div className="relative grid h-full w-full grid-cols-[132px_minmax(0,1fr)] overflow-hidden rounded-[1.7rem] border border-white/[0.045] bg-[rgba(4,4,7,0.97)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] sm:grid-cols-[220px_minmax(0,1fr)] sm:p-4">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(139,92,246,0.075),transparent_34%),radial-gradient(circle_at_88%_92%,rgba(59,130,246,0.028),transparent_38%)]" />
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className="absolute -inset-12 rounded-full bg-violet-950/20 blur-3xl" />
            </div>

            <div className="pointer-events-none absolute -left-[120%] top-0 z-20 h-full w-[76%] -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[300%]" />

            <div className="relative z-10 min-h-[198px] overflow-hidden rounded-[1.35rem] border border-white/[0.055] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.065),rgba(13,13,18,0.98)_46%,rgba(4,4,7,1))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:30px_30px] opacity-60" />

              <div className="absolute left-2 top-2 z-20 rounded-full border border-white/[0.09] bg-black/55 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-zinc-400 backdrop-blur-xl">
                {getReleaseYear(set)}
              </div>

              <div className="absolute right-2 top-2 z-20 rounded-full border border-white/[0.075] bg-black/50 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-zinc-500 backdrop-blur-xl">
                {String(set.id || "SET").toUpperCase().slice(0, 8)}
              </div>

              {symbol && (
                <div className="pointer-events-none absolute bottom-3 right-3 z-10 h-11 w-11 opacity-20">
                  <Image
                    src={symbol}
                    alt=""
                    fill
                    quality={65}
                    loading="lazy"
                    sizes="44px"
                    className="object-contain"
                  />
                </div>
              )}

              <div className="relative h-full min-h-[198px] w-full">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(91,33,182,0.07),transparent_48%)]" />

                {logo ? (
                  <Image
                    src={logo}
                    alt={`${set.name} logo`}
                    fill
                    quality={65}
                    loading="lazy"
                    sizes="(max-width: 640px) 42vw, (max-width: 1280px) 34vw, 24vw"
                    className="object-contain p-5 drop-shadow-[0_20px_26px_rgba(0,0,0,0.42)] transition-transform duration-300 ease-out group-hover:scale-[1.025] sm:p-7"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-5 text-center text-lg font-black leading-6 text-zinc-100">
                    {set.name || "Unknown Set"}
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 flex min-w-0 flex-col py-1 pl-3 sm:pl-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-700">
                  {set.series || "Pokémon TCG"}
                </p>

                <h2 className="mt-2 line-clamp-2 text-lg font-black leading-6 tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-white sm:text-xl">
                  {set.name || "Unknown Set"}
                </h2>

                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-zinc-600">
                  Explore cards, release details and market data from this set.
                </p>
              </div>

              <div className="mt-auto pt-4">
                <div className="flex gap-2.5">
                  <div className="min-w-0 flex-1 rounded-2xl border border-white/[0.05] bg-black/20 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                    <div className="mb-1.5 flex items-center gap-1.5 text-zinc-600">
                      <Layers className="h-3.5 w-3.5" />
                      <span className="text-[8px] font-black uppercase tracking-[0.18em]">
                        Cards
                      </span>
                    </div>
                    <p className="text-sm font-black text-zinc-200">
                      {formatNumber(cardCount)}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1 rounded-2xl border border-white/[0.05] bg-black/20 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                    <div className="mb-1.5 flex items-center gap-1.5 text-zinc-600">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span className="text-[8px] font-black uppercase tracking-[0.18em]">
                        Released
                      </span>
                    </div>
                    <p className="truncate text-xs font-black text-zinc-300">
                      {releaseDate}
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/[0.065] to-transparent transition-colors duration-300 group-hover:via-white/[0.12]" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

function SeriesButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-3 text-left text-sm font-bold transition-colors duration-150 ${
        active
          ? "bg-gradient-to-r from-violet-800/90 to-indigo-800/80 text-white shadow-[0_16px_42px_rgba(76,29,149,0.22)]"
          : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {label}
    </button>
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

        <span className="text-violet-200/80">{icon}</span>
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

function EmptyState({ search }: { search: string }) {
  return (
    <div className="mx-auto flex min-h-[360px] max-w-2xl items-center justify-center">
      <div className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-8 text-center shadow-[0_30px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-500/[0.045] text-violet-200/80">
          <Search className="h-6 w-6" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-200/80">
          No sets found
        </p>

        <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
          Try a different search
        </h2>

        <p className="mt-3 text-sm leading-7 text-zinc-500">
          The PokeValue set archive could not find sets matching{" "}
          <span className="font-bold text-zinc-300">
            {search ? `"${search}"` : "that query"}
          </span>
          . Search by set name, series, era, or release year.
        </p>
      </div>
    </div>
  );
}
