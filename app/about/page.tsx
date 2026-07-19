import type { Metadata } from "next";
import { BookOpen, Database, Info, Search, ShieldCheck, WalletCards } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import {
  FeatureCard,
  GlassPanel,
  PageHero,
  PageShell,
  PrimaryLink,
  SectionHeading,
  SecondaryLink,
} from "@/components/ui/SitePage";

export const metadata: Metadata = {
  title: "About PokeValue | Independent UK Pokémon TCG Research",
  description:
    "Learn why PokeValue exists, who it is designed for and how the independent UK-focused Pokémon card research platform approaches prices and collector education.",
  alternates: { canonical: "https://www.pokevalue.co.uk/about" },
};

export default function AboutPage() {
  return (
    <AppLayout>
      <PageShell width="content">
        <PageHero
          eyebrow="About PokeValue"
          icon={<Info className="h-4 w-4" />}
          title="A focused research workspace for Pokémon card collectors."
          description={
            <p>
              PokeValue is an independent fan-made platform built in the UK. It
              helps collectors identify cards, browse set checklists, understand
              marketplace estimates and organise a private collection through a
              clean, premium interface.
            </p>
          }
          actions={
            <>
              <PrimaryLink href="/cards" arrow>Explore cards</PrimaryLink>
              <SecondaryLink href="/methodology">How prices work</SecondaryLink>
            </>
          }
        />

        <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard icon={<Search className="h-5 w-5" />} title="Research" description="Find the exact card using set, number, rarity, images and print context." />
          <FeatureCard icon={<Database className="h-5 w-5" />} title="Compare" description="Review clearly labelled marketplace estimates without pretending they are guaranteed sales." />
          <FeatureCard icon={<BookOpen className="h-5 w-5" />} title="Learn" description="Use substantial collector guides to understand condition, authenticity, grading and value." />
          <FeatureCard icon={<WalletCards className="h-5 w-5" />} title="Organise" description="Save collection and favourite data locally in the browser for private tracking." />
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <SectionHeading eyebrow="Why it exists" title="Better context, not just a bigger number." />
            <div className="space-y-5 text-sm leading-8 text-zinc-400">
              <p>
                Pokémon card values are easy to oversimplify. Two copies with
                the same artwork can belong to different sets, finishes,
                languages or editions. Two copies of the same printing can also
                be worth very different amounts because of surface damage,
                whitening, centering, creases or grading outcomes.
              </p>
              <p>
                PokeValue is designed to keep the identity of the card attached
                to the price evidence. Card records show set details and imagery,
                while the shared pricing resolver identifies the marketplace and
                selected variant used for an estimate. The methodology explains
                where that rule is useful and where manual checking is still
                essential.
              </p>
              <p>
                The long-term aim is not to become a noisy general Pokémon site.
                It is to remain a specialist collector archive: deep card and set
                data, clear research tools, practical UK guidance and a premium
                experience that respects the user’s time.
              </p>
            </div>
          </GlassPanel>

          <GlassPanel>
            <SectionHeading eyebrow="Independence" title="Clear about what PokeValue is—and is not." />
            <div className="space-y-4 text-sm leading-7 text-zinc-500">
              <p>
                PokeValue is not affiliated with, endorsed by or sponsored by
                Nintendo, Game Freak, Creatures Inc. or The Pokémon Company.
              </p>
              <p>
                It is not a professional appraisal, authentication or financial
                advisory service. Estimates can be incomplete or stale and must
                be checked against the exact card and current evidence.
              </p>
              <p>
                Editorial pages are written for collectors first. Corrections,
                material limitations and the difference between evidence and
                opinion are covered in the editorial policy.
              </p>
              <div className="pt-2">
                <SecondaryLink href="/editorial-policy">Read editorial policy</SecondaryLink>
              </div>
            </div>
          </GlassPanel>
        </section>

        <GlassPanel className="mt-7 border-violet-200/[0.11] bg-violet-300/[0.03]">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-violet-200/85" />
            <div>
              <h2 className="text-xl font-black text-white">A transparent research tool</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-500">
                Before buying, selling or grading an important card, compare the
                exact variant, inspect condition carefully, review several recent
                matching sales and account for fees. PokeValue helps organise
                that research; it does not replace it.
              </p>
            </div>
          </div>
        </GlassPanel>
      </PageShell>
    </AppLayout>
  );
}
