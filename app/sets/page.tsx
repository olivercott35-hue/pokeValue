import type { Metadata } from "next";
import SetsClient from "./SetsClient";

export const metadata: Metadata = {
  title: "Pokémon Set Explorer | PokeValue",
  description:
    "Browse Pokémon TCG sets, expansions, release dates, logos, symbols and card counts.",
};

async function getInitialSets() {
  try {
    const res = await fetch(
      "https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate",
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}

export default async function SetsDirectoryPage() {
  const initialSets = await getInitialSets();

  return <SetsClient initialSets={initialSets} />;
}