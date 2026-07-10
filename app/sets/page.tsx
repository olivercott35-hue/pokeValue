import type { Metadata } from "next";
import SetsClient from "./SetsClient";
import {
  getAllPokemonSets,
  getPokemonSetCardCount,
  getPokemonSetReleaseYear,
  type PokemonSet,
} from "@/lib/pokemon-data";

export const metadata: Metadata = {
  title: "Pokémon Set Explorer | PokeValue",
  description:
    "Browse Pokémon TCG sets with premium visuals, release dates, card totals and fast local-cache set discovery on PokeValue.",
  alternates: {
    canonical: "https://pokevalue.co.uk/sets",
  },
  openGraph: {
    title: "Pokémon Set Explorer | PokeValue",
    description:
      "Explore Pokémon TCG sets, eras, release years and card totals with the premium PokeValue set archive.",
    url: "https://pokevalue.co.uk/sets",
    siteName: "PokeValue",
    type: "website",
  },
};

type EnrichedSet = PokemonSet & {
  pokeValueCardCount: number;
  pokeValueReleaseYear: string;
  pokeValueReleaseTime: number;
};

function getReleaseTime(set: PokemonSet) {
  const time = new Date(set.releaseDate || "1900-01-01").getTime();

  return Number.isNaN(time) ? 0 : time;
}

function enrichSet(set: PokemonSet): EnrichedSet {
  const cardCount = Number(getPokemonSetCardCount(set) || set.total || 0);
  const releaseYear = getPokemonSetReleaseYear(set);
  const releaseTime = getReleaseTime(set);

  return {
    ...set,
    pokeValueCardCount: Number.isFinite(cardCount) ? cardCount : 0,
    pokeValueReleaseYear: releaseYear || "—",
    pokeValueReleaseTime: Number.isFinite(releaseTime) ? releaseTime : 0,
  };
}

export default async function SetsPage() {
  const rawSets = await getAllPokemonSets();
  const sets = Array.isArray(rawSets) ? rawSets : [];

  const initialSets = sets
    .map(enrichSet)
    .sort((a, b) => {
      const releaseDiff = b.pokeValueReleaseTime - a.pokeValueReleaseTime;

      if (releaseDiff !== 0) return releaseDiff;

      return String(a.name || "").localeCompare(String(b.name || ""));
    });

  const series = Array.from(
    new Set(
      initialSets
        .map((set) => set.series)
        .filter((item): item is string => Boolean(item))
    )
  ).sort((a, b) => a.localeCompare(b));

  return <SetsClient initialSets={initialSets} series={series} />;
}