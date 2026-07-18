import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Search, ShieldCheck } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Pokémon Card Wishlist | PokeValue",
  description:
    "A private wishlist workspace for Pokémon cards saved in your browser.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function WishlistPage() {
  return (
    <AppLayout>
      <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-6 py-12">
        <section className="w-full rounded-[2rem] border border-white/[0.07] bg-white/[0.03] p-8 text-center backdrop-blur-2xl md:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
            <Heart size={28} />
          </span>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-purple-300">
            Private browser tool
          </p>
          <h1 className="mt-3 text-4xl font-black text-white">
            Build your card wishlist
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Wishlist data is intended to stay personal to your browser. Until a
            dedicated wishlist manager is released, use Favourites to save cards
            you are researching and Collection for cards you already own.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/cards"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-500"
            >
              <Search size={16} />
              Browse cards
            </Link>
            <Link
              href="/favorites"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-black text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ShieldCheck size={16} />
              Open favourites
            </Link>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
