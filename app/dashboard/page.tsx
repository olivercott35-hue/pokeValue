"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Box, TrendingUp, Zap, BarChart3, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [sets, setSets] = useState<any[]>([]);
  const [collectionCount, setCollectionCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animateGrid, setAnimateGrid] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          "https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate"
        );

        const data = await res.json();
        setSets((data.data || []).slice(0, 24));

        const collection = JSON.parse(
          localStorage.getItem("collection") || "[]"
        );

        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

        setCollectionCount(Array.isArray(collection) ? collection.length : 0);
        setFavoritesCount(Array.isArray(favorites) ? favorites.length : 0);

        setTimeout(() => {
          setAnimateGrid(true);
        }, 50);
      } catch (err) {
        console.error("Failed to load terminal asset intelligence:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AppLayout>
      <style jsx global>{`
        @keyframes premiumGlint {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }

          100% {
            transform: translateX(100%) skewX(-15deg);
          }
        }

        .elite-shine {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }

        .elite-shine::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent,
            rgba(255, 255, 255, 0.08) 25%,
            rgba(255, 255, 255, 0.22) 50%,
            transparent 75%
          );
          transform: translateX(-100%);
          pointer-events: none;
          z-index: 10;
        }

        .elite-shine:hover::after {
          animation: premiumGlint 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .custom-card-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-card-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-card-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.22);
          border-radius: 99px;
        }

        .custom-card-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.55);
        }
      `}</style>

      <main className="relative w-full min-h-full bg-transparent text-white font-sans px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 selection:bg-purple-500/30">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-12%] left-[-20%] h-[360px] w-[360px] rounded-full bg-purple-600/[0.08] blur-[120px] sm:left-[-8%] sm:h-[520px] sm:w-[520px]" />
          <div className="absolute bottom-[-18%] right-[-25%] h-[380px] w-[380px] rounded-full bg-fuchsia-600/[0.06] blur-[140px] sm:right-[-8%] sm:h-[520px] sm:w-[520px]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 130,
              damping: 24,
            }}
            className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.025] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-8 lg:p-10"
          >
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/35 to-transparent" />
            <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-purple-500/10 blur-[90px]" />

            <div className="relative max-w-5xl space-y-4">
              <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.28em] text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] sm:text-[10px] sm:tracking-[0.4em]">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7] animate-pulse" />
                PokeValue Terminal Core
              </span>

              <h1 className="max-w-4xl bg-gradient-to-br from-white to-white/50 bg-clip-text text-4xl font-black leading-[0.95] tracking-tight text-transparent drop-shadow-sm sm:text-5xl lg:text-6xl">
                Pokémon TCG Market Engine
              </h1>

              <p className="max-w-3xl text-sm font-medium leading-relaxed text-zinc-400 sm:text-base">
                High-tier tracking matrix, valuation models, and elite asset
                cataloging interfaces for serious portfolio collectors.
              </p>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <button
                  onClick={() => router.push("/cards")}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 px-6 py-3 text-xs font-black tracking-wide text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95 sm:w-auto"
                >
                  Browse Cards
                </button>

                <button
                  onClick={() => router.push("/sets")}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-black tracking-wide text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 active:scale-95 sm:w-auto"
                >
                  Explore Sets
                </button>
              </div>
            </div>
          </motion.section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Sets"
              value="173.00"
              icon={<Box className="h-4 w-4 text-purple-400" />}
            />

            <StatCard
              title="My Collection"
              value={collectionCount.toString()}
              trend="+2.40%"
              icon={<TrendingUp className="h-4 w-4 text-purple-400" />}
            />

            <StatCard
              title="Cards Tracked"
              value={
                favoritesCount > 0 ? favoritesCount.toLocaleString() : "22,847"
              }
              icon={<Zap className="h-4 w-4 text-purple-400" />}
            />

            <StatCard
              title="Market Activity"
              value="98.40%"
              trend="+0.60%"
              icon={<BarChart3 className="h-4 w-4 text-purple-400" />}
            />
          </section>

          <section className="flex min-h-0 flex-col gap-4 rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-4 backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 sm:text-[11px]">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Live Active Expansions
              </h2>

              <button
                onClick={() => router.push("/sets")}
                className="w-full rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-purple-300 transition-colors hover:border-purple-500/35 hover:bg-purple-500/15 sm:w-auto"
              >
                Open Terminal Catalog →
              </button>
            </div>

            <div className="custom-card-scrollbar max-h-none w-full overflow-visible pr-0 sm:max-h-[560px] sm:overflow-y-auto sm:pr-2">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="flex min-h-[260px] w-full flex-col items-center justify-center">
                    <div className="relative mb-4 flex items-center justify-center">
                      <div className="absolute h-12 w-12 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                      <div className="relative z-10 h-8 w-8 rounded-full border-2 border-white/10 border-t-purple-400 animate-spin" />
                    </div>
                  </div>
                ) : (
                  <div className="grid w-full grid-cols-1 gap-4 py-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sets.map((set, index) => (
                      <button
                        key={set.id}
                        type="button"
                        onClick={() => router.push(`/sets/${set.id}`)}
                        style={{
                          transitionDelay: animateGrid
                            ? `${index * 28}ms`
                            : "0ms",
                        }}
                        className={`group elite-shine relative flex h-[178px] cursor-pointer flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-3 text-left backdrop-blur-lg transition-all duration-500 hover:-translate-y-1.5 hover:border-purple-500/40 hover:bg-white/[0.045] hover:shadow-[0_15px_35px_-10px_rgba(168,85,247,0.25)] sm:h-[200px] sm:p-4 ${
                          animateGrid
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-5 scale-[0.99] opacity-0"
                        }`}
                      >
                        <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                        <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#030305]/50 p-4 shadow-inner transition-colors duration-500 group-hover:border-white/10 group-hover:bg-[#030305]/80 sm:h-28">
                          <div className="absolute inset-0 bg-purple-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                          {set?.images?.logo ? (
                            <img
                              src={set.images.logo}
                              alt={set.name}
                              className="relative z-10 max-h-full max-w-[88%] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]"
                            />
                          ) : (
                            <div className="relative z-10 text-xs font-black uppercase tracking-widest text-zinc-600">
                              No Logo
                            </div>
                          )}
                        </div>

                        <div className="relative z-10 flex items-center justify-between gap-3 px-1 pt-2">
                          <h3 className="min-w-0 truncate text-[12px] font-black uppercase tracking-wide text-zinc-300 drop-shadow-md transition-colors duration-300 group-hover:text-white">
                            {set.name}
                          </h3>

                          <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] font-black tracking-wider text-zinc-400 shadow-sm transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 group-hover:text-purple-400">
                            {set.printedTotal || set.total} CARDS
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <div className="group relative flex min-h-[92px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-4 shadow-[0_4px_15px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.045] hover:shadow-[0_10px_25px_-5px_rgba(168,85,247,0.2)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <span className="mt-0.5 truncate text-[9px] font-black uppercase tracking-widest text-zinc-400 transition-colors group-hover:text-zinc-300">
          {title}
        </span>

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] shadow-sm transition-all duration-500 group-hover:border-purple-500/40 group-hover:bg-purple-500/20">
          {icon}
        </div>
      </div>

      <div className="relative z-10 mt-3 flex items-end justify-between gap-2">
        <h3 className="font-mono text-2xl font-black leading-none tracking-tight text-white sm:text-xl">
          {value}
        </h3>

        {trend && (
          <span className="flex items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold leading-none text-emerald-400 shadow-sm">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}