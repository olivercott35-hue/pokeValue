"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Boxes,
  Briefcase,
  Heart,
  Home,
  Info,
  LineChart,
  Mail,
  Newspaper,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

type SidebarProps = {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
};

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Card Explorer",
    href: "/cards",
    icon: Search,
  },
  {
    label: "Set Explorer",
    href: "/sets",
    icon: Boxes,
  },
  {
    label: "Guides",
    href: "/guides",
    icon: BookOpen,
  },
  {
    label: "News",
    href: "/news",
    icon: Newspaper,
  },
  {
    label: "Collection",
    href: "/collection",
    icon: WalletCards,
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Sparkles,
  },
  {
    label: "Market Movers",
    href: "/market-movers",
    icon: TrendingUp,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
  },
];

const legalItems = [
  {
    label: "Privacy Policy",
    href: "/privacy",
    icon: ShieldCheck,
  },
  {
    label: "Terms",
    href: "/terms",
    icon: LineChart,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen?.(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col border-r border-white/[0.06] bg-[#030307]/96 shadow-[24px_0_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition-transform duration-300 lg:sticky lg:z-30 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-purple-500/12 blur-3xl" />
          <div className="absolute bottom-0 right-[-120px] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-200/40 to-transparent" />
        </div>

        <div className="relative flex h-20 items-center justify-between border-b border-white/[0.06] px-5">
          <Link
            href="/"
            onClick={() => setMobileOpen?.(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-200/20 bg-purple-300/[0.1] text-purple-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-black tracking-[-0.04em] text-white">
                PokeValue
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-600">
                TCG Market
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen?.(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-500 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen?.(false)}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-white/[0.075] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                      : "text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-200"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-purple-300 to-fuchsia-400" />
                  )}

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                      active
                        ? "border-purple-200/20 bg-purple-300/[0.1] text-purple-100"
                        : "border-white/[0.06] bg-white/[0.035] text-zinc-600 group-hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <div className="space-y-1">
            {legalItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen?.(false)}
                  className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-white/[0.075] text-white"
                      : "text-zinc-600 hover:bg-white/[0.045] hover:text-zinc-300"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                      active
                        ? "border-purple-200/20 bg-purple-300/[0.1] text-purple-100"
                        : "border-white/[0.06] bg-white/[0.03] text-zinc-700 group-hover:text-zinc-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="relative border-t border-white/[0.06] p-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-100">
              Market Archive
            </p>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Search cards, sets and collection tools from one clean homepage.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}