"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import {
  Info,
  ShieldCheck,
  Zap,
  BarChart3,
  Sparkles,
  Database,
  TrendingUp,
  LockKeyhole,
  Search,
  BookOpen,
  WalletCards,
} from "lucide-react";

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
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

export default function AboutPage() {
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
            className="mb-10 border-b border-white/[0.05] pb-8"
          >
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                About PokeValue
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
              Pokémon Card Values Made Clearer
            </h1>

            <p className="text-zinc-500 mt-4 max-w-3xl leading-7">
              PokeValue is a Pokémon TCG price tracking and collection platform
              built to help collectors research cards, understand market values,
              explore sets, and manage their collection with a cleaner, more
              focused dashboard.
            </p>
          </motion.header>

          <div className="grid xl:grid-cols-12 gap-8">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 24,
              }}
              className="xl:col-span-8 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

              <div className="relative">
                <div className="flex items-center gap-2 text-purple-400 mb-4">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                    Collector Intelligence
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
                  Built for collectors who want better information.
                </h2>

                <div className="space-y-5 text-zinc-400 text-base leading-8">
                  <p>
                    Pokémon card collecting has grown into a large and
                    fast-moving market. Prices can change because of rarity,
                    condition, grading demand, nostalgia, set popularity,
                    artwork, reprints, and recent sales activity. PokeValue
                    exists to make that information easier to browse and
                    understand.
                  </p>

                  <p>
                    The platform helps collectors search Pokémon cards, browse
                    sets, view rarity and release information, save favourite
                    cards, build a local collection, and monitor estimated
                    portfolio value. Instead of jumping between multiple tools,
                    PokeValue brings core collecting features into one clean
                    interface.
                  </p>

                  <p>
                    PokeValue is designed especially with UK collectors in mind,
                    but the tools can be useful for anyone researching Pokémon
                    TCG cards. Prices shown on the site should be treated as
                    estimates rather than guaranteed sale values, because real
                    selling prices can vary depending on card condition,
                    grading, buyer demand, location, platform fees, and timing.
                  </p>

                  <p>
                    The long-term goal is to build one of the most useful
                    Pokémon card value platforms available: a place where
                    collectors can research prices, learn how the market works,
                    manage their collection, compare cards, and make more
                    informed buying, selling, and grading decisions.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 24,
                delay: 0.08,
              }}
              className="xl:col-span-4 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-2 text-purple-400 mb-6">
                <Database size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                  Platform Modules
                </span>
              </div>

              <div className="space-y-4">
                <SystemItem
                  label="Card Explorer"
                  value="Search Pokémon cards"
                />
                <SystemItem label="Set Explorer" value="Browse expansions" />
                <SystemItem label="Guides" value="Learn card values" />
                <SystemItem label="Collection" value="Save owned cards" />
                <SystemItem label="Portfolio" value="Track estimated value" />
                <SystemItem
                  label="Analytics"
                  value="Understand your collection"
                />
              </div>
            </motion.section>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.12,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            className="mt-8 grid md:grid-cols-3 gap-6"
          >
            <FeatureCard
              icon={<Search size={20} />}
              title="Research Cards"
              desc="Search Pokémon cards, compare rarities, check set information, and review available market price data."
            />

            <FeatureCard
              icon={<BookOpen size={20} />}
              title="Learn The Market"
              desc="Read collecting guides about rarity, condition, grading, fake cards, sealed products, and price movement."
            />

            <FeatureCard
              icon={<WalletCards size={20} />}
              title="Track Collection Value"
              desc="Save cards to your collection and monitor an estimated portfolio value as your collection grows."
            />
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 130,
              damping: 24,
              delay: 0.16,
            }}
            className="mt-8 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-2 text-purple-400 mb-4">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                Price Disclaimer
              </span>
            </div>

            <h2 className="text-3xl font-black mb-5">
              How PokeValue should be used
            </h2>

            <div className="space-y-5 text-zinc-400 leading-8">
              <p>
                PokeValue is a research tool. The estimated prices shown on the
                platform are intended to help collectors understand possible
                market value, but they should not be treated as guaranteed sale
                prices or financial advice.
              </p>

              <p>
                Pokémon card values can vary significantly based on condition. A
                Near Mint card may sell for much more than a card with
                scratches, whitening, dents, creases, or surface damage. Graded
                cards can also sell differently depending on the grading
                company, final grade, population, and collector demand.
              </p>

              <p>
                Before buying, selling, or grading a valuable card, collectors
                should compare multiple sources, check recent sold listings,
                inspect condition carefully, and consider all fees and risks.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 130,
              damping: 24,
              delay: 0.2,
            }}
            className="mt-8 rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-2xl"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <MiniPanel
                icon={<Zap size={16} />}
                label="Fast Interface"
                value="Designed for quick browsing, responsive pages, and smooth collecting workflows."
              />

              <MiniPanel
                icon={<LockKeyhole size={16} />}
                label="Local Vault"
                value="Collection and favourite data is currently stored locally in your browser."
              />

              <MiniPanel
                icon={<BarChart3 size={16} />}
                label="Market Tools"
                value="Built to help collectors understand cards, sets, rarity, prices, and collection value."
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 130,
              damping: 24,
              delay: 0.24,
            }}
            className="mt-8 rounded-[2rem] border border-purple-500/20 bg-purple-500/5 p-8 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-2 text-purple-400 mb-4">
              <TrendingUp size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.28em]">
                Future Vision
              </span>
            </div>

            <h2 className="text-3xl font-black mb-4">The goal for PokeValue</h2>

            <p className="text-zinc-400 leading-8 max-w-4xl">
              PokeValue is being developed as a long-term Pokémon collecting
              platform. Future improvements may include richer price history,
              stronger collection analytics, better market movers, price alerts,
              account-based collections, sealed product tracking, and improved
              card identification tools. The aim is simple: make Pokémon card
              research easier, clearer, and more useful for collectors.
            </p>
          </motion.section>
        </div>
      </div>
    </AppLayout>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      className="group rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl hover:border-purple-500/25 hover:bg-white/[0.045] transition-all"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
        {icon}
      </div>

      <h3 className="text-lg font-black text-white mb-2">{title}</h3>

      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function SystemItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.025] p-4">
      <span className="text-sm font-black text-white">{label}</span>
      <span className="text-xs text-zinc-500">{value}</span>
    </div>
  );
}

function MiniPanel({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-5">
      <div className="flex items-center gap-2 text-purple-400 mb-2">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed">{value}</p>
    </div>
  );
}