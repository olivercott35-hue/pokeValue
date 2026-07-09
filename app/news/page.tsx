import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { newsArticles } from "@/lib/news";

export const metadata = {
  title: "Pokémon TCG News | PokeValue",
  description:
    "Read Pokémon TCG news, market updates, collecting trends, new set coverage, grading discussion, and card price insights.",
};

export default function NewsPage() {
  const featured = newsArticles[0];
  const latest = newsArticles.slice(1);
  const categories = Array.from(
    new Set(newsArticles.map((article) => article.category))
  );

  return (
    <AppLayout>
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <section className="mb-10 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl">
          <p className="text-sm font-semibold text-purple-400 mb-3">
            Pokémon TCG News
          </p>

          <h1 className="max-w-4xl text-4xl md:text-6xl font-black tracking-tight text-white">
            Market updates, collecting trends, and Pokémon card news
          </h1>

          <p className="mt-6 max-w-4xl text-zinc-400 leading-8">
            Follow Pokémon TCG releases, collector trends, market movement,
            grading discussion, sealed product updates, and card price insights
            from PokeValue.
          </p>
        </section>

        {featured && (
          <section className="mb-10 rounded-3xl border border-purple-500/20 bg-purple-500/5 p-8 md:p-10">
            <p className="text-xs font-black uppercase tracking-wider text-purple-400 mb-4">
              Featured Story • {featured.category} • {featured.readTime}
            </p>

            <h2 className="max-w-4xl text-3xl md:text-5xl font-black text-white leading-tight">
              {featured.title}
            </h2>

            <p className="mt-5 max-w-3xl text-zinc-400 leading-8">
              {featured.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span>{featured.date}</span>
              <span>By {featured.author}</span>
            </div>

            <Link
              href={`/news/${featured.slug}`}
              className="mt-8 inline-flex rounded-xl bg-purple-600 px-6 py-3 text-sm font-black text-white hover:bg-purple-500 transition"
            >
              Read featured story →
            </Link>
          </section>
        )}

        <section className="mb-10 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl">
          <p className="mb-4 text-sm font-semibold text-purple-400">
            News categories
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
            Latest Articles
          </p>

          <h2 className="text-3xl font-black text-white">
            Latest Pokémon TCG updates
          </h2>

          <p className="mt-3 max-w-3xl text-zinc-500 leading-7">
            These articles cover new releases, card market movement, collecting
            trends, grading topics, sealed products, and practical advice for
            Pokémon card collectors.
          </p>
        </section>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {latest.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="group rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 hover:border-purple-500/40 hover:bg-white/[0.04] transition"
            >
              <p className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3">
                {article.category} • {article.readTime}
              </p>

              <h2 className="text-xl font-black text-white group-hover:text-purple-200 transition">
                {article.title}
              </h2>

              <p className="mt-3 text-zinc-400 leading-7">
                {article.description}
              </p>

              <p className="mt-4 text-xs text-zinc-600">
                {article.date} • By {article.author}
              </p>

              <p className="mt-5 text-sm font-semibold text-purple-400">
                Read article →
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-2xl">
          <h2 className="text-3xl font-black text-white mb-5">
            Why PokeValue covers Pokémon TCG news
          </h2>

          <div className="space-y-5 text-zinc-400 leading-8">
            <p>
              Pokémon card values are affected by new releases, collector hype,
              product availability, grading trends, tournament interest,
              reprints, and sealed product demand.
            </p>

            <p>
              The PokeValue news section helps collectors follow those changes
              while connecting market updates with practical collecting advice.
            </p>

            <p>
              Use the news hub alongside PokeValue guides, card search, set
              browsing, portfolio tools, and collection tracking for a clearer
              view of the Pokémon TCG market.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}