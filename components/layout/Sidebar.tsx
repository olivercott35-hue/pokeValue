"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Sparkles,
  FolderHeart,
  Heart,
  Briefcase,
  TrendingUp,
  LineChart,
  Info,
  Mail,
  ShieldCheck,
  BookOpen,
  Newspaper,
  House,
  PoundSterling,
} from "lucide-react";
import { CurrencyCode, useCurrency } from "@/components/CurrencyProvider";

const navItems = [
  { label: "Home", href: "/", icon: House },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Set Explorer", href: "/sets", icon: Boxes },
  { label: "Card Explorer", href: "/cards", icon: Sparkles },
  { label: "Guides", href: "/guides", icon: BookOpen },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Collection", href: "/collection", icon: FolderHeart },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Market Movers", href: "/market-movers", icon: TrendingUp },
  { label: "Analytics", href: "/analytics", icon: LineChart },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
  { label: "Terms of Service", href: "/terms", icon: ShieldCheck },
];

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:relative top-0 left-0 z-50 w-64 h-screen bg-[#030307]
          border-r border-white/[0.03] flex flex-col transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-purple-500/0 via-purple-500/40 to-fuchsia-500/0 shadow-[0_0_15px_2px_rgba(168,85,247,0.35)] pointer-events-none z-50" />

        <div className="p-6 border-b border-white/[0.04] relative shrink-0">
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
            PokeValue
          </h1>
          <p className="text-[10px] uppercase font-black tracking-[0.25em] text-purple-400/50 mt-1.5 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
            TCG Intelligence Index
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto sidebar-nav-scroller">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide relative overflow-hidden transition-all duration-300 ${
                  active
                    ? "text-white bg-gradient-to-r from-purple-900/40 to-purple-600/10 border border-purple-500/30"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className="w-4 h-4 text-purple-400/70" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.04] shrink-0 bg-[#020205] space-y-3">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <PoundSterling size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.22em]">
                Currency
              </span>
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-full rounded-xl border border-white/[0.06] bg-[#08080d] px-3 py-2 text-xs font-black text-zinc-200 outline-none focus:border-purple-500/50"
            >
              <option value="GBP">GBP £</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  );
}