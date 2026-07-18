import Link from "next/link";
import { notFound } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { getGuide, guides } from "@/lib/guides";

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    return {
      title: "Guide Not Found | PokeValue",
    };
  }

  const canonical = `https://www.pokevalue.co.uk/guides/${guide.slug}`;

  return {
    title: `${guide.title} | PokeValue`,
    description: guide.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: canonical,
      siteName: "PokeValue",
      type: "article",
    },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) notFound();

  const relatedGuides = guides
    .filter((item) => item.slug !== guide.slug && item.category === guide.category)
    .slice(0, 3);

  const canonical = `https://www.pokevalue.co.uk/guides/${guide.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: "2026-07-18",
    dateModified: "2026-07-18",
    author: {
      "@type": "Organization",
      name: "PokeValue Editorial Team",
      url: "https://www.pokevalue.co.uk/editorial-policy",
    },
    publisher: {
      "@type": "Organization",
      name: "PokeValue",
      url: "https://www.pokevalue.co.uk",
    },
    mainEntityOfPage: canonical,
  };

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
        name: "Guides",
        item: "https://www.pokevalue.co.uk/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AppLayout>
      <article className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/guides"
          className="text-sm font-black text-purple-400 hover:text-purple-300 transition"
        >
          ← Back to all guides
        </Link>

        <header className="mt-8 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 md:p-10 backdrop-blur-2xl">
          <p className="text-xs font-black uppercase tracking-wider text-purple-400 mb-4">
            {guide.category} • {guide.readTime} • Updated {guide.updated}
          </p>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            {guide.title}
          </h1>

          <p className="mt-6 text-lg text-zinc-400 leading-8">
            {guide.description}
          </p>

          <p className="mt-5 text-sm text-zinc-500">
            Written and reviewed by{" "}
            <Link
              href="/editorial-policy"
              className="font-bold text-zinc-300 hover:text-white"
            >
              PokeValue Editorial Team
            </Link>
          </p>
        </header>

        <div className="mt-8 rounded-3xl border border-white/[0.06] bg-zinc-950/50 p-8 md:p-10">
          <div className="space-y-10 text-zinc-300 leading-8">
            {guide.sections.map((section, index) => (
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
            Research cards on PokeValue
          </h2>

          <p className="text-zinc-400 leading-7 mb-5">
            After reading this guide, use PokeValue to browse Pokémon cards,
            explore sets, compare rarities, check estimated values, and track
            your collection.
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
              href="/portfolio"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-zinc-200 hover:bg-white/5 transition"
            >
              View Portfolio
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <p className="text-sm font-semibold text-purple-400 mb-2">
            Related Guides
          </p>

          <h2 className="text-3xl font-black text-white mb-6">
            Continue learning
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {relatedGuides.map((related) => (
              <Link
                key={related.slug}
                href={`/guides/${related.slug}`}
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
      </article>
      </AppLayout>
    </>
  );
}