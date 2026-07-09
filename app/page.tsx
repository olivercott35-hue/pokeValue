import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { guides } from "@/lib/guides";

export const metadata = {
  title: "PokeValue | UK Pokémon Card Price Tracker",
  description:
    "Track Pokémon card prices, explore sets, browse collecting guides, and manage your Pokémon TCG collection with PokeValue.",
};

export default function HomePage() {
  const featuredGuides = guides.slice(0, 6);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-10 md:p-16">
          <p className="text-sm font-semibold text-purple-400 mb-4">
            UK Pokémon Card Price Tracker
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl">
            Track Pokémon card prices, explore sets, and learn what your cards
            are worth.
          </h1>

          <p className="mt-6 text-zinc-400 text-lg max-w-3xl leading-8">
            PokeValue helps Pokémon collectors research card prices, browse
            sets, understand rarity, track collections, and learn how Pokémon
            card values change over time.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/cards"
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-500 transition"
            >
              Browse Cards
            </Link>

            <Link
              href="/guides"
              className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-zinc-200 hover:bg-white/5 transition"
            >
              Read Guides
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            {
              title: "Live Card Prices",
              text: "Research Pokémon card values using market data, rarity, set information, and card details.",
            },
            {
              title: "Set Explorer",
              text: "Browse Pokémon sets, view cards, compare rarities, and discover valuable pulls from each release.",
            },
            {
              title: "Collector Guides",
              text: "Learn about grading, condition, fake cards, rarity symbols, sealed products, and market trends.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6"
            >
              <h2 className="text-xl font-bold text-white">{item.title}</h2>
              <p className="mt-3 text-zinc-400 leading-7">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-zinc-950/60 p-8">
          <p className="text-sm font-semibold text-purple-400 mb-3">
            Pokémon Collecting Hub
          </p>

          <h2 className="text-3xl font-bold text-white mb-4">
            What is PokeValue?
          </h2>

          <div className="space-y-5 text-zinc-400 leading-8">
            <p>
              PokeValue is a Pokémon card value and collection tracking platform
              designed to make the Pokémon TCG market easier to understand. Many
              collectors own cards but do not know which ones are valuable, how
              condition affects price, or which sets are worth exploring.
            </p>

            <p>
              The platform lets you search Pokémon cards, browse full sets, view
              card rarities, check market prices, save favourites, and track
              your collection. It is built for collectors who want a faster and
              cleaner way to research Pokémon card values.
            </p>

            <p>
              Pokémon card prices can change because of rarity, grading
              potential, condition, demand, nostalgia, reprints, and collector
              hype. PokeValue combines card tools with educational guides so
              collectors can make better buying, selling, and grading decisions.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <p className="text-sm font-semibold text-purple-400 mb-3">
                Latest Guides
              </p>

              <h2 className="text-3xl font-bold text-white">
                Learn how Pokémon card values work
              </h2>
            </div>

            <Link
              href="/guides"
              className="hidden md:inline-flex rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-200 hover:bg-white/5 transition"
            >
              View all guides
            </Link>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {featuredGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 hover:border-purple-500/40 transition"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
                  {guide.category} • {guide.readTime}
                </p>

                <h3 className="text-xl font-bold text-white">{guide.title}</h3>

                <p className="mt-3 text-zinc-400 leading-7">
                  {guide.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-purple-400">
                  Read guide →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
            <h2 className="text-2xl font-bold mb-3 text-white">
              For collectors
            </h2>

            <p className="text-zinc-400 leading-7">
              Quickly check what your Pokémon cards may be worth, save cards you
              own, and build a better understanding of your collection over
              time.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
            <h2 className="text-2xl font-bold mb-3 text-white">
              For market research
            </h2>

            <p className="text-zinc-400 leading-7">
              Explore valuable cards, compare sets, identify popular releases,
              and follow how different parts of the Pokémon TCG market perform.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-zinc-950/60 p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white">
                Are Pokémon card prices always exact?
              </h3>
              <p className="text-zinc-400 mt-2 leading-7">
                No. Prices should be used as estimates because real selling
                prices can change depending on condition, grading, demand, and
                where the card is sold.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Can I track my own collection?
              </h3>
              <p className="text-zinc-400 mt-2 leading-7">
                Yes. PokeValue lets you add cards to your collection and monitor
                an estimated portfolio value.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Is PokeValue only for UK collectors?
              </h3>
              <p className="text-zinc-400 mt-2 leading-7">
                The site is designed with UK collectors in mind, but anyone can
                use it to research Pokémon cards, sets, rarity, and market
                trends.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}