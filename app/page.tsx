import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  Database,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import {
  FeatureCard,
  GlassPanel,
  MetricCard,
  PageHero,
  PageShell,
  PrimaryLink,
  SectionHeading,
  SecondaryLink,
} from "@/components/ui/SitePage";
import {
  getAllPokemonCards,
  getAllPokemonSets,
  getPokemonCardPrice,
  type PokemonSet,
} from "@/lib/pokemon-data";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "PokeValue | UK Pokémon Card Prices, Sets & Collector Guides",
  description:
    "Research Pokémon card prices, browse complete set checklists and learn how condition, variants and marketplace evidence affect value.",
  alternates: { canonical: "https://www.pokevalue.co.uk" },
  openGraph: {
    title: "PokeValue | UK Pokémon Card Research",
    description:
      "A collector-first Pokémon TCG archive with clearly labelled marketplace estimates, set data and practical UK guides.",
    url: "https://www.pokevalue.co.uk",
    siteName: "PokeValue",
    type: "website",
  },
};

function releaseTime(set: PokemonSet) {
  const time = new Date(set.releaseDate || "1900-01-01").getTime();
  return Number.isFinite(time) ? time : 0;
}

function formatDate(value?: string) {
  if (!value) return "Release date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function HomePage() {
  const [cards, sets] = await Promise.all([
    getAllPokemonCards(),
    getAllPokemonSets(),
  ]);

  const safeCards = Array.isArray(cards) ? cards : [];
  const safeSets = Array.isArray(sets) ? sets : [];
  const pricedCards = safeCards.reduce(
    (count, card) => count + (getPokemonCardPrice(card) > 0 ? 1 : 0),
    0
  );
  const recentSets = safeSets
    .slice()
    .sort((a, b) => releaseTime(b) - releaseTime(a))
    .slice(0, 6);
  const coverage = safeCards.length
    ? Math.round((pricedCards / safeCards.length) * 100)
    : 0;

  return (
    <AppLayout>
      <PageShell>
        <PageHero
          eyebrow="Independent UK Pokémon TCG archive"
          icon={<Sparkles className="h-4 w-4" />}
          title={
            <>
              Research the card in front of you—not the hype around it.
            </>
          }
          description={
            <p>
              PokeValue brings card records, set checklists, clearly labelled
              marketplace estimates and practical collector education into one
              premium research workspace. Values are starting points, never
              guaranteed sale prices.
            </p>
          }
          actions={
            <>
              <PrimaryLink href="/cards" arrow>
                Explore cards
              </PrimaryLink>
              <SecondaryLink href="/sets">Browse sets</SecondaryLink>
              <SecondaryLink href="/guides">Read collector guides</SecondaryLink>
            </>
          }
          aside={
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Cards indexed"
                value={safeCards.length.toLocaleString("en-GB")}
                detail="Local searchable archive"
                icon={<Layers3 className="h-4 w-4" />}
              />
              <MetricCard
                label="Sets indexed"
                value={safeSets.length.toLocaleString("en-GB")}
                detail="Across multiple eras"
                icon={<Boxes className="h-4 w-4" />}
              />
              <MetricCard
                label="Price coverage"
                value={`${coverage}%`}
                detail={`${pricedCards.toLocaleString("en-GB")} records with a source`}
                icon={<Database className="h-4 w-4" />}
              />
              <MetricCard
                label="Market rule"
                value="Source-first"
                detail="Variant shown beside every estimate"
                icon={<ShieldCheck className="h-4 w-4" />}
              />
            </div>
          }
        />

        <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            href="/cards"
            icon={<Search className="h-5 w-5" />}
            title="Card archive"
            description="Search by Pokémon, set, rarity, collector number or type, then inspect the exact record before comparing values."
            linkLabel="Search the archive"
          />
          <FeatureCard
            href="/sets"
            icon={<Boxes className="h-5 w-5" />}
            title="Set explorer"
            description="Move through Pokémon TCG eras with release dates, set totals, symbols, logos and complete card checklists."
            linkLabel="Explore sets"
          />
          <FeatureCard
            href="/guides"
            icon={<BookOpen className="h-5 w-5" />}
            title="Collector education"
            description="Learn how condition, finish, edition, grading and recent evidence change what a card may realistically sell for."
            linkLabel="Read the guides"
          />
          <FeatureCard
            href="/collection"
            icon={<WalletCards className="h-5 w-5" />}
            title="Private tools"
            description="Save cards locally, organise favourites and estimate a collection without turning personal empty states into public search pages."
            linkLabel="Open collection"
          />
        </section>

        <GlassPanel className="mt-7">
          <SectionHeading
            eyebrow="Recently released"
            title="Start with the latest indexed sets"
            description="Open a set to browse its checklist, compare card records and move between related printings without leaving the archive."
            action={
              <Link
                href="/sets"
                className="inline-flex items-center gap-2 text-sm font-black text-violet-200/85 transition hover:text-white"
              >
                View all sets <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentSets.map((set) => (
              <Link
                key={set.id}
                href={`/sets/${set.id}`}
                className="group relative overflow-hidden rounded-[1.55rem] border border-white/[0.07] bg-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/[0.17] hover:bg-white/[0.045]"
              >
                <div className="flex min-h-24 items-center gap-4">
                  <div className="relative h-20 w-28 shrink-0">
                    {set.images?.logo ? (
                      <Image
                        src={set.images.logo}
                        alt={`${set.name} logo`}
                        fill
                        sizes="112px"
                        className="object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.45)] transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-2xl border border-white/[0.06] bg-black/20 text-zinc-700">
                        <Boxes className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-black tracking-tight text-white">
                      {set.name}
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-zinc-600">
                      {set.series || "Pokémon TCG"}
                    </p>
                    <p className="mt-3 text-[11px] font-bold text-zinc-500">
                      {formatDate(set.releaseDate)} · {(set.total || set.printedTotal || 0).toLocaleString("en-GB")} cards
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </GlassPanel>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassPanel>
            <SectionHeading
              eyebrow="Evidence before precision"
              title="A price estimate should explain itself"
              description="PokeValue avoids presenting a number as certainty. The marketplace, variant and limitations matter just as much as the figure."
            />
            <div className="space-y-4">
              {[
                "Cardmarket data is prioritised when a usable UK/European-market estimate exists.",
                "A clearly labelled TCGplayer market variant is used only as a fallback.",
                "Raw marketplace estimates are kept separate from professional grading outcomes.",
                "Condition, language, edition, finish, fees and current buyer demand still require manual checking.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.055] bg-black/15 p-4 text-sm leading-7 text-zinc-400"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-violet-300/80" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <PrimaryLink href="/methodology" arrow>
                Read the pricing methodology
              </PrimaryLink>
            </div>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading
              eyebrow="Collector-first"
              title="Built as a focused research niche"
              description="The public pages concentrate on useful card, set and educational content. Personal tools remain available without being treated as public articles."
            />
            <div className="grid gap-3">
              <TrustRow title="Exact identification" text="Set, number, rarity, images and print context stay attached to the card record." />
              <TrustRow title="Original guidance" text="Long-form UK collector guides explain the decisions behind valuation and grading." />
              <TrustRow title="Clear ownership" text="About, contact, editorial, privacy and methodology pages explain who the site is for and how it works." />
              <TrustRow title="Independent status" text="PokeValue clearly states that it is not affiliated with The Pokémon Company." />
            </div>
          </GlassPanel>
        </section>
      </PageShell>
    </AppLayout>
  );
}

function TrustRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <p className="text-sm font-black text-zinc-100">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </div>
  );
}
