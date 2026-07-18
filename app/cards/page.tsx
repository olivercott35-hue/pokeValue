import type { Metadata } from "next";
import CardsClient from "./CardsClient";
import {
  getAllPokemonCards,
  getPokemonCardMarketPriceGBP,
  getPokemonCardMarketPriceUSD,
  getPokemonResolvedMarketPrice,
  getPokemonResolvedTrend,
  type PokemonCard,
} from "@/lib/pokemon-data";

export const metadata: Metadata = {
  title: "Pokémon Card Explorer | PokeValue",
  description:
    "Browse Pokémon TCG cards with images, set information, rarity details and clearly labelled Cardmarket or TCGplayer estimates from the PokeValue local database.",
  alternates: {
    canonical: "https://www.pokevalue.co.uk/cards",
  },
  openGraph: {
    title: "Pokémon Card Explorer | PokeValue",
    description:
      "Explore Pokémon cards, sets, rarities and clearly labelled marketplace estimates using the PokeValue card archive.",
    url: "https://www.pokevalue.co.uk/cards",
    siteName: "PokeValue",
    type: "website",
  },
};

const PAGE_SIZE = 48;

function getReleaseTime(card: PokemonCard) {
  const time = new Date(card?.set?.releaseDate || "1900-01-01").getTime();

  return Number.isNaN(time) ? 0 : time;
}

function compareNames(a: PokemonCard, b: PokemonCard) {
  return String(a?.name || "").localeCompare(String(b?.name || ""));
}

function enrichCard(card: PokemonCard) {
  const resolvedPrice = getPokemonResolvedMarketPrice(card);
  const resolvedTrend = getPokemonResolvedTrend(card);

  return {
    ...card,
    pokeValueMarketPriceUSD: getPokemonCardMarketPriceUSD(card),
    pokeValuePriceGBP: getPokemonCardMarketPriceGBP(card),
    pokeValuePriceSource: resolvedPrice.label,
    pokeValuePriceKey: resolvedPrice.key,
    pokeValueTrendDirection: resolvedTrend.direction,
    pokeValueTrendPercent: resolvedTrend.changePercent,
    pokeValueTrendLabel: resolvedTrend.label,
  };
}

function getInitialCards(cards: PokemonCard[]) {
  return [...cards]
    .sort((a, b) => {
      const priceA = getPokemonCardMarketPriceUSD(a);
      const priceB = getPokemonCardMarketPriceUSD(b);

      if (priceA <= 0 && priceB > 0) return 1;
      if (priceB <= 0 && priceA > 0) return -1;

      const priceDiff = priceB - priceA;
      if (priceDiff !== 0) return priceDiff;

      const releaseDiff = getReleaseTime(b) - getReleaseTime(a);
      if (releaseDiff !== 0) return releaseDiff;

      return compareNames(a, b);
    })
    .slice(0, PAGE_SIZE)
    .map(enrichCard);
}

export default async function CardsPage() {
  const cards = await getAllPokemonCards();
  const initialCards = getInitialCards(cards);

  return <CardsClient initialCards={initialCards} totalCards={cards.length} />;
}