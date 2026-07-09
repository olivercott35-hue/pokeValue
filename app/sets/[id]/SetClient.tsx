"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PremiumCard from "@/components/PremiumCard";
import {
  ArrowDownUp,
  CalendarDays,
  Database,
  PackageOpen,
  Search,
  ShieldCheck,
  TrendingUp,
  WalletCards,
  BookOpen,
  Star,
  Gem,
  BadgeDollarSign,
  SearchCheck,
  ExternalLink,
} from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";

type SortOption = "number" | "value-desc" | "value-asc" | "name";

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
      staggerChildren: 0.018,
      delayChildren: 0.04,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 170,
      damping: 26,
      mass: 0.7,
    },
  },
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

  if (cardmarketValue > 0) {
    return cardmarketValue * 0.86;
  }

  const tcgValue =
    Number(firstTcg?.market || 0) ||
    Number(firstTcg?.mid || 0) ||
    Number(firstTcg?.low || 0) ||
    Number(firstTcg?.high || 0);

  if (tcgValue > 0) {
    return tcgValue * 0.79;
  }

  return 0;
}

function parseCardNumber(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const number = Number(value.replace(/[^0-9]/g, ""));

  return Number.isNaN(number) ? 0 : number;
}

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

function compareNames(a: any, b: any) {
  return String(a?.name || "").localeCompare(String(b?.name || ""));
}

function sortCards(cards: any[], sortBy: SortOption) {
  const sorted = [...cards];

  sorted.sort((a, b) => {
    if (sortBy === "number") {
      const diff = parseCardNumber(a?.number) - parseCardNumber(b?.number);

      if (diff !== 0) {
        return diff;
      }

      return compareNames(a, b);
    }

    if (sortBy === "value-desc") {
      const diff = getCardValueGBP(b) - getCardValueGBP(a);

      if (diff !== 0) {
        return diff;
      }

      return compareNames(a, b);
    }

    if (sortBy === "value-asc") {
      const valueA = getCardValueGBP(a);
      const valueB = getCardValueGBP(b);

      if (valueA === 0 && valueB > 0) {
        return 1;
      }

      if (valueB === 0 && valueA > 0) {
        return -1;
      }

      const diff = valueA - valueB;

      if (diff !== 0) {
        return diff;
      }

      return compareNames(a, b);
    }

    return compareNames(a, b);
  });

  return sorted;
}

