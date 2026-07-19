import type { Metadata } from "next";
import Link from "next/link";
import { Scale } from "lucide-react";

import PolicyPage from "@/components/ui/PolicyPage";
import { GlassPanel, PrimaryLink, SecondaryLink } from "@/components/ui/SitePage";

export const metadata: Metadata = {
  title: "Pricing Methodology | PokeValue",
  description:
    "See how PokeValue selects and labels Pokémon card marketplace estimates, handles variants and explains limitations for UK collectors.",
  alternates: { canonical: "https://www.pokevalue.co.uk/methodology" },
};

const sections = [
  {
    title: "Purpose of the displayed estimate",
    paragraphs: [
      <p key="a">PokeValue displays marketplace estimates to make card research faster. The figure is a reference point for the database record, not a promise that a particular copy will sell for that amount. It does not automatically account for the condition, language, finish, edition, authenticity or grading potential of the card in your hand.</p>,
      <p key="b">The estimate should be used to identify cards that deserve closer research. For an important buying, selling or grading decision, compare several recent transactions that match the exact printing and condition.</p>,
    ],
  },
  {
    title: "One resolver across the platform",
    paragraphs: [
      <p key="a">Card pages, set checklists, search results, favourites, collection and portfolio tools use the same shared pricing resolver. This prevents one page from silently using a different marketplace or variant from another page.</p>,
      <p key="b">When a record has usable Cardmarket information, the resolver prioritises that source for the UK and European context. When Cardmarket data is unavailable, one available TCGplayer market variant may be selected as a fallback. The source and chosen variant are shown with the estimate wherever the interface has room.</p>,
    ],
  },
  {
    title: "Variant selection",
    paragraphs: [
      <p key="a">A card record can contain several price fields, such as normal, holofoil, reverse-holofoil, first-edition or unlimited. These are not interchangeable. PokeValue follows a fixed preference order and labels the selected field rather than simply choosing the highest number.</p>,
      <p key="b">The database cannot inspect a physical card. You must compare the displayed variant with the finish and edition in your hand. When they do not match, do not apply the estimate to that card.</p>,
    ],
  },
  {
    title: "Currency display",
    paragraphs: [
      <p key="a">PokeValue is UK-focused and displays GBP by default. Source data may originate in euros or US dollars, so currency presentation is an aid to comparison rather than a locked exchange contract. Conversion rates and marketplace values can change independently.</p>,
      <p key="b">A converted marketplace estimate is not the same as expected net proceeds. Selling fees, payment fees, postage, insurance, import costs, taxes and negotiation can materially change the amount a seller receives.</p>,
    ],
  },
  {
    title: "Condition and graded cards",
    paragraphs: [
      <p key="a">Raw marketplace estimates do not assign a professional condition grade to your copy. Whitening, scratches, dents, creases, print lines, centering and surface pressure marks may move a real sale well below or above a general market reference.</p>,
      <p key="b">Graded cards belong to a separate market. The grading company, assigned grade, population, label, holder and buyer confidence all affect value. A raw card should never be valued as though it has already received a top grade.</p>,
    ],
  },
  {
    title: "Freshness and missing data",
    paragraphs: [
      <p key="a">Marketplace feeds update on their own schedules and may be incomplete. Some records have no usable price, while others may retain an estimate after market activity has slowed. PokeValue does not invent a number when the underlying record lacks a usable field.</p>,
      <p key="b">For thinly traded cards, unusual errors, rare vintage printings or high-value decisions, recent matching sold evidence and specialist judgement are more important than a database aggregate.</p>,
    ],
  },
  {
    title: "Responsible use",
    paragraphs: [
      <p key="a">Use the exact set name and collector number, confirm the finish, inspect condition outside the sleeve, compare multiple matching sales and calculate the likely costs of the sales channel. A valuation range is usually more honest than an exact figure.</p>,
      <p key="b">PokeValue is not a financial adviser, auction house, grading company or authentication service. Report suspected data problems through the <Link key="contact" href="/contact" className="font-bold text-violet-200/85 hover:text-white">Contact page</Link>.</p>,
    ],
  },
];

export default function MethodologyPage() {
  return (
    <PolicyPage
      eyebrow="Trust & transparency"
      title="Pricing methodology"
      description={<p>How PokeValue chooses a marketplace field, keeps that rule consistent across pages and communicates the limitations of card-price data.</p>}
      icon={<Scale className="h-4 w-4" />}
      updated="18 July 2026"
      sections={sections}
    >
      <GlassPanel className="border-violet-200/[0.11] bg-violet-300/[0.03]">
        <h2 className="text-2xl font-black text-white">Research the exact record</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-500">Start with the card archive, then use the valuation guide to turn a general source estimate into a realistic condition-aware range.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <PrimaryLink href="/cards" arrow>Search cards</PrimaryLink>
          <SecondaryLink href="/guides/how-to-value-pokemon-cards">Valuation guide</SecondaryLink>
        </div>
      </GlassPanel>
    </PolicyPage>
  );
}
