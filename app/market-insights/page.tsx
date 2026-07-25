import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, Database, Scale, ShieldCheck, TrendingUp } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import { GlassPanel, PageHero, PageShell, PrimaryLink, SectionHeading, SecondaryLink } from "@/components/ui/SitePage";
import { getAllPokemonCards, getPokemonCardMarketPriceGBP } from "@/lib/pokemon-data";

export const metadata: Metadata = {
  title: "Pokémon TCG Market Insights UK | PokeValue",
  description: "Transparent, data-led views of the PokeValue card archive, with clear limitations and links to the underlying cards and pricing methodology.",
  alternates: { canonical: "https://www.pokevalue.co.uk/market-insights" },
};

export default async function MarketInsightsPage() {
  const cards = await getAllPokemonCards();
  const priced = (Array.isArray(cards) ? cards : [])
    .map((card) => ({ card, price: getPokemonCardMarketPriceGBP(card) }))
    .filter((item) => item.price > 0 && item.card?.id && item.card?.name)
    .sort((a, b) => b.price - a.price);
  const top = priced.slice(0, 12);
  const median = priced.length ? priced[Math.floor(priced.length / 2)]?.price ?? 0 : 0;
  const average = priced.length ? priced.reduce((sum, item) => sum + item.price, 0) / priced.length : 0;

  return (
    <AppLayout>
      <PageShell width="content">
        <PageHero
          eyebrow="Archive intelligence"
          icon={<TrendingUp className="h-4 w-4" />}
          title="Market context without pretending an estimate is certainty."
          description={<p>This hub turns the current local card archive into transparent summary views. It does not predict returns, guarantee liquidity or replace condition-aware sold-price research.</p>}
          actions={<><PrimaryLink href="#archive-snapshot" arrow>View snapshot</PrimaryLink><SecondaryLink href="/methodology">Pricing method</SecondaryLink></>}
          aside={<div className="rounded-[1.7rem] border border-white/[0.07] bg-black/20 p-5"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200/75">Evidence standard</p><p className="mt-4 text-sm leading-7 text-zinc-500">Figures are calculated from the same Cardmarket-first resolver used across PokeValue. They describe the archive, not the entire market.</p></div>}
        />

        <section id="archive-snapshot" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Priced cards", priced.length.toLocaleString("en-GB"), Database],
            ["Archive median", `£${median.toLocaleString("en-GB", { maximumFractionDigits: 2 })}`, Scale],
            ["Archive average", `£${average.toLocaleString("en-GB", { maximumFractionDigits: 2 })}`, BarChart3],
            ["Snapshot date", "24 Jul 2026", CalendarDays],
          ].map(([label, value, Icon]) => (
            <GlassPanel key={String(label)} className="p-5">
              <Icon className="h-4 w-4 text-violet-200/80" />
              <p className="mt-5 text-2xl font-black tracking-tight text-white">{String(value)}</p>
              <p className="mt-2 text-xs font-bold text-zinc-600">{String(label)}</p>
            </GlassPanel>
          ))}
        </section>

        <GlassPanel className="mt-7">
          <SectionHeading eyebrow="Highest current archive estimates" title="Cards worth checking manually" description="These are not investment recommendations. High-value records deserve extra checking for variant, language, finish, condition and recent sold evidence." />
          <div className="grid gap-3 md:grid-cols-2">
            {top.map(({ card, price }, index) => (
              <Link key={card.id} href={`/cards/${card.id}`} className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-black/15 p-4 transition hover:-translate-y-0.5 hover:border-violet-200/[0.16] hover:bg-white/[0.04]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-xs font-black text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-white">{card.name}</p><p className="mt-1 truncate text-xs text-zinc-600">{card.set?.name || "Unknown set"} · #{card.number || "—"}</p></div>
                <p className="text-sm font-black text-violet-100">£{price.toLocaleString("en-GB", { maximumFractionDigits: 2 })}</p>
                <ArrowRight className="h-4 w-4 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-violet-200" />
              </Link>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="mt-7 border-violet-200/[0.12] bg-violet-300/[0.03]">
          <div className="flex items-start gap-4"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-violet-200/85" /><div><h2 className="text-xl font-black text-white">How to interpret this page</h2><p className="mt-3 text-sm leading-7 text-zinc-500">Archive averages are influenced by missing data, extreme cards and marketplace coverage. They are useful for navigation and research prioritisation, not for measuring an investment portfolio or forecasting future prices.</p></div></div>
        </GlassPanel>
      </PageShell>
    </AppLayout>
  );
}
