"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookCheck,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Heart,
  Home,
  Info,
  Mail,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  WalletCards,
  X,
} from "lucide-react";

type SidebarProps = {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: typeof Home;
};

const primaryItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Card Explorer", href: "/cards", icon: Search },
  { label: "Set Explorer", href: "/sets", icon: Boxes },
  { label: "Collector Guides", href: "/guides", icon: BookOpen },
];

const toolItems: NavItem[] = [
  { label: "Collection", href: "/collection", icon: WalletCards },
  { label: "Favourites", href: "/favorites", icon: Heart },
  { label: "Portfolio", href: "/portfolio", icon: BriefcaseBusiness },
  { label: "Market Board", href: "/market-movers", icon: Trophy },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const companyItems: NavItem[] = [
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

const trustItems: NavItem[] = [
  { label: "Pricing Method", href: "/methodology", icon: Scale },
  { label: "Editorial Policy", href: "/editorial-policy", icon: BookCheck },
  { label: "Privacy", href: "/privacy", icon: ShieldCheck },
  { label: "Terms", href: "/terms", icon: ShieldCheck },
];

function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen?.(false)}
        aria-label="Close navigation menu"
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[286px] flex-col border-r border-white/[0.06] bg-[#050507]/96 shadow-[32px_0_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-dvh lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-28 -top-16 h-80 w-80 rounded-full bg-violet-500/[0.1] blur-3xl" />
          <div className="absolute -bottom-24 -right-40 h-80 w-80 rounded-full bg-blue-500/[0.05] blur-3xl" />
        </div>

        <div className="relative flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
          <Link
            href="/"
            onClick={() => setMobileOpen?.(false)}
            className="flex items-center gap-3"
            aria-label="PokeValue home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/20 bg-violet-300/[0.09] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-black tracking-[-0.045em] text-white">
                PokeValue
              </span>
              <span className="block text-[9px] font-black uppercase tracking-[0.24em] text-zinc-600">
                Collector archive
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen?.(false)}
            className="pv-header-icon lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          <NavGroup items={primaryItems} pathname={pathname} onNavigate={() => setMobileOpen?.(false)} />
          <NavGroup label="Collector tools" items={toolItems} pathname={pathname} onNavigate={() => setMobileOpen?.(false)} />
          <NavGroup label="PokeValue" items={companyItems} pathname={pathname} onNavigate={() => setMobileOpen?.(false)} />
          <NavGroup label="Trust & policies" items={trustItems} pathname={pathname} onNavigate={() => setMobileOpen?.(false)} compact />
        </nav>

        <div className="relative shrink-0 border-t border-white/[0.06] p-4">
          <Link
            href="/methodology"
            onClick={() => setMobileOpen?.(false)}
            className="block rounded-2xl border border-violet-200/[0.1] bg-violet-300/[0.035] p-4 transition hover:border-violet-200/[0.18] hover:bg-violet-300/[0.055]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-200/80">
              Transparent estimates
            </p>
            <p className="mt-2 text-xs leading-5 text-zinc-600">
              Every displayed value identifies its marketplace source and pricing rule.
            </p>
          </Link>
        </div>
      </aside>
    </>
  );
}

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
  compact = false,
}: {
  label?: string;
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
  compact?: boolean;
}) {
  return (
    <div className={label ? "mt-5 border-t border-white/[0.055] pt-4" : ""}>
      {label ? (
        <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.23em] text-zinc-700">
          {label}
        </p>
      ) : null}
      <div className="space-y-1">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 ${
                compact ? "py-2.5" : "py-3"
              } text-sm font-bold transition ${
                active
                  ? "bg-white/[0.075] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.065)]"
                  : "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-200"
              }`}
            >
              {active ? (
                <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-violet-300 to-fuchsia-400" />
              ) : null}
              <span
                className={`flex ${compact ? "h-8 w-8" : "h-9 w-9"} shrink-0 items-center justify-center rounded-xl border transition ${
                  active
                    ? "border-violet-200/20 bg-violet-300/[0.1] text-violet-100"
                    : "border-white/[0.055] bg-white/[0.025] text-zinc-700 group-hover:text-zinc-400"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
