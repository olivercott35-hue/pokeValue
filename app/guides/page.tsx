import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, ShieldCheck } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import {
  GlassPanel,
  PageHero,
  PageShell,
  PrimaryLink,
  SectionHeading,
  SecondaryLink,
} from "@/components/ui/SitePage";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Pokémon Card Collecting Guides | PokeValue",
  description:
    "Original UK-focused guides to valuing, inspecting, authenticating and grading Pokémon cards using repeatable evidence rather than hype.",
  alternates: { canonical: "https://www.pokevalue.co.uk/guides" },
};

export default function GuidesPage() {
  return (
    <AppLayout>
      <PageShell width="content">
        <PageHero
          eyebrow="Original collector education"
          icon={<BookOpen className="h-4 w-4" />}
          title="Practical Pokémon card guides built around real decisions."
          description={
            <p>
              Use these long-form guides to identify cards correctly, inspect
              condition, compare marketplace evidence, assess authenticity and
              decide whether grading makes sense. Every article is reviewed
              under the PokeValue editorial policy.
            </p>
          }
          actions={
            <>
              <PrimaryLink href="#guide-library" arrow>
                Browse the library
              </PrimaryLink>
              <SecondaryLink href="/editorial-policy">Editorial policy</SecondaryLink>
            </>
          }
          aside={
            <div className="rounded-[1.7rem] border border-white/[0.07] bg-black/20 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200/75">
                Library standard
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-500">
                <p>• UK terminology and realistic selling costs</p>
                <p>• Exact variants and condition considered</p>
                <p>• No guaranteed values or investment promises</p>
                <p>• Visible review and update dates</p>
              </div>
            </div>
          }
        />

        <GlassPanel className="mt-7" as="div">
          <div id="guide-library" className="scroll-mt-24">
            <SectionHeading
              eyebrow="Guide library"
              title={`${guides.length} focused collector guides`}
              description="A smaller, stronger library is more useful than dozens of shallow pages. Each guide covers a core task in enough detail to act on it."
            />

            <div className="grid gap-4 md:grid-cols-2">
              {guides.map((guide, index) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group relative overflow-hidden rounded-[1.65rem] border border-white/[0.07] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-200/[0.18] hover:bg-white/[0.045]"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-500/[0.045] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200/75">
                        {guide.category}
                      </p>
                      <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em] text-white">
                        {guide.title}
                      </h2>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-600 transition group-hover:text-violet-200">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="relative mt-4 text-sm leading-7 text-zinc-500">
                    {guide.description}
                  </p>

                  <div className="relative mt-5 flex flex-wrap items-center gap-4 text-[11px] font-bold text-zinc-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" /> {guide.readTime}
                    </span>
                    <span>Updated {guide.updated}</span>
                  </div>

                  <p className="relative mt-5 inline-flex items-center gap-2 text-sm font-black text-violet-200/80">
                    Read guide
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="mt-7">
          <div className="grid gap-7 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <p className="pv-section-kicker">How to use the library</p>
              <h2 className="pv-section-title">Read first, then verify the exact card.</h2>
              <p className="pv-section-copy">
                A guide can explain the process, but the final judgement still
                depends on the exact printing, finish, language, condition and
                current marketplace evidence. Open the card archive after
                reading and compare like with like.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryLink href="/cards" arrow>
                  Search cards
                </PrimaryLink>
                <SecondaryLink href="/methodology">Pricing methodology</SecondaryLink>
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-violet-200/[0.12] bg-violet-300/[0.035] p-5">
              <ShieldCheck className="h-5 w-5 text-violet-200/85" />
              <p className="mt-4 text-sm font-black text-white">Important limitation</p>
              <p className="mt-2 text-sm leading-7 text-zinc-500">
                PokeValue provides research and education, not authentication,
                professional appraisal, financial advice or a guaranteed sale
                price.
              </p>
            </div>
          </div>
        </GlassPanel>
      </PageShell>
    </AppLayout>
  );
}
