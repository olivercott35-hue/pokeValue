import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { guides } from "@/lib/guides";

export const metadata = {
  title: "Pokémon Card Guides | PokeValue",
  description:
    "Learn how to value Pokémon cards, check condition, understand grading, avoid fakes, protect cards, and follow Pokémon TCG market trends.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk/guides",
  },
  openGraph: {
    title: "Pokémon Card Guides | PokeValue",
    description:
      "Practical Pokémon TCG guides for UK collectors researching value, condition, grading and storage.",
    url: "https://www.pokevalue.co.uk/guides",
    siteName: "PokeValue",
    type: "website",
  },
};

export default function GuidesPage() {
  const featuredGuides = guides.slice(0, 3);
  const categories = Array.from(new Set(guides.map((guide) => guide.category)));

  return (
    <AppLayout>
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <section className="mb-10 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl">
          <p className="text-sm font-semibold text-purple-400 mb-3">
            Pokémon Collecting Guides
          </p>

          <h1 className="max-w-4xl text-4xl md:text-6xl font-black tracking-tight text-white">
            Learn how to value, collect, protect, and understand Pokémon cards
          </h1>

          <p className="mt-6 max-w-4xl text-zinc-400 leading-8">
            PokeValue guides help collectors understand Pokémon card prices,
            condition, rarity, grading, fake cards, storage, market trends,
            buying decisions, selling strategies, and long-term collecting.
          </p>
        </section>

        <section className="mb-10 grid gap-5 md:grid-cols-3">
          {featuredGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6 hover:border-purple-500/50 transition"
            >
              <p className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3">
                Featured • {guide.readTime}
              </p>

              <h2 className="text-2xl font-black text-white leading-tight">
                {guide.title}
              </h2>

              <p className="mt-4 text-zinc-400 leading-7">
                {guide.description}
              </p>

              <p className="mt-5 text-sm font-bold text-purple-400">
                Read featured guide →
              </p>
            </Link>
          ))}
        </section>

        <section className="mb-10 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl">
          <p className="mb-4 text-sm font-semibold text-purple-400">
            Browse by category
          </p>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-sm font-bold text-zinc-300"
              >
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <p className="text-sm font-semibold text-purple-400 mb-3">
            All Guides
          </p>

          <h2 className="text-3xl font-black text-white">
            Pokémon TCG collecting library
          </h2>

          <p className="mt-3 max-w-3xl text-zinc-500 leading-7">
            Use these guides as a starting point before buying, selling,
            grading, storing, or researching Pokémon cards. Prices can change,
            so always compare current market data and condition before making
            important decisions.
          </p>
        </section>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 hover:border-purple-500/40 hover:bg-white/[0.04] transition"
            >
              <p className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3">
                {guide.category} • {guide.readTime}
              </p>

              <h2 className="text-xl font-black text-white group-hover:text-purple-200 transition">
                {guide.title}
              </h2>

              <p className="mt-3 text-zinc-400 leading-7">
                {guide.description}
              </p>

              <p className="mt-5 text-sm font-semibold text-purple-400">
                Read guide →
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-2xl">
          <h2 className="text-3xl font-black text-white mb-5">
            Why these guides matter
          </h2>

          <div className="space-y-5 text-zinc-400 leading-8">
            <p>
              Pokémon card prices are affected by more than rarity alone.
              Condition, grading potential, set demand, artwork, recent sales,
              population reports, and collector interest all influence value.
            </p>

            <p>
              These guides are designed to help collectors make more informed
              decisions before buying cards, selling collections, storing
              valuable pulls, or submitting cards for grading.
            </p>

            <p>
              PokeValue combines educational content with card search, set
              browsing, collection tracking, favourites, portfolio tools, and
              market-style information to create a clearer Pokémon TCG research
              experience.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}