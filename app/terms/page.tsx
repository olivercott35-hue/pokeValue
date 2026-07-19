import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

import PolicyPage from "@/components/ui/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service | PokeValue",
  description:
    "Terms covering PokeValue card research, marketplace estimates, browser-based collection tools and acceptable use.",
  alternates: { canonical: "https://www.pokevalue.co.uk/terms" },
};

const sections = [
  {
    title: "Acceptance and website purpose",
    paragraphs: [
      <p key="a">By using PokeValue, you agree to these terms. If you do not agree, stop using the website.</p>,
      <p key="b">PokeValue provides Pokémon Trading Card Game records, marketplace estimates, set information, educational guides and browser-based organisation tools for general informational purposes.</p>,
    ],
  },
  {
    title: "Price estimates and no financial advice",
    paragraphs: [
      <p key="a">Displayed prices are estimates based on available third-party fields. Actual sale prices can differ because of condition, authenticity, edition, grading, demand, seller reputation, fees, location and timing.</p>,
      <p key="b">Nothing on PokeValue is financial, investment, tax, legal, authentication, grading or professional appraisal advice. You remain responsible for buying, selling and grading decisions.</p>,
    ],
  },
  {
    title: "Browser-stored tools",
    paragraphs: [
      <p key="a">Collection, favourites and portfolio records are currently stored locally in the browser unless a feature states otherwise. Data may be lost when storage is cleared, a private session ends, the browser is changed or a different device is used.</p>,
      <p key="b">You are responsible for maintaining separate records or backups of information that matters to you.</p>,
    ],
  },
  {
    title: "Accuracy and availability",
    paragraphs: [
      <p key="a">PokeValue aims to provide useful information but does not guarantee that every card record, image, price, set detail, article or external link is complete, current or error-free.</p>,
      <p key="b">Features may be changed, suspended or removed. The website may occasionally be unavailable because of maintenance, provider failure, security work or circumstances outside the operator’s control.</p>,
    ],
  },
  {
    title: "Third-party services and advertising",
    paragraphs: [
      <p key="a">PokeValue may use card-data providers, image hosts, marketplaces, analytics, advertising networks and hosting providers. Those services are responsible for their own availability, terms and privacy practices.</p>,
      <p key="b">Advertising may appear on eligible public-content pages. The presence of an advertisement does not amount to an endorsement or change PokeValue editorial conclusions.</p>,
    ],
  },
  {
    title: "Intellectual property and independent status",
    paragraphs: [
      <p key="a">Pokémon names, card artwork, logos and related trademarks belong to their respective owners, including Nintendo, Game Freak, Creatures Inc. and The Pokémon Company.</p>,
      <p key="b">PokeValue is an independent fan-made platform and is not affiliated with, endorsed by, sponsored by or approved by those rights holders. Original PokeValue interface design, writing and site code remain protected by applicable rights.</p>,
    ],
  },
  {
    title: "Acceptable use",
    paragraphs: [
      <p key="a">You must not attempt to disrupt the website, bypass security, overload infrastructure, upload harmful content, misuse APIs, automate abusive requests, impersonate others or use the service for unlawful activity.</p>,
      <p key="b">Reasonable personal research is welcome. Systematic extraction, redistribution or commercial reuse may require permission from both PokeValue and the relevant third-party data or image owners.</p>,
    ],
  },
  {
    title: "Liability, changes and contact",
    paragraphs: [
      <p key="a">PokeValue is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, the operator is not responsible for losses caused by reliance on estimates, incorrect data, missed transactions, grading decisions, unavailable tools or third-party services.</p>,
      <p key="b">These terms may be updated when the site or applicable requirements change. Questions can be sent through the <Link key="contact" href="/contact" className="font-bold text-violet-200/85 hover:text-white">Contact page</Link>.</p>,
    ],
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms of service"
      description={<p>The rules and limitations that apply when using the PokeValue archive, educational content and browser-based collector tools.</p>}
      icon={<FileText className="h-4 w-4" />}
      updated="18 July 2026"
      sections={sections}
    />
  );
}
