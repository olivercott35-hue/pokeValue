import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpenCheck,
  FileSearch,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Editorial and Corrections Policy",
  description:
    "Read PokeValue's standards for Pokémon TCG guides, news, sourcing, corrections, dates and clearly labelled market information.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk/editorial-policy",
  },
};

const standards = [
  {
    icon: FileSearch,
    title: "Source important claims",
    text: "News and time-sensitive statements should be checked against primary sources such as official Pokémon announcements, tournament documentation or the marketplace data identified on the page.",
  },
  {
    icon: BadgeCheck,
    title: "Separate fact from interpretation",
    text: "Confirmed information, marketplace estimates, collecting opinion and speculation should be labelled clearly. Headlines should not present an expected or rumoured release as confirmed.",
  },
  {
    icon: RefreshCw,
    title: "Show meaningful dates",
    text: "Articles should display a publication date and a modified date when material facts change. Pricing pages should show the source update date whenever it is available.",
  },
  {
    icon: BookOpenCheck,
    title: "Write for collectors",
    text: "Guides should answer a real collector question with practical examples, limitations and UK-relevant context rather than repeating generic search phrases.",
  },
  {
    icon: ShieldCheck,
    title: "Correct errors transparently",
    text: "Material errors should be corrected promptly. A correction should update the affected page and, where useful, explain what changed rather than silently preserving inaccurate information.",
  },
];

export default function EditorialPolicyPage() {
  return (
    <AppLayout>
      <main className="relative mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <header className="relative border-b border-white/[0.06] pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-purple-300">
            <ShieldCheck size={14} />
            Trust and accuracy
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Editorial and corrections policy
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400">
            PokeValue aims to publish useful, clearly labelled Pokémon TCG
            research. These standards apply to guides, news, card pages and
            market explanations.
          </p>

          <p className="mt-4 text-sm text-zinc-600">
            Policy last reviewed: 18 July 2026
          </p>
        </header>

        <div className="relative mt-8 grid gap-5 md:grid-cols-2">
          {standards.map(({ icon: Icon, title, text }) => (
            <section
              key={title}
              className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                <Icon size={19} />
              </span>
              <h2 className="mt-5 text-xl font-black text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
            </section>
          ))}
        </div>

        <section className="relative mt-8 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-2xl font-black text-white">Corrections process</h2>
          <ol className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
            <li>1. Identify the exact page, card or statement.</li>
            <li>2. Compare it with the original data or authoritative source.</li>
            <li>3. Correct the page and its metadata where necessary.</li>
            <li>4. Recheck related pages that may use the same data.</li>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-500"
            >
              <Mail size={15} />
              Report an error
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-black text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              Pricing methodology
            </Link>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
