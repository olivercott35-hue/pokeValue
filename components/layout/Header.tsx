"use client";

import Link from "next/link";
import { Menu, Scale } from "lucide-react";

interface HeaderProps {
  setMobileOpen: (value: boolean) => void;
}

export default function Header({ setMobileOpen }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-[#030305] px-4 sm:px-6">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="rounded-xl bg-zinc-900 p-2 transition hover:bg-zinc-800 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/" className="text-lg font-bold text-white">
        PokeValue
      </Link>

      <Link
        href="/methodology"
        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-bold text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
      >
        <Scale className="h-4 w-4" />
        <span className="hidden sm:inline">Pricing method</span>
      </Link>
    </header>
  );
}
