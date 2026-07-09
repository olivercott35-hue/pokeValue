import Link from "next/link";
import { SearchX, Home, Boxes, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6">
      {/* Background */}
      <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[180px]" />

      <div className="relative w-full max-w-3xl rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-10 backdrop-blur-2xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10">
          <SearchX size={46} className="text-purple-400" />
        </div>

        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.35em] text-purple-400">
          ERROR 404
        </p>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-transparent">
          Lost in the Pokédex
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-zinc-400 leading-8">
          The page you're looking for doesn't exist, may have been moved, or the
          link you followed is no longer available.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-500/40 hover:bg-white/[0.05]"
          >
            <Home className="mx-auto mb-3 text-purple-400" size={24} />

            <h2 className="font-black text-white">Home</h2>

            <p className="mt-2 text-sm text-zinc-500">
              Return to the homepage.
            </p>
          </Link>

          <Link
            href="/cards"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-500/40 hover:bg-white/[0.05]"
          >
            <Sparkles className="mx-auto mb-3 text-purple-400" size={24} />

            <h2 className="font-black text-white">Browse Cards</h2>

            <p className="mt-2 text-sm text-zinc-500">
              Explore thousands of Pokémon cards.
            </p>
          </Link>

          <Link
            href="/sets"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-500/40 hover:bg-white/[0.05]"
          >
            <Boxes className="mx-auto mb-3 text-purple-400" size={24} />

            <h2 className="font-black text-white">Explore Sets</h2>

            <p className="mt-2 text-sm text-zinc-500">
              Browse every Pokémon expansion.
            </p>
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
          <p className="text-sm text-zinc-400">
            Looking for Pokémon card prices, collection tracking or market
            insights? Use the navigation to continue exploring PokeValue.
          </p>
        </div>
      </div>
    </main>
  );
}