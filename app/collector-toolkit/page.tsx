import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Camera, ClipboardCheck, FolderHeart, PackageCheck, SearchCheck } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import { GlassPanel, PageHero, PageShell, PrimaryLink, SectionHeading, SecondaryLink } from "@/components/ui/SitePage";

export const metadata: Metadata = {
  title: "Pokémon Card Collector Toolkit | PokeValue",
  description: "A practical toolkit for identifying, valuing, photographing, storing, cataloguing and preparing Pokémon cards for sale or grading.",
  alternates: { canonical: "https://www.pokevalue.co.uk/collector-toolkit" },
};

const workflows = [
  { title: "Identify a card", copy: "Use set name and collector number before comparing any price.", icon: SearchCheck, href: "/cards" },
  { title: "Inspect condition", copy: "Check front, back, corners, edges and angled surface views.", icon: Camera, href: "/guides/pokemon-card-condition-guide" },
  { title: "Build a valuation", copy: "Collect matching sold evidence and calculate a realistic range.", icon: Calculator, href: "/guides/how-to-value-pokemon-cards" },
  { title: "Catalogue ownership", copy: "Record identifiers, cost, condition, images and storage location.", icon: FolderHeart, href: "/guides/pokemon-card-collection-inventory-guide" },
  { title: "Prepare a sale", copy: "Describe accurately, price the total costs and package securely.", icon: PackageCheck, href: "/guides/selling-pokemon-cards-uk-guide" },
  { title: "Consider grading", copy: "Compare several grade outcomes instead of only the best case.", icon: ClipboardCheck, href: "/guides/should-you-grade-pokemon-cards" },
];

export default function CollectorToolkitPage() {
  return (
    <AppLayout>
      <PageShell width="content">
        <PageHero eyebrow="Repeatable collector workflows" icon={<Calculator className="h-4 w-4" />} title="Turn a card into a documented decision." description={<p>The toolkit connects PokeValue’s archive, guides and personal collection tools into a clear process. It is designed to reduce identification mistakes and unsupported valuations.</p>} actions={<><PrimaryLink href="#workflows" arrow>Start a workflow</PrimaryLink><SecondaryLink href="/guides">Read all guides</SecondaryLink></>} />
        <GlassPanel className="mt-7">
          <div id="workflows" className="scroll-mt-24"><SectionHeading eyebrow="Collector workflow library" title="Six useful starting points" description="Choose the task you are actually trying to complete, then follow the linked evidence and limitations." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{workflows.map(({ title, copy, icon: Icon, href }) => <Link key={title} href={href} className="group rounded-[1.6rem] border border-white/[0.07] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-violet-200/[0.18] hover:bg-white/[0.045]"><Icon className="h-5 w-5 text-violet-200/80" /><h2 className="mt-5 text-lg font-black text-white">{title}</h2><p className="mt-3 text-sm leading-7 text-zinc-500">{copy}</p><p className="mt-5 inline-flex items-center gap-2 text-xs font-black text-violet-200/75">Open workflow <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></p></Link>)}</div></div>
        </GlassPanel>
        <GlassPanel className="mt-7"><SectionHeading eyebrow="Personal tools" title="Track privately, publish selectively" description="Collection, favourites, portfolio and analytics pages are useful browser tools but remain noindex and ad-free because an empty personal screen is not public editorial content." /><div className="flex flex-wrap gap-3"><PrimaryLink href="/collection">Open collection</PrimaryLink><SecondaryLink href="/portfolio">Portfolio</SecondaryLink><SecondaryLink href="/analytics">Analytics</SecondaryLink></div></GlassPanel>
      </PageShell>
    </AppLayout>
  );
}
