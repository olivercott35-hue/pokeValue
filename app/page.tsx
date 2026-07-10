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
    canonical: "https://pokevalue.co.uk",
  },
  openGraph: {
    title: "PokeValue | Pokémon Card Prices, Sets & Collection Tools",
    description:
      "Browse Pokémon card prices, explore sets, compare market values and build your Pokémon TCG collection with PokeValue.",
    url: "https://pokevalue.co.uk",
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
      <main className="relative min-h-full overflow-hidden px-4 py-5 text-white sm:px-6 lg:px-8 xl:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-360px] h-[720px] w-[1040px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.26),transparent_68%)] blur-3xl" />
          <div className="absolute right-[-340px] top-[340px] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.15),transparent_70%)] blur-3xl" />
          <div className="absolute bottom-[-360px] left-[-320px] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_72%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_50%_18%,black,transparent_72%)]" />
        </div>

        <div className="relative mx-auto max-w-[1540px]">
          <section className="mb-6 overflow-hidden rounded-[2.1rem] border border-white/[0.1] bg-[linear-gradient(135deg,rgba(255,255,255,0.105),rgba(255,255,255,0.025))] shadow-[0_34px_130px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,180,254,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.1),transparent_36%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-100/90 to-transparent" />
              <div className="absolute top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

              <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_390px] lg:items-center lg:p-7 xl:grid-cols-[1fr_430px]">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/20 bg-purple-300/[0.09] px-3 py-2 text-purple-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                      Pokémon TCG Market Tools
                    </span>
                  </div>

                  <h1 className="max-w-4xl text-3xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                    Value your Pokémon cards with a premium market archive.
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
                    Browse Pokémon card prices, research sets, compare market
                    values, build a collection and learn how to value cards
                    properly before buying, selling or grading.
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/cards"
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black shadow-[0_18px_60px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-purple-100"
                    >
                      Explore Cards
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    <Link
                      href="/sets"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-purple-200/35 hover:bg-white/[0.08]"
                    >
                      Browse Sets
                    </Link>

                    <Link
                      href="/guides"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-sm font-black text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-white"
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
            </div>
          </section>

          <section className="mb-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden rounded-[2.25rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.024))] p-5 shadow-[0_30px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-purple-100">
                    Market Snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Dashboard stats, now on Home.
                  </h2>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-purple-200/15 bg-purple-300/[0.09] text-purple-100 sm:flex">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
            </div>

            <div className="overflow-hidden rounded-[2.25rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.024))] p-5 shadow-[0_30px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-purple-100">
                Featured Card
              </p>

              {topCard ? (
                <Link href={`/cards/${topCard.id}`} className="group mt-5 block">
                  <div className="relative mx-auto aspect-[5/7] max-w-[220px] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),rgba(20,20,28,0.98)_45%,rgba(7,7,10,1))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    {topCard.images?.large || topCard.images?.small ? (
                      <Image
                        src={topCard.images.large || topCard.images.small || ""}
                        alt={topCard.name}
                        fill
                        sizes="220px"
                        className="object-contain p-3 drop-shadow-[0_24px_28px_rgba(0,0,0,0.38)] transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>

                  <h3 className="mt-5 text-xl font-black tracking-tight text-white">
                    {topCard.name}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-zinc-500">
                    {topCard.set?.name || "Unknown set"}
                  </p>

                  <p className="mt-3 text-2xl font-black text-emerald-300">
                    {formatPrice(topPrice)}
                  </p>
                </Link>
              ) : (
                <p className="mt-5 text-sm leading-7 text-zinc-500">
                  Once market prices are available, the top indexed card will
                  appear here.
                </p>
              )}
            </div>
          </section>

          <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

          <section className="mb-8 overflow-hidden rounded-[2.25rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.024))] p-5 shadow-[0_30px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-8">
            <div className="max-w-4xl">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-purple-100">
                How PokeValue helps
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Research Pokémon card values before you buy, sell or grade.
              </h2>

              <div className="mt-6 grid gap-6 text-sm leading-7 text-zinc-400 lg:grid-cols-3">
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

          <section className="grid gap-6 lg:grid-cols-2">
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
      className="group rounded-[1.5rem] border border-white/[0.08] bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] transition hover:-translate-y-0.5 hover:border-purple-200/30 hover:bg-white/[0.065]"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
          {label}
        </span>

        <span className="text-purple-100">{icon}</span>
      </div>

      <h3 className="line-clamp-2 text-lg font-black tracking-tight text-white">
        {title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
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
      className="group rounded-[1.75rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.022))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-purple-200/30 hover:shadow-[0_30px_96px_rgba(139,92,246,0.18)]"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-200/15 bg-purple-300/[0.09] text-purple-100">
        {icon}
      </div>

      <h3 className="text-xl font-black tracking-tight text-white">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-zinc-500">{description}</p>

      <div className="mt-5 flex items-center gap-2 text-sm font-black text-purple-100">
        Open
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/[0.09] bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl">
      <h3 className="text-lg font-black tracking-tight text-white">
        {question}
      </h3>

      <p className="mt-3 text-sm leading-7 text-zinc-500">{answer}</p>
    </div>
  );
}