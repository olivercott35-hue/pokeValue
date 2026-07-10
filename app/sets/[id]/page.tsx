import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SetClient from "./SetClient";
import {
  getAllPokemonSets,
  getPokemonCardsBySetId,
  getPokemonCardMarketPriceGBP,
  getPokemonResolvedMarketPrice,
  getPokemonResolvedTrend,
  getPokemonSetById,
  getPokemonSetCardCount,
  getPokemonSetReleaseYear,
  type PokemonCard,
} from "@/lib/pokemon-data";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getReleaseTime(value?: string) {
  const time = new Date(value || "1900-01-01").getTime();

  return Number.isNaN(time) ? 0 : time;
}

function getCardNumberValue(number?: string) {
  if (!number) return Number.MAX_SAFE_INTEGER;

  const match = number.match(/\d+/);

  if (!match) return Number.MAX_SAFE_INTEGER;

  return Number(match[0]);
}

function enrichCard(card: PokemonCard) {
  const resolvedPrice = getPokemonResolvedMarketPrice(card);
  const resolvedTrend = getPokemonResolvedTrend(card);

  return {
    ...card,
    pokeValueMarketPriceUSD: resolvedPrice.usd,
    pokeValuePriceGBP: getPokemonCardMarketPriceGBP(card),
    pokeValuePriceSource: resolvedPrice.label,
    pokeValuePriceKey: resolvedPrice.key,
    pokeValueTrendDirection: resolvedTrend.direction,
    pokeValueTrendPercent: resolvedTrend.changePercent,
    pokeValueTrendLabel: resolvedTrend.label,
    pokeValueCardNumberSort: getCardNumberValue(card.number),
  };
}

export async function generateStaticParams() {
  const sets = await getAllPokemonSets();

  return sets.map((set) => ({
    id: set.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const set = await getPokemonSetById(id);

  if (!set) {
    return {
      title: "Set Not Found | PokeValue",
    };
  }

  const title = `${set.name} Pokémon Cards & Prices | PokeValue`;
  const description = `Explore ${set.name} Pokémon cards, release information, collector numbers and market prices in the PokeValue set archive.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://pokevalue.co.uk/sets/${set.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://pokevalue.co.uk/sets/${set.id}`,
      siteName: "PokeValue",
      type: "website",
      images: set.images?.logo
        ? [
            {
              url: set.images.logo,
              alt: `${set.name} logo`,
            },
          ]
        : undefined,
    },
  };
}

export default async function SetPage({ params }: PageProps) {
  const { id } = await params;

  const set = await getPokemonSetById(id);

  if (!set) {
    notFound();
  }

  const cards = await getPokemonCardsBySetId(id);

  const enrichedSet = {
    ...set,
    pokeValueCardCount: getPokemonSetCardCount(set),
    pokeValueReleaseYear: getPokemonSetReleaseYear(set) || "—",
    pokeValueReleaseTime: getReleaseTime(set.releaseDate),
  };

  const enrichedCards = cards
    .map(enrichCard)
    .sort((a, b) => {
      const numberDiff =
        Number(a.pokeValueCardNumberSort || 0) -
        Number(b.pokeValueCardNumberSort || 0);

      if (numberDiff !== 0) return numberDiff;

      return String(a.name || "").localeCompare(String(b.name || ""));
    });

  const pricedCards = enrichedCards.filter(
    (card) => Number(card.pokeValuePriceGBP || 0) > 0
  );

  const highestCard =
    pricedCards
      .slice()
      .sort(
        (a, b) =>
          Number(b.pokeValuePriceGBP || 0) - Number(a.pokeValuePriceGBP || 0)
      )[0] || null;

  const totalMarketValue = pricedCards.reduce(
    (total, card) => total + Number(card.pokeValuePriceGBP || 0),
    0
  );

  return (
    <SetClient
      set={enrichedSet}
      cards={enrichedCards}
      highestCard={highestCard}
      totalMarketValue={totalMarketValue}
    />
  );
}