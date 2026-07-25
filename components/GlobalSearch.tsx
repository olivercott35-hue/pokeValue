"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";

type SearchResult = {
  id: string;
  name: string;
  images?: { small?: string; large?: string };
  set?: { name?: string };
  pokeValuePriceGBP?: number;
  pokeValuePriceSource?: string;
};

/**
 * Queries PokeValue's own /api/cards endpoint (backed by the synced,
 * resolved-price dataset every other page uses) instead of calling the
 * public pokemontcg.io API directly from the browser. That keeps search
 * results, and the price shown next to them, consistent with the rest of
 * the site and doesn't depend on an unauthenticated third-party request
 * succeeding on every keystroke.
 */
export default function GlobalSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const runSearch = (query: string) => {
    abortRef.current?.abort();

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    fetch(`/api/cards?q=${encodeURIComponent(query)}&pageSize=8`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((json) => {
        setResults(Array.isArray(json?.data) ? json.data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setLoading(false);
      });
  };

  const handleChange = (value: string) => {
    setSearch(value);
    setOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 250);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.075] bg-white/[0.03] px-4 py-2.5 text-zinc-300 focus-within:border-violet-300/30">
        <Search className="h-4 w-4 shrink-0 text-zinc-600" />
        <input
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search the card archive..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-zinc-600" />}
      </div>

      {open && search.trim() && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0a0a0d] shadow-2xl">
          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-zinc-500">
              No cards matched &ldquo;{search}&rdquo;.
            </p>
          )}

          {results.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="flex items-center gap-3 p-3 transition hover:bg-white/[0.04]"
            >
              {card.images?.small && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.images.small}
                  alt={card.name}
                  className="w-10 rounded shrink-0"
                />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{card.name}</p>
                <p className="truncate text-xs text-zinc-500">{card.set?.name}</p>
              </div>

              {typeof card.pokeValuePriceGBP === "number" && card.pokeValuePriceGBP > 0 && (
                <span className="shrink-0 font-mono text-xs font-semibold text-emerald-500">
                  £{card.pokeValuePriceGBP.toFixed(2)}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
