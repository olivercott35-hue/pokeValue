"use client";

import { useState } from "react";
import Link from "next/link";

export default function GlobalSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const searchCards = async (query: string) => {
    setSearch(query);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${query}*&pageSize=8`
    );

    const data = await res.json();

    setResults(data.data || []);
  };

  return (
    <div className="relative w-full">
      <input
        value={search}
        onChange={(e) => searchCards(e.target.value)}
        placeholder="Search cards..."
        className="
          w-full
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          px-5
          py-4
          text-white
          outline-none
          focus:border-purple-500
        "
      />

      {results.length > 0 && (
        <div
          className="
            absolute
            top-full
            mt-2
            w-full
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            overflow-hidden
            z-50
            shadow-2xl
          "
        >
          {results.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="
                flex
                items-center
                gap-3
                p-3
                hover:bg-zinc-800
                transition
              "
            >
              <img
                src={card.images.small}
                alt={card.name}
                className="w-12 rounded"
              />

              <div>
                <p className="font-medium">{card.name}</p>

                <p className="text-xs text-zinc-500">{card.set?.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}