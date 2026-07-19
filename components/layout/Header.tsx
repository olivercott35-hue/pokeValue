"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShieldCheck, Sparkles } from "lucide-react";

interface HeaderProps {
  setMobileOpen: (value: boolean) => void;
}

const routeNames: Array<[string, string]> = [
  ["/cards", "Card archive"],
  ["/sets", "Set archive"],
  ["/guides", "Collector guides"],
  ["/collection", "My collection"],
  ["/favorites", "Favourites"],
  ["/portfolio", "Portfolio"],
  ["/market-movers", "Market board"],
  ["/analytics", "Analytics"],
  ["/methodology", "Pricing methodology"],
  ["/editorial-policy", "Editorial policy"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
];

function getRouteName(pathname: string) {
  if (pathname === "/") return "Collector dashboard";
  return routeNames.find(([route]) => pathname === route || pathname.startsWith(`${route}/`))?.[1] || "PokeValue";
}

export default function Header({ setMobileOpen }: HeaderProps) {
  const pathname = usePathname();
  const routeName = getRouteName(pathname);

  return (
    <header className="relative z-30 flex h-[72px] shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#050507]/82 px-4 backdrop-blur-2xl sm:px-5 lg:px-7">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="pv-header-icon lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/" className="flex items-center gap-2 lg:hidden" aria-label="PokeValue home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200/15 bg-violet-300/[0.08] text-violet-100">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="font-black tracking-[-0.035em] text-white">PokeValue</span>
      </Link>

      <div className="hidden min-w-0 lg:block">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">
          PokeValue
        </p>
        <p className="truncate text-sm font-bold text-zinc-300">{routeName}</p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link
          href="/cards"
          className="hidden min-w-[260px] items-center gap-3 rounded-2xl border border-white/[0.075] bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition hover:border-white/[0.13] hover:bg-white/[0.045] hover:text-zinc-300 md:flex"
        >
          <Search className="h-4 w-4" />
          <span>Search the card archive</span>
          <span className="ml-auto rounded-lg border border-white/[0.06] bg-black/20 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-700">
            20k+
          </span>
        </Link>

        <Link
          href="/methodology"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.075] bg-white/[0.03] px-3 py-2.5 text-xs font-black text-zinc-500 transition hover:border-white/[0.13] hover:bg-white/[0.05] hover:text-white sm:px-4"
        >
          <ShieldCheck className="h-4 w-4 text-violet-200/80" />
          <span className="hidden sm:inline">Source-labelled prices</span>
        </Link>
      </div>
    </header>
  );
}
