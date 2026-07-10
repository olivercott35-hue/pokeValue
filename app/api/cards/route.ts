import { NextRequest, NextResponse } from "next/server";
import {
  getAllPokemonCards,
  getPokemonCardMarketPriceGBP,
  getPokemonCardMarketPriceUSD,
  getPokemonResolvedMarketPrice,
  getPokemonResolvedTrend,
  type PokemonCard,
} from "@/lib/pokemon-data";

type SortOption = "value-desc" | "value-asc" | "released" | "number";

const DEFAULT_PAGE_SIZE = 48;
const MAX_PAGE_SIZE = 96;

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getReleaseTime(card: PokemonCard) {
  const time = new Date(card?.set?.releaseDate || "1900-01-01").getTime();

  return Number.isNaN(time) ? 0 : time;
}

function getCardNumberValue(number?: string) {
  if (!number) return Number.MAX_SAFE_INTEGER;

  const match = number.match(/\d+/);

  if (!match) return Number.MAX_SAFE_INTEGER;

  return Number(match[0]);
}

function compareNames(a: PokemonCard, b: PokemonCard) {
  return String(a?.name || "").localeCompare(String(b?.name || ""));
}

function matchesCard(card: PokemonCard, query: string) {
  if (!query) return true;

  const searchable = normalizeSearch(
    [
      card.id,
      card.name,
      card.number,
      card.rarity,
      card.supertype,
      card.set?.id,
      card.set?.name,
      card.set?.series,
      ...(card.types || []),
      ...(card.subtypes || []),
    ]
      .filter(Boolean)
      .join(" ")
  );

  const terms = query.split(/\s+/).filter(Boolean);

  return terms.every((term) => searchable.includes(term));
}

function sortCards(cards: PokemonCard[], sortBy: SortOption) {
  const sorted = [...cards];

  sorted.sort((a, b) => {
    const priceA = getPokemonCardMarketPriceUSD(a);
    const priceB = getPokemonCardMarketPriceUSD(b);

    if (sortBy === "value-desc") {
      if (priceA <= 0 && priceB > 0) return 1;
      if (priceB <= 0 && priceA > 0) return -1;

      const priceDiff = priceB - priceA;
      if (priceDiff !== 0) return priceDiff;

      const releaseDiff = getReleaseTime(b) - getReleaseTime(a);
      if (releaseDiff !== 0) return releaseDiff;

      return compareNames(a, b);
    }

    if (sortBy === "value-asc") {
      if (priceA <= 0 && priceB > 0) return 1;
      if (priceB <= 0 && priceA > 0) return -1;

      const priceDiff = priceA - priceB;
      if (priceDiff !== 0) return priceDiff;

      const releaseDiff = getReleaseTime(b) - getReleaseTime(a);
      if (releaseDiff !== 0) return releaseDiff;

      return compareNames(a, b);
    }

    if (sortBy === "released") {
      const releaseDiff = getReleaseTime(b) - getReleaseTime(a);
      if (releaseDiff !== 0) return releaseDiff;

      return compareNames(a, b);
    }

    if (sortBy === "number") {
      const setCompare = String(a.set?.name || "").localeCompare(
        String(b.set?.name || "")
      );

      if (setCompare !== 0) return setCompare;

      const numberDiff =
        getCardNumberValue(a.number) - getCardNumberValue(b.number);

      if (numberDiff !== 0) return numberDiff;

      return compareNames(a, b);
    }

    return compareNames(a, b);
  });

  return sorted;
}

function getSortOption(value: string | null): SortOption {
  if (
    value === "value-desc" ||
    value === "value-asc" ||
    value === "released" ||
    value === "number"
  ) {
    return value;
  }

  return "value-desc";
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
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Math.max(Number(searchParams.get("page") || "1"), 1);
  const pageSize = Math.min(
    Math.max(Number(searchParams.get("pageSize") || DEFAULT_PAGE_SIZE), 1),
    MAX_PAGE_SIZE
  );
  const sort = getSortOption(searchParams.get("sort"));
  const query = normalizeSearch(searchParams.get("q") || "");

  const allCards = await getAllPokemonCards();

  const filteredCards = allCards.filter((card) => matchesCard(card, query));
  const sortedCards = sortCards(filteredCards, sort);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageCards = sortedCards.slice(start, end).map(enrichCard);

  return NextResponse.json({
    data: pageCards,
    page,
    pageSize,
    total: sortedCards.length,
    hasMore: end < sortedCards.length,
  });
}