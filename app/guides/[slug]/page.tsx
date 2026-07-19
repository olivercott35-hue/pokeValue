import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, ShieldCheck } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import {
  GlassPanel,
  PageHero,
  PageShell,
  PrimaryLink,
  SecondaryLink,
} from "@/components/ui/SitePage";
import { getGuide, guides } from "@/lib/guides";

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide Not Found | PokeValue" };

  const canonical = `https://www.pokevalue.co.uk/guides/${guide.slug}`;
  return {
    title: `${guide.title} | PokeValue`,
    description: guide.description,
    alternates: { canonical },
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

  const relatedGuides = guides.filter((item) => item.slug !== guide.slug).slice(0, 3);
  const canonical = `https://www.pokevalue.co.uk/guides/${guide.slug}`;
  const date = "2026-07-18";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: date,
    dateModified: date,
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pokevalue.co.uk" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://www.pokevalue.co.uk/guides" },
      { "@type": "ListItem", position: 3, name: guide.title, item: canonical },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <AppLayout>
        <PageShell width="article">
          <Link
            href="/guides"
            className="mb-5 inline-flex items-center gap-2 text-sm font-black text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to guides
          </Link>

          <PageHero
            compact
            eyebrow={guide.category}
            icon={<BookOpen className="h-4 w-4" />}
            title={guide.title}
            description={<p>{guide.description}</p>}
            actions={
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" /> {guide.readTime}
                </span>
                <span>Updated {guide.updated}</span>
                <span>
                  Reviewed by{" "}
                  <Link href="/editorial-policy" className="text-zinc-300 hover:text-white">
                    PokeValue Editorial Team
                  </Link>
                </span>
              </div>
            }
          />

          <article className="mt-7 space-y-5">
            {guide.sections.map((section, index) => (
              <GlassPanel key={section.heading} as="section" className="scroll-mt-24">
                <div className="grid gap-5 sm:grid-cols-[54px_1fr]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-200/[0.12] bg-violet-300/[0.045] text-xs font-black text-violet-200/80">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black leading-tight tracking-[-0.035em] text-white sm:text-3xl">
                      {section.heading}
                    </h2>
                    <div className="mt-5 space-y-5 text-[15px] leading-8 text-zinc-400">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </article>

          <GlassPanel className="mt-7 border-violet-200/[0.12] bg-violet-300/[0.03]">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex items-center gap-2 text-violet-200/80">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.22em]">Put the process into practice</p>
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                  Verify the exact card and marketplace source.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  Search the archive by set and collector number, then read the
                  pricing methodology before relying on any estimate.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <PrimaryLink href="/cards" arrow>Search cards</PrimaryLink>
                <SecondaryLink href="/methodology">Methodology</SecondaryLink>
              </div>
            </div>
          </GlassPanel>

          <section className="mt-9">
            <p className="pv-section-kicker">Continue learning</p>
            <h2 className="pv-section-title">Related collector guides</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedGuides.map((related) => (
                <Link
                  key={related.slug}
                  href={`/guides/${related.slug}`}
                  className="group rounded-[1.5rem] border border-white/[0.07] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-violet-200/[0.17] hover:bg-white/[0.045]"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200/70">
                    {related.category}
                  </p>
                  <h3 className="mt-3 text-base font-black leading-snug text-white">
                    {related.title}
                  </h3>
                  <p className="mt-4 inline-flex items-center gap-2 text-xs font-black text-zinc-500 group-hover:text-violet-200">
                    Read next <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </PageShell>
      </AppLayout>
    </>
  );
}
