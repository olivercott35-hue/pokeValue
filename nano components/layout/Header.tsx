"use client";

import { Menu } from "lucide-react";

export default function Header({
  setMobileOpen,
}: {
  setMobileOpen: (value: boolean) => void;
}) {
  return (
    <header className="h-16 border-b border-zinc-800 flex items-center px-6">
      <button onClick={() => setMobileOpen(true)} className="lg:hidden">
        {" "}
        <Menu className="w-6 h-6" />{" "}
      </button>
      ```
      <h1 className="ml-4 font-bold">PokeValue</h1>
    </header>
  );
}