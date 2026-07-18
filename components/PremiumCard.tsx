"use client";

import { motion } from "framer-motion";
import { BadgeDollarSign, TrendingUp } from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";
import { getResolvedCardPrice } from "@/lib/card-pricing";

export default function PremiumCard({ card }: { card: any }) {
  const { formatPrice } = useCurrency();
  const price = getResolvedCardPrice(card);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.035] p-3 backdrop-blur-2xl transition-all hover:border-purple-500/30 hover:bg-white/[0.055] hover:shadow-[0_24px_80px_rgba(168,85,247,0.16)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-2xl bg-black/30">
        {card?.images?.small ? (
          <img
            src={card.images.small}
            alt={card.name}
            className="w-full rounded-2xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[0.72] flex items-center justify-center rounded-2xl bg-zinc-900 text-xs text-zinc-600">
            No image
          </div>
        )}
      </div>

      <div className="relative mt-4 space-y-3">
        <div>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-black tracking-tight text-white">
            {card?.name || "Unknown Card"}
          </h3>

          <p className="mt-1 truncate text-[11px] font-medium text-zinc-500">
            {card?.set?.name || "Unknown Set"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
              {card?.rarity || "Unknown"}
            </p>

            <p className="mt-1 truncate text-[10px] text-zinc-600">
              Market estimate
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-purple-500/20 bg-purple-500/10 px-2.5 py-1.5 text-purple-300">
            {price.market > 0 ? (
              <BadgeDollarSign size={13} />
            ) : (
              <TrendingUp size={13} />
            )}

            <span className="text-xs font-black">
              {price.market > 0
                ? formatPrice(price.market, price.sourceCurrency)
                : "No data"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}