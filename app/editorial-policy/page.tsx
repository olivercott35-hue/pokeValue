import type { Metadata } from "next";
import Link from "next/link";
import { BookCheck } from "lucide-react";

import PolicyPage from "@/components/ui/PolicyPage";

export const metadata: Metadata = {
  title: "Editorial Policy | PokeValue",
  description:
    "How PokeValue plans, writes, reviews, updates and corrects Pokémon card guides and research content.",
  alternates: { canonical: "https://www.pokevalue.co.uk/editorial-policy" },
};

const sections = [
  {
    title: "Collector-first purpose",
    paragraphs: [
      <p key="a">PokeValue publishes content to help collectors make clearer identification, condition, valuation, authenticity and grading decisions. Articles should answer a real collector question rather than exist only to target a search phrase.</p>,
      <p key="b">The guide library intentionally favours a smaller number of substantial pages over a large volume of repetitive articles. Each published guide should add practical steps, examples, limitations or decision criteria.</p>,
    ],
  },
  {
    title: "Research and sourcing",
    paragraphs: [
      <p key="a">Card identities should be checked against reliable set and card records. Claims about marketplace behaviour should distinguish active listings, aggregate estimates and completed sales. Claims about grading should avoid implying that a visual inspection guarantees a grade.</p>,
      <p key="b">Where a statement can change over time, writers should identify the date or describe it as a current observation rather than a permanent fact. Speculation must be labelled as speculation and should not be presented with a definitive news headline.</p>,
    ],
  },
  {
    title: "Writing and review",
    paragraphs: [
      <p key="a">Guides are written in plain UK English for collectors with different levels of experience. They should explain specialist terms, avoid exaggerated promises and separate evidence from opinion.</p>,
      <p key="b">Before publication, a guide is reviewed for factual consistency, usefulness, duplicated wording, misleading read-time claims, internal links and alignment with the pricing methodology. The visible update date should change when a material revision is made.</p>,
    ],
  },
  {
    title: "Prices and commercial influence",
    paragraphs: [
      <p key="a">A displayed card value is not editorial proof that a card is a good purchase. Guides must not promise profit, guaranteed appreciation or a guaranteed grading outcome. Marketplace data and educational content should remain clearly distinguishable.</p>,
      <p key="b">Advertising does not determine article conclusions, card rankings or pricing rules. Sponsored material, affiliate relationships or supplied products would need clear disclosure if introduced in the future.</p>,
    ],
  },
  {
    title: "Corrections",
    paragraphs: [
      <p key="a">Material errors should be corrected promptly once verified. A correction may include changing card identification, clarifying a variant, removing an unsupported claim or revising outdated guidance.</p>,
      <p key="b">Readers can report an issue through the <Link key="contact" href="/contact" className="font-bold text-violet-200/85 hover:text-white">Contact page</Link>. A useful report includes the page URL, the exact statement, the proposed correction and supporting evidence.</p>,
    ],
  },
  {
    title: "Authorship and accountability",
    paragraphs: [
      <p key="a">Published guides identify the PokeValue Editorial Team as the responsible authoring entity and link back to this policy. PokeValue is independently operated and is not affiliated with The Pokémon Company, Nintendo, Game Freak or Creatures Inc.</p>,
      <p key="b">The site owner remains responsible for final publication decisions. PokeValue does not claim professional appraiser, legal, tax, financial-adviser or grading-company status.</p>,
    ],
  },
];

export default function EditorialPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Editorial standards"
      title="Editorial policy"
      description={<p>The standards used to keep PokeValue guides useful, original, transparent and clearly separated from marketplace estimates or advertising.</p>}
      icon={<BookCheck className="h-4 w-4" />}
      updated="18 July 2026"
      sections={sections}
    />
  );
}
