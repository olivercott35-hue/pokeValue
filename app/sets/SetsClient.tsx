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
  Clock,
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

const LOAD_STEP = 30;
const INITIAL_VISIBLE = 45;

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
        rootMargin: "340px 0px 520px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [filteredSets.length, visibleCount]);

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
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/22 to-transparent" />

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

              <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_410px] lg:items-end lg:p-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/20 bg-purple-300/[0.09] px-3 py-2 text-purple-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                      Premium Set Explorer
                    </span>
                  </div>

                  <h1 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                    Explore every Pokémon TCG era in glass.
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                    Browse Pokémon sets through a premium glass archive with
                    animated holographic tiles, fast search, era filtering,
                    release data and smooth infinite-style loading.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <HeroMetric
                    label="Sets"
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
            className="sticky top-[76px] z-30 mb-8 rounded-[1.85rem] border border-white/[0.1] bg-[rgba(8,8,14,0.82)] p-3 shadow-[0_26px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-4"
          >
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="group flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/[0.085] bg-white/[0.045] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.065)] transition-colors duration-200 focus-within:border-purple-200/45 focus-within:bg-white/[0.065]">
                <Search className="h-4 w-4 shrink-0 text-zinc-500 transition-colors duration-200 group-focus-within:text-purple-100" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search sets, eras, series or release years..."
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
                    onClick={() => setShowSeriesMenu((value) => !value)}
                    className="flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.085] bg-white/[0.045] px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.065)] transition-colors duration-200 hover:border-purple-200/35 hover:bg-white/[0.065] xl:w-72"
                    aria-expanded={showSeriesMenu}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-200/16 bg-purple-300/[0.1] text-purple-100">
                        <Layers className="h-4 w-4" />
                      </span>

                      <span>
                        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                          Series
                        </span>
                        <span className="block max-w-[170px] truncate text-sm font-bold text-white">
                          {selectedSeries === "all" ? "All eras" : selectedSeries}
                        </span>
                      </span>
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
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
                    onClick={() => setShowSortMenu((value) => !value)}
                    className="flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.085] bg-white/[0.045] px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.065)] transition-colors duration-200 hover:border-purple-200/35 hover:bg-white/[0.065] xl:w-72"
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
                        <div className="flex items-center gap-2 px-3 py-2 text-purple-100">
                          <SlidersHorizontal className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                            Sort sets
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
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <StatusPill>
                {search ? "Filtered results" : "Full set archive"}
              </StatusPill>
              <StatusPill>
                {selectedSeries === "all" ? "All eras" : selectedSeries}
              </StatusPill>
              <StatusPill>{activeSort?.label || "Newest sets"}</StatusPill>
            </div>
          </motion.section>

          {visibleSets.length > 0 ? (
            <section className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
              <div className="flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.045] px-5 py-3 text-purple-100 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em]">
                  Loading more sets
                </span>
              </div>
            )}

            {!softLoading && !hasMore && visibleSets.length > 0 && (
              <p className="rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-center text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
                End of set archive
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
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: Math.min((index % 12) * 0.018, 0.16),
        ease: smoothEase,
      }}
      className="h-full"
    >
      <Link href={`/sets/${set.id}`} prefetch={true} className="group block h-full">
        <article className="relative flex h-full min-h-[330px] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.025))] p-[1px] shadow-[0_20px_62px_rgba(0,0,0,0.36)] backdrop-blur-2xl transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_96px_rgba(139,92,246,0.24)]">
          <div className="absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.035)_28%,rgba(168,85,247,0.12)_50%,rgba(56,189,248,0.06)_72%,rgba(255,255,255,0.08))] opacity-55 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative flex h-full w-full overflow-hidden rounded-[1.7rem] border border-white/[0.06] bg-[rgba(13,13,18,0.78)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(216,180,254,0.22),transparent_38%),radial-gradient(circle_at_20%_90%,rgba(56,189,248,0.12),transparent_36%)]" />
              <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/75 to-transparent" />
              <div className="absolute -inset-10 rounded-full bg-purple-400/10 blur-2xl" />
            </div>

            <div className="pointer-events-none absolute -left-[120%] top-0 h-full w-[85%] -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.13] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]" />

            <div className="relative flex h-full w-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-full border border-white/[0.11] bg-black/42 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-xl">
                  {getReleaseYear(set)}
                </div>

                {symbol ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.05] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <Image
                      src={symbol}
                      alt={`${set.name} symbol`}
                      fill
                      sizes="40px"
                      className="object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] text-zinc-600">
                    <Boxes className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="relative mt-6 flex h-28 items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),rgba(21,21,28,0.98)_48%,rgba(7,7,10,1))] px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70" />

                {logo ? (
                  <Image
                    src={logo}
                    alt={`${set.name} logo`}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 25vw"
                    className="object-contain p-6 drop-shadow-[0_18px_26px_rgba(0,0,0,0.36)] transition-transform duration-300 ease-out group-hover:scale-[1.025]"
                  />
                ) : (
                  <h2 className="relative text-center text-2xl font-black tracking-tight text-white">
                    {set.name}
                  </h2>
                )}
              </div>

              <div className="mt-5 flex flex-1 flex-col">
                <div className="min-h-[74px]">
                  <h2 className="line-clamp-2 text-xl font-black leading-6 tracking-tight text-white">
                    {set.name || "Unknown Set"}
                  </h2>

                  <p className="mt-2 line-clamp-1 text-sm font-semibold text-zinc-500">
                    {set.series || "Pokémon TCG"}
                  </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <SetStat
                    label="Cards"
                    value={formatNumber(cardCount)}
                    icon={<Layers className="h-3.5 w-3.5" />}
                  />

                  <SetStat
                    label="Released"
                    value={releaseDate}
                    icon={<Clock className="h-3.5 w-3.5" />}
                  />
                </div>

                <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

function SetStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.075] bg-white/[0.04] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]">
      <div className="mb-1.5 flex items-center gap-1.5 text-purple-100">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
          {label}
        </span>
      </div>

      <p className="truncate text-xs font-black text-zinc-200">{value}</p>
    </div>
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
          ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-[0_16px_42px_rgba(168,85,247,0.24)]"
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

function EmptyState({ search }: { search: string }) {
  return (
    <div className="mx-auto flex min-h-[360px] max-w-2xl items-center justify-center">
      <div className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-8 text-center shadow-[0_30px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-200/15 bg-purple-300/[0.09] text-purple-100">
          <Search className="h-6 w-6" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-100">
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
          . Search by set name, series, era or release year.
        </p>
      </div>
    </div>
  );
}