import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";


export const metadata: Metadata = {
  title: "Terms of Service | PokeValue",
  description:
    "Read the terms that apply to PokeValue card research, marketplace estimates and browser-based collection tools.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk/terms",
  },
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using PokeValue, you agree to these Terms of Service. If you do not agree with these terms, you should stop using the website.",
    ],
  },
  {
    title: "2. Website Purpose",
    body: [
      "PokeValue provides Pokémon Trading Card Game research tools, collection tracking features, estimated card values, set information, guides, and market-style summaries for informational purposes only.",
      "The website is intended to help collectors research cards and organise collections. It should not be treated as a guaranteed pricing service, investment platform, or professional valuation service.",
    ],
  },
  {
    title: "3. Price Estimates",
    body: [
      "Prices shown on PokeValue are estimates based on available third-party market data and may not reflect the exact amount a card will sell for.",
      "Actual selling prices can vary based on card condition, grading, rarity, demand, seller reputation, platform fees, location, timing, and recent market activity.",
    ],
  },
  {
    title: "4. No Financial Advice",
    body: [
      "Nothing on PokeValue is financial, investment, trading, or professional collecting advice. You are responsible for your own buying, selling, grading, and collecting decisions.",
    ],
  },
  {
    title: "5. User Collections",
    body: [
      "Collection and favourite data is currently stored locally in your browser unless otherwise stated. This means data may be lost if you clear browser storage, change device, or use a different browser.",
      "You are responsible for keeping your own records or backups of any collection information that is important to you.",
    ],
  },
  {
    title: "6. Accuracy and Availability",
    body: [
      "PokeValue aims to provide useful and accurate information, but we cannot guarantee that all card data, prices, set details, or market information will always be complete, current, or error-free.",
      "The website may change, update, break, or become unavailable at any time without notice.",
    ],
  },
  {
    title: "7. Third-Party Services",
    body: [
      "PokeValue may use third-party APIs, analytics tools, advertising networks, hosting providers, and card data sources. We are not responsible for the accuracy, availability, policies, or practices of third-party services.",
    ],
  },
  {
    title: "8. Advertising and Analytics",
    body: [
      "PokeValue may display advertising and use analytics to understand site usage and improve the platform. Advertising and analytics providers may use cookies or similar technologies as described in the Privacy Policy.",
    ],
  },
  {
    title: "9. Intellectual Property",
    body: [
      "Pokémon, Pokémon TCG, card names, images, logos, and related trademarks are owned by Nintendo, Game Freak, Creatures Inc., and The Pokémon Company International.",
      "PokeValue is an independent fan-made platform and is not affiliated with, endorsed by, sponsored by, or approved by The Pokémon Company International, Nintendo, Game Freak, or Creatures Inc.",
    ],
  },
  {
    title: "10. Acceptable Use",
    body: [
      "You agree not to misuse the website, attempt to disrupt its operation, scrape it aggressively, abuse APIs, upload harmful content, or use PokeValue for unlawful purposes.",
    ],
  },
  {
    title: "11. Limitation of Liability",
    body: [
      "PokeValue is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, PokeValue is not liable for losses, damages, incorrect valuations, missed sales, purchasing decisions, grading decisions, or reliance on information displayed on the website.",
    ],
  },
  {
    title: "12. Changes to These Terms",
    body: [
      "These Terms of Service may be updated from time to time. Continued use of the website after changes are posted means you accept the updated terms.",
    ],
  },
  {
    title: "13. Contact",
    body: [
      "Questions about these Terms of Service can be sent through the Contact page or by emailing olivercott35@gmail.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="relative w-full px-6 md:px-10 py-10 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-20 left-16 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <div className="relative max-w-7xl mx-auto">
          <header className="mb-10 border-b border-white/[0.05] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
              Legal Documentation
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>

            <p className="mt-4 text-zinc-500 max-w-3xl leading-7">
              The rules, responsibilities, and terms that apply when using
              PokeValue.
            </p>

            <p className="mt-4 text-sm text-zinc-600">Last updated: 18 July 2026</p>
          </header>

          <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl">
            <div className="space-y-6">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-3xl border border-white/[0.05] bg-white/[0.025] p-6"
                >
                  <h2 className="text-2xl font-black text-white mb-4">
                    {section.title}
                  </h2>

                  <div className="space-y-4 text-zinc-400 leading-8">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}