export default function SetClient({
  setData,
  initialCards,
}: {
  setData: TcgSet;
  initialCards: any[];
}) {
  const { formatPrice } = useCurrency();

  const [cards] = useState<any[]>(initialCards || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("number");

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = query
      ? cards.filter((card) => {
          return (
            String(card?.name || "")
              .toLowerCase()
              .includes(query) ||
            String(card?.number || "")
              .toLowerCase()
              .includes(query) ||
            String(card?.rarity || "")
              .toLowerCase()
              .includes(query)
          );
        })
      : cards;

    return sortCards(filtered, sortBy);
  }, [cards, searchQuery, sortBy]);

  const totalValueGBP = useMemo(() => {
    return filteredCards.reduce((sum, card) => sum + getCardValueGBP(card), 0);
  }, [filteredCards]);

  const rareCount = useMemo(() => {
    return filteredCards.filter((card) =>
      String(card?.rarity || "")
        .toLowerCase()
        .includes("rare")
    ).length;
  }, [filteredCards]);

  return (
    <AppLayout>
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-center xl:gap-8">
              <div className="min-w-0 xl:col-span-8">
                <div className="mb-3 flex items-center gap-2 text-purple-400">
                  <Database size={14} />

                  <span className="text-[9px] font-black uppercase tracking-[0.24em] sm:text-[10px] sm:tracking-[0.3em]">
                    Live Expansion Archive
                  </span>
                </div>

                <h1 className="bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl md:text-7xl">
                  {setData.name}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                  {setData.series || "Unknown Series"} •{" "}
                  {formatReleaseDate(setData.releaseDate)} • {cards.length}{" "}
                  total assets
                </p>
              </div>

              <div className="xl:col-span-4 xl:flex xl:justify-end">
                <div className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-2xl sm:rounded-[2rem] sm:p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-fuchsia-500/10" />
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-purple-500/20 blur-[80px]" />

                  <div className="relative flex h-24 items-center justify-center sm:h-28">
                    {setData.images?.logo ? (
                      <img
                        src={setData.images.logo}
                        alt={setData.name}
                        className="max-h-full max-w-[90%] object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                      />
                    ) : setData.images?.symbol ? (
                      <img
                        src={setData.images.symbol}
                        alt={setData.name}
                        className="max-h-20 object-contain opacity-90"
                      />
                    ) : (
                      <PackageOpen className="h-12 w-12 text-zinc-700" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.header>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:mb-8">
            <SetStat
              label="Loaded Cards"
              value={filteredCards.length.toString()}
              icon={<WalletCards size={14} />}
            />

            <SetStat
              label="Set Total"
              value={`${setData.printedTotal || 0}/${setData.total || 0}`}
              icon={<PackageOpen size={14} />}
            />

            <SetStat
              label="Released"
              value={formatReleaseDate(setData.releaseDate)}
              icon={<CalendarDays size={14} />}
            />

            <SetStat
              label="Visible Value"
              value={
                totalValueGBP > 0
                  ? formatPrice(totalValueGBP, "GBP")
                  : "No data"
              }
              icon={<TrendingUp size={14} />}
            />
          </div>

          <div className="mb-3 flex items-center gap-2 text-purple-400 sm:hidden">
            <ShieldCheck size={14} />

            <span className="text-[9px] font-black uppercase tracking-[0.22em]">
              Rare Assets: {rareCount}
            </span>
          </div>

          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-xl transition-all hover:border-purple-500/20 lg:max-w-sm">
              <Search className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-focus-within:text-purple-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search this set..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder-zinc-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
              {[
                { id: "number", label: "Card Number" },
                { id: "value-desc", label: "High Value" },
                { id: "value-asc", label: "Low Value" },
                { id: "name", label: "Name" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSortBy(option.id as SortOption)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-[9px] font-black uppercase tracking-widest transition-all sm:px-4 sm:text-[10px] ${
                    sortBy === option.id
                      ? "border-purple-500/40 bg-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.22)]"
                      : "border-white/[0.06] bg-white/[0.03] text-zinc-500 hover:border-purple-500/25 hover:text-white"
                  }`}
                >
                  <ArrowDownUp size={12} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={`${sortBy}-${searchQuery}`}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card) => (
                <motion.div
                  key={card.id}
                  variants={cardVariants}
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
                  className="group will-change-transform"
                >
                  <Link href={`/cards/${card.id}`}>
                    <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-1.5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/20 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_rgba(168,85,247,0.08)] sm:rounded-3xl sm:p-2">
                      <PremiumCard card={card} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredCards.length === 0 && (
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-10 text-center backdrop-blur-2xl sm:p-12">
              <PackageOpen className="mx-auto mb-4 text-purple-400" size={36} />

              <h2 className="mb-2 text-2xl font-black">No cards found</h2>

              <p className="text-zinc-500">
                Try another card name, number, or rarity.
              </p>
            </div>
          )}

          <section className="mt-10 space-y-6">
            <div className="grid gap-6 xl:grid-cols-12">
              <ContentPanel
                className="xl:col-span-7"
                icon={<BookOpen size={16} />}
                eyebrow="Set Overview"
                title={`About ${setData.name}`}
              >
                <p>
                  <strong>{setData.name}</strong> is a Pokémon Trading Card Game
                  expansion from the{" "}
                  <strong>{setData.series || "Pokémon TCG"}</strong> series.
                  PokeValue tracks this set so collectors can browse its card
                  list, compare rarities, check available market estimates and
                  decide which cards are worth adding to a collection.
                </p>

                <p>
                  This set contains{" "}
                  <strong>{setData.printedTotal || cards.length}</strong> printed
                  cards and <strong>{setData.total || cards.length}</strong>{" "}
                  total listed cards in the Pokémon TCG database. It was released
                  on <strong>{formatReleaseDate(setData.releaseDate)}</strong>.
                  The full card grid above lets you search by name, card number
                  or rarity, then sort by card number, value or name.
                </p>

                <p>
                  Set pages are useful for collectors because individual card
                  values only tell part of the story. A card may become more
                  desirable when it belongs to a popular expansion, features a
                  fan-favourite Pokémon, has standout artwork, completes a master
                  set, or becomes difficult to find in clean condition.
                </p>
              </ContentPanel>

              <ContentPanel
                className="xl:col-span-5"
                icon={<SearchCheck size={16} />}
                eyebrow="Set Facts"
                title="Expansion details"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Fact label="Set Name" value={setData.name} />
                  <Fact label="Series" value={setData.series || "Unknown"} />
                  <Fact
                    label="Released"
                    value={formatReleaseDate(setData.releaseDate)}
                  />
                  <Fact label="Loaded Cards" value={cards.length.toString()} />
                  <Fact
                    label="Printed Total"
                    value={(setData.printedTotal || 0).toString()}
                  />
                  <Fact
                    label="Database Total"
                    value={(setData.total || 0).toString()}
                  />
                  <Fact label="Rare Cards" value={rareCount.toString()} />
                  <Fact
                    label="Visible Value"
                    value={
                      totalValueGBP > 0
                        ? formatPrice(totalValueGBP, "GBP")
                        : "No data"
                    }
                  />
                </div>
              </ContentPanel>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <ContentPanel
                icon={<Gem size={16} />}
                eyebrow="Collectability"
                title="Why collectors track this set"
              >
                <p>
                  Collectors often evaluate a Pokémon set by more than just the
                  most expensive card. Artwork quality, chase cards, pull rates,
                  nostalgic value, rarity distribution, sealed product
                  availability and Pokémon popularity can all influence demand.
                </p>

                <p>
                  For many collectors, completing a set can be more satisfying
                  than buying only the highest-value singles. Building a complete
                  binder gives a clear goal and makes it easier to see which
                  cards are still missing.
                </p>
              </ContentPanel>

              <ContentPanel
                icon={<BadgeDollarSign size={16} />}
                eyebrow="Market Notes"
                title="Understanding set value"
              >
                <p>
                  The visible value shown on this page is an estimate based on
                  available card data. It should be treated as a guide, not a
                  guaranteed resale value. Real sale prices can vary depending on
                  condition, language, grading, seller location and demand.
                </p>

                <p>
                  Some cards may display no market data yet. This is normal for
                  newer releases, low-volume cards, promos, unusual variants or
                  cards that have not appeared often enough on major
                  marketplaces.
                </p>
              </ContentPanel>

              <ContentPanel
                icon={<Star size={16} />}
                eyebrow="Set Building"
                title="Tips for completing the set"
              >
                <p>
                  Start by deciding whether you want a standard set, reverse holo
                  set, master set or only the main chase cards. A master set can
                  include reverse holos, secret rares, promos and other variants,
                  so it is usually more expensive and time-consuming.
                </p>

                <p>
                  Track your missing cards carefully, compare raw prices with
                  recent sold listings and avoid overpaying during early release
                  hype. Prices often move quickly when a new expansion launches.
                </p>
              </ContentPanel>
            </div>

            <ContentPanel
              icon={<ShieldCheck size={16} />}
              eyebrow="Collector Guide"
              title={`How to evaluate cards from ${setData.name}`}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-white">
                    Look at condition first
                  </h3>

                  <p>
                    Condition is one of the biggest factors in Pokémon card
                    value. Check corners, edges, centering, print lines,
                    whitening, holo scratching and surface dents before deciding
                    whether a card is worth grading or buying at a premium.
                  </p>

                  <p>
                    Cards from the same set can vary massively in value based on
                    tiny condition differences, especially for collectors chasing
                    high graded copies.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-black text-white">
                    Compare singles and sealed product
                  </h3>

                  <p>
                    Some collectors prefer opening sealed packs, while others buy
                    singles to complete a binder more efficiently. Opening packs
                    is fun but unpredictable; buying singles is usually the more
                    controlled way to finish a set.
                  </p>

                  <p>
                    If sealed product becomes harder to find, demand for clean
                    singles can increase over time, especially for popular
                    Pokémon and rare artwork cards.
                  </p>
                </div>
              </div>
            </ContentPanel>

            <ContentPanel
              icon={<BookOpen size={16} />}
              eyebrow="FAQ"
              title={`Frequently asked questions about ${setData.name}`}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FAQ
                  question={`How many cards are in ${setData.name}?`}
                  answer={`${setData.name} has ${
                    setData.printedTotal || cards.length
                  } printed cards and ${
                    setData.total || cards.length
                  } total listed cards in the Pokémon TCG database.`}
                />

                <FAQ
                  question={`When was ${setData.name} released?`}
                  answer={`${setData.name} was released on ${formatReleaseDate(
                    setData.releaseDate
                  )}. Release timing can affect early market prices, especially during the first weeks of a new expansion.`}
                />

                <FAQ
                  question={`Is ${setData.name} worth collecting?`}
                  answer="That depends on your goals. It can be worth collecting if you like the Pokémon, artwork, chase cards or want to complete the full expansion. Value-focused collectors should compare individual card prices and sealed product costs."
                />

                <FAQ
                  question="Why do some cards have no price data?"
                  answer="Some cards do not have enough reliable marketplace data yet. This can happen with newer cards, promos, low-volume cards or variants that are not traded often."
                />

                <FAQ
                  question="Should I buy packs or singles?"
                  answer="Packs are fun but unpredictable. Singles are usually better if you want specific cards or want to complete a set without relying on luck."
                />

                <FAQ
                  question="Can set values change over time?"
                  answer="Yes. Set demand can change based on reprints, sealed product availability, nostalgia, grading trends, competitive interest and collector demand for specific Pokémon."
                />
              </div>
            </ContentPanel>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResourceLink
                href="/cards"
                icon={<SearchCheck size={16} />}
                title="Browse cards"
                desc="Search the full Pokémon card archive."
              />

              <ResourceLink
                href="/sets"
                icon={<PackageOpen size={16} />}
                title="All sets"
                desc="Explore every Pokémon TCG expansion."
              />

              <ResourceLink
                href="/collection"
                icon={<WalletCards size={16} />}
                title="Collection tracker"
                desc="Save cards and track your personal vault."
              />

              <ResourceLink
                href="/guides"
                icon={<BookOpen size={16} />}
                title="Collector guides"
                desc="Learn about values, grading and collecting."
              />
            </div>
          </section>

        </div>
      </div>
    </AppLayout>
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
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-5 backdrop-blur-2xl transition-all hover:border-purple-500/20 sm:rounded-3xl">
      <div className="mb-2 flex items-center gap-2 text-purple-400">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.24em]">
          {label}
        </span>
      </div>

      <p className="truncate text-xl font-black tracking-tight sm:text-2xl">
        {value}
      </p>
    </div>
  );
}


function ContentPanel({
  icon,
  eyebrow,
  title,
  children,
  className = "",
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl ${className}`}
    >
      <div className="mb-4 flex items-center gap-2 text-purple-400">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.24em]">
          {eyebrow}
        </span>
      </div>

      <h2 className="mb-4 text-2xl font-black text-white">{title}</h2>

      <div className="space-y-4 text-sm leading-7 text-zinc-400">
        {children}
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-4">
      <p className="mb-1 text-[9px] font-black uppercase tracking-[0.22em] text-purple-400">
        {label}
      </p>

      <p className="truncate text-sm font-bold text-zinc-300">{value}</p>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-5">
      <h3 className="mb-2 text-sm font-black text-white">{question}</h3>

      <p className="text-sm leading-7 text-zinc-500">{answer}</p>
    </div>
  );
}

function ResourceLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-2xl transition hover:border-purple-500/30 hover:bg-white/[0.045]"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400 transition group-hover:bg-purple-600 group-hover:text-white">
        {icon}
      </div>

      <div className="flex items-center gap-2">
        <h3 className="font-black text-white">{title}</h3>
        <ExternalLink size={13} className="text-zinc-600" />
      </div>

      <p className="mt-2 text-sm leading-6 text-zinc-500">{desc}</p>
    </Link>
  );
}