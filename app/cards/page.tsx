import type { Metadata } from "next";
import CardsClient from "./CardsClient";

export const metadata: Metadata = {
  title: "Pokémon Card Explorer | PokeValue",
  description:
    "Browse Pokémon TCG cards with images, set information, rarity details and estimated market values.",
};

const PAGE_SIZE = 48;

async function getInitialCards() {
  try {
    const params = new URLSearchParams();

    params.set("pageSize", String(PAGE_SIZE));
    params.set("page", "1");
    params.set(
      "orderBy",
      "-cardmarket.prices.trendPrice,-cardmarket.prices.averageSellPrice,-tcgplayer.prices.holofoil.market"
    );

    const res = await fetch(`https://api.pokemontcg.io/v2/cards?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();

    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}

export default async function CardsPage() {
  const initialCards = await getInitialCards();

  return <CardsClient initialCards={initialCards} />;
}