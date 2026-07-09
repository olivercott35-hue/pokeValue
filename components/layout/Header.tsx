"use client";

import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  setMobileOpen: (value: boolean) => void;
}

export default function Header({ setMobileOpen }: HeaderProps) {
  return (
    <header className="h-16 border-b border-zinc-800 bg-[#030305] flex items-center justify-between px-6">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-bold text-lg">PokeValue</h1>

      <button className="text-zinc-400 hover:text-white transition">
        <Bell className="w-5 h-5" />
      </button>
    </header>
  );
}