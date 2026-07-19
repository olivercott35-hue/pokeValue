import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, ShieldCheck, Sparkles } from "lucide-react";

const explore = [
  ["Card Explorer", "/cards"],
  ["Set Explorer", "/sets"],
  ["Valuation Guides", "/guides"],
  ["My Collection", "/collection"],
] as const;

const trust = [
  ["Pricing Methodology", "/methodology"],
  ["Editorial Policy", "/editorial-policy"],
  ["Privacy Policy", "/privacy"],
  ["Terms of Service", "/terms"],
] as const;

const company = [
  ["About PokeValue", "/about"],
  ["Contact", "/contact"],
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050507]/80">
      <div className="mx-auto max-w-[1540px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/15 bg-violet-300/[0.08] text-violet-100">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-black tracking-[-0.04em] text-white">
                  PokeValue
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.23em] text-zinc-600">
                  UK Pokémon TCG archive
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-500">
              A collector-first research platform for exploring Pokémon cards,
              comparing clearly labelled marketplace estimates and organising a
              private collection in your browser.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-zinc-600">
              <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
                Independent
              </span>
              <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
                UK focused
              </span>
              <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
                Source labelled
              </span>
            </div>
          </div>

          <FooterColumn title="Explore" icon={<BookOpen className="h-4 w-4" />} links={explore} />
          <FooterColumn title="Trust" icon={<ShieldCheck className="h-4 w-4" />} links={trust} />
          <FooterColumn title="Company" links={company} />
        </div>

        <div className="mt-10 grid gap-4 border-t border-white/[0.055] pt-6 text-xs leading-6 text-zinc-600 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-10">
          <p>© {new Date().getFullYear()} PokeValue.</p>
          <p className="max-w-4xl lg:justify-self-end lg:text-right">
            Pokémon and Pokémon TCG are trademarks of Nintendo, Game Freak and
            Creatures Inc. PokeValue is an independent fan-made platform and is
            not affiliated with, sponsored by or endorsed by The Pokémon Company.
            Displayed prices are research estimates, not guaranteed sale prices
            or financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  icon,
}: {
  title: string;
  links: readonly (readonly [string, string])[];
  icon?: ReactNode;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-black text-zinc-200">
        {icon}
        {title}
      </h2>
      <div className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="block text-sm text-zinc-600 transition hover:text-white"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
