import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgePoundSterling,
  CheckCircle2,
  Database,
  ExternalLink,
  RefreshCw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Pokémon Card Pricing Methodology",
  description:
    "Learn how PokeValue selects marketplace price fields, converts currencies, handles variants and avoids displaying unsupported Pokémon card values.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk/methodology",
  },
};

const sections = [
  {
    icon: Database,
    title: "Card and set data",
    paragraphs: [
      "PokeValue stores a local snapshot of Pokémon TCG card and set records sourced from the Pokémon TCG API. The local archive helps card, set and search pages return consistent information without relying on a fresh third-party request for every visitor.",
      "Card names, set details, collector numbers, images, rarities and marketplace fields may still be incomplete when the upstream source has not supplied them. PokeValue shows a missing-data message rather than inventing a value.",
    ],
  },
  {
    icon: Scale,
    title: "One price rule across the site",
    paragraphs: [
      "Every PokeValue page uses the same deterministic price resolver. For a UK and European audience, an available Cardmarket trend price is selected first. If Cardmarket data is unavailable, PokeValue falls back to the market field for one clearly identified TCGplayer card variant.",
      "The selected marketplace, currency and variant are displayed on the card page. Reverse-holo, first-edition, unlimited, normal and holofoil prices are not silently mixed together.",
    ],
  },
  {
    icon: BadgePoundSterling,
    title: "Currency display",
    paragraphs: [
      "Marketplace values are supplied in euros or US dollars. PokeValue converts them into the visitor's chosen display currency using central site conversion factors. These conversions are approximate display estimates, not live foreign-exchange quotes.",
      "Changing the display currency does not change the underlying marketplace value or card variant selected by the resolver.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Updates and reference fields",
    paragraphs: [
      "Where the source supplies an update date, PokeValue displays it beside the marketplace reference. Cardmarket averages, trend prices and low listings are shown as separately labelled reference fields rather than being connected into a fictional historical chart.",
      "A marketplace estimate is not the same as a confirmed sale. Condition, language, centering, grading, seller fees and demand can all cause the actual sale price to differ.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Missing and low-confidence data",
    paragraphs: [
      "PokeValue does not substitute zero for a missing price. Cards without enough useful information are excluded from the public XML sitemap and may be marked noindex until a card image, set identity and marketplace estimate are available.",
      "Collection totals are estimates based on the same resolver used by public card pages, so a saved card should not show a different underlying market value elsewhere on the site.",
    ],
  },
];

export default function MethodologyPage() {
  return (
    <AppLayout>
      <main className="relative mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />

        <header className="relative border-b border-white/[0.06] pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-purple-300">
            <CheckCircle2 size={14} />
            Transparent pricing
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            How PokeValue chooses a card price
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400">
            This page explains the data source, marketplace priority, variant
            selection and limitations behind every price estimate displayed on
            PokeValue.
          </p>

          <p className="mt-4 text-sm text-zinc-600">
            Methodology last reviewed: 18 July 2026
          </p>
        </header>

        <div className="relative mt-8 space-y-5">
          {sections.map(({ icon: Icon, title, paragraphs }) => (
            <section
              key={title}
              className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl md:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                  <Icon size={19} />
                </span>
                <h2 className="text-2xl font-black text-white">{title}</h2>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-8 text-zinc-400">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="relative mt-8 rounded-3xl border border-purple-500/20 bg-purple-500/[0.06] p-6 md:p-8">
          <h2 className="text-2xl font-black text-white">Report a problem</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            Include the card name, set, collector number and the value you
            believe is incorrect. PokeValue can then compare the stored source
            fields and correct a resolver or data issue.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-500"
            >
              Contact PokeValue
              <ExternalLink size={14} />
            </Link>
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-black text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              Editorial policy
            </Link>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
