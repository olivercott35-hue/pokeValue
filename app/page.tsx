import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  Gem,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import {
  getAllPokemonCards,
  getAllPokemonSets,
  getPokemonCardPrice,
  type PokemonCard,
  type PokemonSet,
} from "@/lib/pokemon-data";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "PokeValue | Pokémon Card Prices, Sets & Collection Tools",
  description:
    "Track Pokémon card values, browse Pokémon TCG sets, research market prices and learn how to value your collection with PokeValue.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk",
  },
  openGraph: {
    title: "PokeValue | Pokémon Card Prices, Sets & Collection Tools",
    description:
      "Browse Pokémon card prices, explore sets, compare market values and build your Pokémon TCG collection with PokeValue.",
    url: "https://www.pokevalue.co.uk",
    siteName: "PokeValue",
    type: "website",
  },
};

function safeNumber(value: unknown, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function formatNumber(value: unknown) {
  return safeNumber(value).toLocaleString("en-GB");
}

function formatPrice(value: unknown) {
  const price = safeNumber(value);

  if (price <= 0) return "No market";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: price >= 100 ? 0 : 2,
    maximumFractionDigits: price >= 100 ? 0 : 2,
  }).format(price);
}

function getReleaseTime(set: PokemonSet) {
  const time = new Date(set.releaseDate || "1900-01-01").getTime();

  return Number.isNaN(time) ? 0 : time;
}

function getTopCard(cards: PokemonCard[]) {
  let topCard: PokemonCard | null = null;
  let topPrice = 0;
  let pricedCount = 0;
  let totalMarketValue = 0;

  for (const card of cards) {
    const price = getPokemonCardPrice(card);

    if (price > 0) {
      pricedCount += 1;
      totalMarketValue += price;
    }

    if (price > topPrice) {
      topPrice = price;
      topCard = card;
    }
  }

  return {
    topCard,
    topPrice,
    pricedCount,
    totalMarketValue,
  };
}

