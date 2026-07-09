"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import PremiumCard from "@/components/PremiumCard";
import {
  Star,
  Heart,
  Plus,
  Search,
  Trash2,
  Sparkles,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const gridVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 160,
      damping: 25,
      mass: 0.7,
    },
  },
};

function hasPriceData(card: any) {
  const cm = card?.cardmarket?.prices;
  const tcg = card?.tcgplayer?.prices;
  const firstTcg: any = tcg ? Object.values(tcg)[0] : null;

  const candidates = [
    cm?.trendPrice,
    cm?.averageSellPrice,
    cm?.avg7,
    cm?.avg30,
    firstTcg?.market,
    firstTcg?.mid,
    firstTcg?.low,
    firstTcg?.high,
  ];

  return candidates.some((candidate) => {
    const value = Number(candidate);
    return !Number.isNaN(value) && value > 0;
  });
}

export default function FavoritesPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      setCards(Array.isArray(saved) ? saved : []);
    } catch {
      setCards([]);
    }
  }, []);

  const removeFavorite = (cardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = cards.filter((card) => card.id !== cardId);

    setCards(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const visibleCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return cards;
    }

    return cards.filter((card) => {
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
    });
  }, [cards, searchQuery]);

  const pricedCards = useMemo(() => {
    return cards.filter((card) => hasPriceData(card)).length;
  }, [cards]);

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
                <Star size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Curated Selection
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
                Favorite Assets
              </h1>

              <p className="text-zinc-500 mt-3 max-w-2xl">
                {cards.length} pinned cards saved to your personal gallery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="group flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 backdrop-blur-xl hover:border-purple-500/20 transition-all">
                <Search className="w-4 h-4 text-zinc-600 group-focus-within:text-purple-400 transition-colors" />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search favorites..."
                  className="bg-transparent outline-none text-sm w-full sm:w-64 text-white placeholder-zinc-600"
                />
              </div>

              <Link
                href="/cards"
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                <Plus size={14} />
                Add Assets
              </Link>
            </div>
          </motion.header>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FavoriteStat
              label="Pinned Assets"
              value={cards.length.toString()}
              icon={<WalletCards size={14} />}
            />

            <FavoriteStat
              label="Priced Assets"
              value={pricedCards.toString()}
              icon={<Sparkles size={14} />}
            />

            <FavoriteStat
              label="Gallery Status"
              value={cards.length > 0 ? "Curated" : "Empty"}
              icon={<ShieldCheck size={14} />}
            />
          </div>

          {cards.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-14 text-center backdrop-blur-2xl"
            >
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl" />
                <Heart className="relative z-10 text-purple-400" size={42} />
              </div>

              <h2 className="text-3xl font-black mb-3">No Favorites Yet</h2>

              <p className="text-zinc-500 mb-8">
                Pin cards you want to watch, compare, or revisit later.
              </p>

              <Link
                href="/cards"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
              >
                <Plus size={14} />
                Browse Cards
              </Link>
            </motion.div>
          )}

          {cards.length > 0 && visibleCards.length === 0 && (
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-12 text-center backdrop-blur-2xl">
              <Star
                className="mx-auto mb-4 text-purple-400"
                size={36}
                fill="currentColor"
              />

              <h2 className="text-2xl font-black mb-2">No favorites found</h2>

              <p className="text-zinc-500">
                Try searching another card, set, or rarity.
              </p>
            </div>
          )}

          {visibleCards.length > 0 && (
            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {visibleCards.map((card) => (
                  <motion.div
                    key={card.id}
                    variants={itemVariants}
                    layout="position"
                    whileHover={{
                      y: -6,
                      scale: 1.018,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 22,
                      mass: 0.7,
                    }}
                    className="group relative will-change-transform"
                  >
                    <Link href={`/cards/${card.id}`}>
                      <div className="rounded-3xl border border-white/[0.04] bg-white/[0.02] p-2 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/25 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_rgba(168,85,247,0.08)]">
                        <PremiumCard card={card} />
                      </div>
                    </Link>

                    <button
                      onClick={(e) => removeFavorite(card.id, e)}
                      className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 border border-white/10 p-2 rounded-full hover:bg-red-500/25 text-white backdrop-blur-xl"
                      aria-label={`Remove ${card.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function FavoriteStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.05] bg-white/[0.03] p-5 backdrop-blur-2xl hover:border-purple-500/20 transition-all">
      <div className="flex items-center gap-2 text-purple-400 mb-2">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.24em]">
          {label}
        </span>
      </div>

      <p className="text-2xl font-black tracking-tight truncate">{value}</p>
    </div>
  );
}