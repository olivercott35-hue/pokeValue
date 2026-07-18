"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#030305] text-white">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex h-screen w-full overflow-hidden">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <Header setMobileOpen={setMobileOpen} />

          <main className="min-h-0 flex-1 overflow-hidden p-4 sm:p-5 md:p-6">
            <div className="h-full overflow-y-auto rounded-[2rem] border border-white/[0.05] bg-[#050509]/60 backdrop-blur-2xl app-content-scroll">
              {children}

              <footer className="mt-20 border-t border-white/[0.06] bg-[#040408]/80">
                <div className="mx-auto max-w-7xl px-6 py-12">
                  <div className="grid gap-10 md:grid-cols-4">
                    <div>
                      <h3 className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-2xl font-black text-transparent">
                        PokeValue
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-zinc-500">
                        Pokémon TCG price tracking, collection management, card
                        research and market insights built for collectors.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-4 font-black">Explore</h4>

                      <div className="space-y-3 text-sm text-zinc-500">
                        <Link href="/cards" className="block hover:text-white">
                          Card Explorer
                        </Link>
                        <Link href="/sets" className="block hover:text-white">
                          Set Explorer
                        </Link>
                        <Link href="/guides" className="block hover:text-white">
                          Guides
                        </Link>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-4 font-black">Company</h4>

                      <div className="space-y-3 text-sm text-zinc-500">
                        <Link href="/about" className="block hover:text-white">
                          About
                        </Link>
                        <Link href="/contact" className="block hover:text-white">
                          Contact
                        </Link>
                        <Link href="/methodology" className="block hover:text-white">
                          Pricing Methodology
                        </Link>
                        <Link href="/editorial-policy" className="block hover:text-white">
                          Editorial Policy
                        </Link>
                        <Link href="/privacy" className="block hover:text-white">
                          Privacy Policy
                        </Link>
                        <Link href="/terms" className="block hover:text-white">
                          Terms of Service
                        </Link>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-4 font-black">Disclaimer</h4>

                      <p className="text-sm leading-7 text-zinc-500">
                        Pokémon card prices shown throughout PokeValue are
                        estimates based on available market data and should not
                        be considered financial advice or guaranteed sale prices.
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.05] pt-6 text-xs leading-6 text-zinc-600 md:flex-row md:justify-between">
                    <p>© {new Date().getFullYear()} PokeValue. All rights reserved.</p>

                    <p className="max-w-3xl">
                      Pokémon and Pokémon TCG are trademarks of Nintendo, Game
                      Freak and Creatures Inc. PokeValue is an independent
                      fan-made platform and is not affiliated with or endorsed by
                      The Pokémon Company.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        .app-content-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .app-content-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .app-content-scroll::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.22);
          border-radius: 999px;
        }

        .app-content-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.45);
        }
      `}</style>
    </div>
  );
}