export default async function HomePage() {
  const [cards, sets] = await Promise.all([
    getAllPokemonCards(),
    getAllPokemonSets(),
  ]);

  const safeCards = Array.isArray(cards) ? cards : [];
  const safeSets = Array.isArray(sets) ? sets : [];

  const newestSet =
    safeSets
      .slice()
      .sort((a, b) => getReleaseTime(b) - getReleaseTime(a))[0] || null;

  const { topCard, topPrice, pricedCount, totalMarketValue } =
    getTopCard(safeCards);

  return (
    <AppLayout>
      <main className="relative min-h-full overflow-hidden bg-[#050506] px-4 py-5 text-white sm:px-6 lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-460px] h-[820px] w-[1180px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.1),rgba(76,29,149,0.035)_38%,transparent_72%)] blur-3xl" />
          <div className="absolute right-[-420px] top-[260px] h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.055),transparent_72%)] blur-3xl" />
          <div className="absolute bottom-[-460px] left-[-390px] h-[780px] w-[780px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.035),transparent_74%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_50%_12%,black,transparent_74%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(5,5,6,0.16)_42%,rgba(5,5,6,0.92)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-[1540px]">
          <section className="group/hero relative mb-7 overflow-hidden rounded-[2.15rem] border border-white/[0.07] bg-[linear-gradient(135deg,rgba(18,18,21,0.96),rgba(8,8,10,0.98))] shadow-[0_38px_140px_rgba(0,0,0,0.58)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.055),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(99,102,241,0.05),transparent_38%)]" />
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="pointer-events-none absolute inset-y-10 left-0 w-px bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />
            <div className="pointer-events-none absolute -left-[38%] top-[-85%] h-[280%] w-[26%] rotate-[20deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] opacity-0 blur-[2px] transition-[transform,opacity] duration-[1400ms] ease-out group-hover/hero:translate-x-[620%] group-hover/hero:opacity-100" />

            <div className="relative grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_400px] lg:items-center lg:p-8 xl:grid-cols-[1fr_450px]">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
                  <ShieldCheck className="h-3.5 w-3.5 text-violet-300/80" />
                  <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                    Pokémon TCG Market Tools
                  </span>
                </div>

                <h1 className="max-w-4xl text-3xl font-black leading-[0.96] tracking-[-0.05em] text-zinc-50 sm:text-4xl lg:text-5xl xl:text-6xl">
                  Value your Pokémon cards with a refined market archive.
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-500 sm:text-base">
                  Browse Pokémon card prices, research sets, compare market
                  values, build a collection and learn how to value cards
                  properly before buying, selling or grading.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/cards"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-sm font-black text-black shadow-[0_16px_52px_rgba(255,255,255,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_68px_rgba(255,255,255,0.12)]"
                  >
                    Explore Cards
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href="/sets"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-5 py-3 text-sm font-black text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.055]"
                  >
                    Browse Sets
                  </Link>

                  <Link
                    href="/guides"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.07] bg-black/20 px-5 py-3 text-sm font-black text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:text-zinc-100"
                  >
                    Valuation Guides
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <HomeStat
                  label="Cards Tracked"
                  value={formatNumber(safeCards.length)}
                  icon={<Layers className="h-4 w-4" />}
                />
                <HomeStat
                  label="Sets Indexed"
                  value={formatNumber(safeSets.length)}
                  icon={<Boxes className="h-4 w-4" />}
                />
                <HomeStat
                  label="Market Prices"
                  value={formatNumber(pricedCount)}
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <HomeStat
                  label="Indexed Value"
                  value={formatPrice(totalMarketValue)}
                  icon={<BarChart3 className="h-4 w-4" />}
                />
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.95),rgba(8,8,10,0.97))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-7">
              <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.035] blur-3xl" />

              <div className="relative mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-violet-300/75">
                    Market Snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-50 sm:text-3xl">
                    The essentials, in one place.
                  </h2>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:flex">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="relative grid gap-4 md:grid-cols-2">
                <MarketPanel
                  label="Newest Set"
                  title={newestSet?.name || "Unknown"}
                  description={
                    newestSet?.series
                      ? `${newestSet.series} • ${
                          newestSet.releaseDate || "No release date"
                        }`
                      : "Latest indexed Pokémon TCG expansion."
                  }
                  href={newestSet ? `/sets/${newestSet.id}` : "/sets"}
                  icon={<Boxes className="h-5 w-5" />}
                />

                <MarketPanel
                  label="Top Indexed Card"
                  title={topCard?.name || "No market card"}
                  description={
                    topCard
                      ? `${topCard.set?.name || "Unknown set"} • ${formatPrice(
                          topPrice
                        )}`
                      : "Cards with market pricing will appear here."
                  }
                  href={topCard ? `/cards/${topCard.id}` : "/cards"}
                  icon={<Gem className="h-5 w-5" />}
                />

                <MarketPanel
                  label="Card Explorer"
                  title="Search by name, set, rarity or type"
                  description="Find cards quickly using the local PokeValue archive."
                  href="/cards"
                  icon={<Search className="h-5 w-5" />}
                />

                <MarketPanel
                  label="Collection Tools"
                  title="Track favourites and portfolio value"
                  description="Use collection, favourites and portfolio pages to organise cards."
                  href="/collection"
                  icon={<WalletCards className="h-5 w-5" />}
                />
              </div>
            </section>

            <section className="group/featured relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.95),rgba(8,8,10,0.97))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-7">
              <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
              <div className="pointer-events-none absolute left-1/2 top-[40%] h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.12),rgba(79,70,229,0.055)_36%,transparent_72%)] opacity-70 blur-3xl transition duration-700 group-hover/featured:scale-110 group-hover/featured:opacity-100" />

              <p className="relative text-[10px] font-black uppercase tracking-[0.26em] text-violet-300/75">
                Featured Card
              </p>

              {topCard ? (
                <Link
                  href={`/cards/${topCard.id}`}
                  className="group relative mt-5 block"
                >
                  <div className="relative mx-auto aspect-[5/7] max-w-[220px] overflow-hidden rounded-[1.6rem] border border-white/[0.07] bg-[linear-gradient(180deg,#17171a,#0a0a0c)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_70px_rgba(0,0,0,0.52)] transition duration-500 group-hover:-translate-y-1 group-hover:border-white/[0.14] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_32px_90px_rgba(0,0,0,0.62)]">
                    <div className="pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />

                    {topCard.images?.large || topCard.images?.small ? (
                      <Image
                        src={topCard.images.large || topCard.images.small || ""}
                        alt={topCard.name}
                        fill
                        quality={70}
                        sizes="220px"
                        className="object-contain p-3 drop-shadow-[0_24px_28px_rgba(0,0,0,0.44)] transition-transform duration-500 group-hover:scale-[1.018]"
                      />
                    ) : null}
                  </div>

                  <h3 className="mt-5 text-xl font-black tracking-tight text-zinc-50">
                    {topCard.name}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-zinc-600">
                    {topCard.set?.name || "Unknown set"}
                  </p>

                  <p className="mt-3 text-2xl font-black text-emerald-400">
                    {formatPrice(topPrice)}
                  </p>
                </Link>
              ) : (
                <p className="relative mt-5 text-sm leading-7 text-zinc-600">
                  Once market prices are available, the top indexed card will
                  appear here.
                </p>
              )}
            </section>
          </section>

          <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              title="Card Explorer"
              description="Browse Pokémon cards with images, set data, rarity details and market values."
              href="/cards"
              icon={<Search className="h-5 w-5" />}
            />

            <FeatureCard
              title="Set Explorer"
              description="Explore Pokémon TCG sets by era, release date and card totals."
              href="/sets"
              icon={<Boxes className="h-5 w-5" />}
            />

            <FeatureCard
              title="Guides"
              description="Learn how card condition, rarity, demand and grading affect value."
              href="/guides"
              icon={<BookOpen className="h-5 w-5" />}
            />

            <FeatureCard
              title="Portfolio"
              description="Organise your collection and estimate the value of cards you track."
              href="/portfolio"
              icon={<WalletCards className="h-5 w-5" />}
            />
          </section>

          <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.94),rgba(8,8,10,0.97))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.46)] backdrop-blur-2xl sm:p-8">
            <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-violet-500/[0.03] blur-3xl" />

            <div className="relative max-w-5xl">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-violet-300/75">
                How PokeValue helps
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">
                Research Pokémon card values before you buy, sell or grade.
              </h2>

              <div className="mt-7 grid gap-6 text-sm leading-7 text-zinc-500 lg:grid-cols-3">
                <p>
                  Pokémon card prices can change depending on condition,
                  language, edition, popularity, grading potential and recent
                  market demand. PokeValue gives collectors a faster way to
                  research cards and compare sets in one place.
                </p>

                <p>
                  The card explorer is designed for quick discovery. You can
                  search by Pokémon name, set, rarity, type or collector number,
                  then open individual cards to review their details and market
                  information.
                </p>

                <p>
                  The guides section adds helpful context for newer collectors,
                  including how to inspect condition, understand grading, spot
                  fake cards and value Pokémon cards in the UK market.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <FaqItem
              question="Does PokeValue replace professional appraisal?"
              answer="No. PokeValue is a research tool. Final value depends on condition, edition, buyer demand, authenticity and the exact sale venue."
            />

            <FaqItem
              question="Why can two copies of the same card be worth different amounts?"
              answer="Condition, centering, surface quality, print version, grading result and market demand can all change the price of the same Pokémon card."
            />

            <FaqItem
              question="Is this useful for UK collectors?"
              answer="Yes. PokeValue is built with UK collectors in mind, including GBP display and guides focused on valuing Pokémon cards from a UK perspective."
            />

            <FaqItem
              question="What should I do before selling a valuable card?"
              answer="Check the exact set and number, inspect condition carefully, compare recent market prices and consider whether grading could increase buyer confidence."
            />
          </section>
        </div>
      </main>
    </AppLayout>
  );
}

function HomeStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.065] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.012))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl transition duration-300 hover:border-white/[0.11] hover:bg-white/[0.045]">
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent transition-all duration-300 group-hover:inset-x-3 group-hover:via-white/35" />

      <div className="relative mb-3 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
          {label}
        </span>

        <span className="text-zinc-500 transition-colors duration-300 group-hover:text-violet-300/80">
          {icon}
        </span>
      </div>

      <p className="relative text-xl font-black tracking-tight text-zinc-50 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function MarketPanel({
  label,
  title,
  description,
  href,
  icon,
}: {
  label: string;
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[1.45rem] border border-white/[0.06] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.045]"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent transition-all duration-300 group-hover:inset-x-3 group-hover:via-white/32" />
      <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-violet-500/[0.035] opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

      <div className="relative mb-4 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
          {label}
        </span>

        <span className="text-zinc-500 transition-colors duration-300 group-hover:text-violet-300/75">
          {icon}
        </span>
      </div>

      <h3 className="relative line-clamp-2 text-lg font-black tracking-tight text-zinc-100">
        {title}
      </h3>

      <p className="relative mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
        {description}
      </p>
    </Link>
  );
}

function FeatureCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[1.7rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(15,15,18,0.95),rgba(8,8,10,0.97))] p-5 shadow-[0_24px_76px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-white/[0.13] hover:shadow-[0_32px_96px_rgba(0,0,0,0.56),0_0_42px_rgba(124,58,237,0.07)]"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent transition-all duration-500 group-hover:inset-x-4 group-hover:via-white/36" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/[0.05] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -left-[70%] top-[-35%] h-[180%] w-[44%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)] opacity-0 blur-[2px] transition-[transform,opacity] duration-[1100ms] ease-out group-hover:translate-x-[430%] group-hover:opacity-100" />

      <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition duration-300 group-hover:border-white/[0.12] group-hover:text-violet-300/80">
        {icon}
      </div>

      <h3 className="relative text-xl font-black tracking-tight text-zinc-50">
        {title}
      </h3>

      <p className="relative mt-3 text-sm leading-7 text-zinc-600">
        {description}
      </p>

      <div className="relative mt-5 flex items-center gap-2 text-sm font-black text-zinc-400 transition-colors duration-300 group-hover:text-zinc-100">
        Open
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="relative overflow-hidden rounded-[1.7rem] border border-white/[0.065] bg-[linear-gradient(145deg,rgba(15,15,18,0.94),rgba(8,8,10,0.97))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />

      <h3 className="relative text-lg font-black tracking-tight text-zinc-100">
        {question}
      </h3>

      <p className="relative mt-3 text-sm leading-7 text-zinc-600">{answer}</p>
    </div>
  );
}
