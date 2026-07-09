"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import {
  Search,
  Sparkles,
  Database,
  CalendarDays,
  Layers,
  PackageOpen,
  ChevronRight,
} from "lucide-react";

type TcgSet = {
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
};

const gridVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 24,
      mass: 0.75,
    },
  },
};

function formatReleaseDate(date?: string) {
  if (!date) {
    return "Unknown";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SetsClient({ initialSets }: { initialSets: TcgSet[] }) {
  const router = useRouter();

  const [sets] = useState<TcgSet[]>(initialSets || []);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return sets;
    }

    return sets.filter((set) => {
      return (
        set.name.toLowerCase().includes(query) ||
        String(set.series || "")
          .toLowerCase()
          .includes(query) ||
        String(set.id || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [searchQuery, sets]);

  const totalCards = useMemo(() => {
    return filteredSets.reduce((sum, set) => sum + Number(set.total || 0), 0);
  }, [filteredSets]);

  const seriesCount = useMemo(() => {
    return new Set(filteredSets.map((set) => set.series).filter(Boolean)).size;
  }, [filteredSets]);

  const handleSetClick = (set: TcgSet) => {
    router.push(`/sets/${set.id}`);
  };

  return (
    <AppLayout>
      <style jsx global>{`
        .sets-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .sets-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sets-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.22);
          border-radius: 999px;
        }

        .sets-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }

        .set-card-shine {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }

        .set-card-shine::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: linear-gradient(
            110deg,
            transparent 35%,
            rgba(255, 255, 255, 0.14) 48%,
            rgba(168, 85, 247, 0.2) 52%,
            transparent 65%
          );
          transform: translateX(-120%) rotate(8deg);
          pointer-events: none;
          z-index: 20;
        }

        .set-card-shine:hover::after {
          animation: setPremiumShine 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes setPremiumShine {
          from {
            transform: translateX(-120%) rotate(8deg);
          }

          to {
            transform: translateX(120%) rotate(8deg);
          }
        }
      `}</style>

      <div className="relative min-h-full w-full overflow-hidden px-4 py-6 text-white sm:px-6 md:px-10 md:py-10">
        <div className="pointer-events-none absolute top-0 right-[-120px] h-80 w-80 rounded-full bg-purple-500/10 blur-[120px] sm:right-24 sm:h-96 sm:w-96 sm:blur-[130px]" />
        <div className="pointer-events-none absolute bottom-20 left-[-140px] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[130px] sm:left-16 sm:h-96 sm:w-96 sm:blur-[150px]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.header
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 22,
            }}
            className="mb-8 border-b border-white/[0.05] pb-7 md:mb-10 md:pb-8"
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2 text-purple-400">
                  <Database size={14} />

                  <span className="text-[9px] font-black uppercase tracking-[0.24em] sm:text-[10px] sm:tracking-[0.3em]">
                    Set Intelligence
                  </span>
                </div>

                <h1 className="bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl md:text-7xl">
                  Set Explorer
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                  Browse Pokémon TCG sets, expansions, release dates, logos,
                  symbols and card counts from the global archive. Each set
                  links to a full card list with estimated market data where
                  available.
                </p>
              </div>

              <div className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-xl transition-all hover:border-purple-500/20 xl:w-auto">
                <Search className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-focus-within:text-purple-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sets..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder-zinc-600 sm:w-72"
                />
              </div>
            </div>
          </motion.header>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <DirectoryStat
              label="Sets Online"
              value={filteredSets.length.toString()}
              icon={<Sparkles size={14} />}
            />

            <DirectoryStat
              label="Total Cards"
              value={totalCards.toLocaleString("en-GB")}
              icon={<PackageOpen size={14} />}
            />

            <DirectoryStat
              label="Series"
              value={seriesCount.toString()}
              icon={<Layers size={14} />}
            />
          </div>

          {sets.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-10 text-center backdrop-blur-2xl sm:p-12">
              <PackageOpen className="mx-auto mb-4 text-purple-400" size={36} />

              <h2 className="mb-2 text-2xl font-black">Set data unavailable</h2>

              <p className="mx-auto max-w-2xl text-zinc-500">
                The live Pokémon TCG set directory could not be loaded right
                now. PokeValue normally displays official Pokémon set names,
                series, release dates, logos, symbols and card counts here.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredSets.map((set) => (
                    <motion.button
                      key={set.id}
                      type="button"
                      variants={cardVariants}
                      layout="position"
                      whileHover={{
                        y: -6,
                        scale: 1.012,
                      }}
                      whileTap={{
                        scale: 0.985,
                      }}
                      onClick={() => handleSetClick(set)}
                      className="group set-card-shine relative rounded-[1.75rem] border border-white/[0.06] bg-white/[0.03] p-4 text-left backdrop-blur-2xl transition-all hover:border-purple-500/30 hover:bg-white/[0.05] hover:shadow-[0_24px_90px_rgba(168,85,247,0.12)] sm:rounded-[2rem] sm:p-5"
                    >
                      <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-purple-500/12 via-transparent to-fuchsia-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-[2rem]" />

                      <div className="relative z-10">
                        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.05] bg-black/25 p-4 sm:h-32 sm:rounded-3xl sm:p-5">
                          <div className="absolute h-24 w-24 rounded-full bg-purple-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                          {set.images?.logo ? (
                            <img
                              src={set.images.logo}
                              alt={set.name}
                              className="relative z-10 max-h-full max-w-[88%] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]"
                            />
                          ) : set.images?.symbol ? (
                            <img
                              src={set.images.symbol}
                              alt={set.name}
                              className="relative z-10 max-h-20 object-contain opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                            />
                          ) : (
                            <PackageOpen className="relative z-10 h-10 w-10 text-zinc-700" />
                          )}
                        </div>

                        <div className="mt-5 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-black text-white sm:text-base">
                              {set.name}
                            </h3>

                            <p className="mt-1 truncate text-xs text-zinc-500">
                              {set.series || "Unknown Series"}
                            </p>
                          </div>

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300 transition-all group-hover:border-purple-400/40 group-hover:bg-purple-600 group-hover:text-white">
                            <ChevronRight size={16} />
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <SetMeta
                            icon={<CalendarDays size={13} />}
                            label="Released"
                            value={formatReleaseDate(set.releaseDate)}
                          />

                          <SetMeta
                            icon={<PackageOpen size={13} />}
                            label="Cards"
                            value={`${set.printedTotal || 0}/${set.total || 0}`}
                          />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredSets.length === 0 && (
                <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-10 text-center backdrop-blur-2xl sm:p-12">
                  <PackageOpen
                    className="mx-auto mb-4 text-purple-400"
                    size={36}
                  />

                  <h2 className="mb-2 text-2xl font-black">No sets found</h2>

                  <p className="text-zinc-500">
                    Try searching for another set name, expansion code or
                    Pokémon TCG series.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function DirectoryStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
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

      <p className="text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function SetMeta({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-3">
      <div className="mb-1 flex items-center gap-2 text-purple-400">
        {icon}

        <span className="text-[8px] font-black uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>

      <p className="truncate text-xs font-bold text-zinc-300">{value}</p>
    </div>
  );
}