import Link from "next/link";
import { notFound } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { getNewsArticle, newsArticles } from "@/lib/news";

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) {
    return {
      title: "News Article Not Found | PokeValue",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const canonical = `https://www.pokevalue.co.uk/news/${article.slug}`;

  return {
    title: `${article.title} | PokeValue News`,
    description: article.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonical,
      siteName: "PokeValue",
      type: "article",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) notFound();

  const relatedArticles = newsArticles
    .filter(
      (item) => item.slug !== article.slug && item.category === article.category
    )
    .slice(0, 3);

  const canonical = `https://www.pokevalue.co.uk/news/${article.slug}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.pokevalue.co.uk",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: "https://www.pokevalue.co.uk/news",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AppLayout>
      <article className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/news"
          className="text-sm font-black text-purple-400 hover:text-purple-300 transition"
        >
          ← Back to news
        </Link>

        <header className="mt-8 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl">
          <p className="text-xs font-black uppercase tracking-wider text-purple-400 mb-4">
            {article.category} • {article.readTime} • {article.date}
          </p>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            {article.title}
          </h1>

          <p className="mt-6 text-lg text-zinc-400 leading-8">
            {article.description}
          </p>

          <p className="mt-6 text-sm text-zinc-600">By {article.author}</p>
        </header>

        <div className="mt-8 rounded-3xl border border-white/[0.06] bg-zinc-950/50 p-8 md:p-10">
          <div className="space-y-10 text-zinc-300 leading-8">
            {article.sections.map((section, index) => (
              <section key={section.heading}>
                <p className="text-xs font-black text-purple-400 mb-3">
                  0{index + 1}
                </p>

                <h2 className="text-2xl md:text-3xl font-black text-white mb-5">
                  {section.heading}
                </h2>

                <div className="space-y-4 text-zinc-400">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-purple-500/20 bg-purple-500/5 p-8">
          <h2 className="text-2xl font-black text-white mb-3">
            Research the Pokémon TCG market
          </h2>

          <p className="text-zinc-400 leading-7 mb-5">
            Use PokeValue to browse cards, explore sets, read collecting guides,
            and track estimated collection value.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/cards"
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-500 transition"
            >
              Browse Cards
            </Link>

            <Link
              href="/sets"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-200 hover:bg-white/5 transition"
            >
              Explore Sets
            </Link>

            <Link
              href="/guides"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-200 hover:bg-white/5 transition"
            >
              Read Guides
            </Link>
          </div>
        </section>

        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <p className="text-sm font-semibold text-purple-400 mb-2">
              Related News
            </p>

            <h2 className="text-3xl font-black text-white mb-6">
              More Pokémon TCG updates
            </h2>

            <div className="grid md:grid-cols-3 gap-5">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/news/${related.slug}`}
                  className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 hover:border-purple-500/40 transition"
                >
                  <p className="text-[11px] font-black uppercase tracking-wider text-purple-400 mb-3">
                    {related.category} • {related.readTime}
                  </p>

                  <h3 className="text-base font-black text-white leading-snug">
                    {related.title}
                  </h3>

                  <p className="mt-3 text-sm text-zinc-400 leading-6">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
      </AppLayout>
    </>
  );
}