import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import {
  getResolvedCardPrice,
  getResolvedCardTrend,
} from "@/lib/card-pricing";

export type PokemonPriceShape = {
  low?: number;
  mid?: number;
  high?: number;
  market?: number;
  directLow?: number;
};

export type PokemonCard = {
  id: string;
  name: string;
  supertype?: string;
  subtypes?: string[];
  level?: string;
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  evolvesTo?: string[];
  rules?: string[];
  ancientTrait?: unknown;
  abilities?: unknown[];
  attacks?: unknown[];
  weaknesses?: unknown[];
  resistances?: unknown[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set?: PokemonSetSummary;
  number?: string;
  artist?: string;
  rarity?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities?: Record<string, string>;
  regulationMark?: string;
  images?: {
    small?: string;
    large?: string;
  };
  tcgplayer?: {
    url?: string;
    updatedAt?: string;
    prices?: Record<string, PokemonPriceShape>;
  };
  cardmarket?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
      germanProLow?: number;
      suggestedPrice?: number;
      reverseHoloSell?: number;
      reverseHoloLow?: number;
      reverseHoloTrend?: number;
      lowPriceExPlus?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
      reverseHoloAvg1?: number;
      reverseHoloAvg7?: number;
      reverseHoloAvg30?: number;
    };
  };
};

export type PokemonSet = {
  id: string;
  name: string;
  series?: string;
  printedTotal?: number;
  total?: number;
  legalities?: Record<string, string>;
  ptcgoCode?: string;
  releaseDate?: string;
  updatedAt?: string;
  images?: {
    symbol?: string;
    logo?: string;
  };
};

export type PokemonSetSummary = {
  id?: string;
  name?: string;
  series?: string;
  printedTotal?: number;
  total?: number;
  legalities?: Record<string, string>;
  ptcgoCode?: string;
  releaseDate?: string;
  updatedAt?: string;
  images?: {
    symbol?: string;
    logo?: string;
  };
};

export type ResolvedMarketPrice = {
  usd: number;
  gbp: number;
  key: string | null;
  label: string;
};

export type ResolvedTrend = {
  direction: "up" | "down" | "flat";
  changePercent: number | null;
  label: string;
};

type LocalDataFile<T> = {
  version: 1;
  source: "pokemontcg.io";
  syncedAt: string;
  count: number;
  data: T[];
};

type PokemonDataCache = {
  cards: PokemonCard[];
  sets: PokemonSet[];
  cardsById: Map<string, PokemonCard>;
  setsById: Map<string, PokemonSet>;
  cardsBySetId: Map<string, PokemonCard[]>;
};

const DATA_DIR = path.join(process.cwd(), "data");

async function readLocalDataFile<T>(filename: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, filename);

  try {
    const file = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(file) as LocalDataFile<T>;

    if (!Array.isArray(json.data)) {
      throw new Error(`${filename} has invalid data format.`);
    }

    return json.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    throw new Error(
      `Could not read local Pokémon data file: ${filename}. Run "pnpm sync:pokemon" first. Original error: ${message}`
    );
  }
}

function getCardNumberValue(number?: string) {
  if (!number) return Number.MAX_SAFE_INTEGER;

  const match = number.match(/\d+/);

  if (!match) return Number.MAX_SAFE_INTEGER;

  return Number(match[0]);
}

function sortCardsWithinSet(cards: PokemonCard[]) {
  return [...cards].sort((a, b) => {
    const numberA = getCardNumberValue(a.number);
    const numberB = getCardNumberValue(b.number);

    if (numberA !== numberB) return numberA - numberB;

    return String(a.number || "").localeCompare(String(b.number || ""));
  });
}

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scoreCardSearch(card: PokemonCard, query: string) {
  const name = normalizeSearch(card.name || "");
  const id = normalizeSearch(card.id || "");
  const setName = normalizeSearch(card.set?.name || "");
  const number = normalizeSearch(card.number || "");
  const rarity = normalizeSearch(card.rarity || "");

  let score = 0;

  if (name === query) score += 1000;
  if (name.startsWith(query)) score += 500;
  if (name.includes(query)) score += 250;

  if (id === query) score += 900;
  if (id.includes(query)) score += 300;

  if (setName.includes(query)) score += 120;
  if (number === query) score += 80;
  if (rarity.includes(query)) score += 50;

  return score;
}

export function getPokemonResolvedMarketPrice(
  card: PokemonCard
): ResolvedMarketPrice {
  const price = getResolvedCardPrice(card);

  return {
    // Kept for backwards compatibility with existing sort code. The GBP value
    // remains the single display value used across the site.
    usd: price.gbpValue / 0.79,
    gbp: price.gbpValue,
    key: price.variantKey,
    label: price.label,
  };
}

export function getPokemonResolvedTrend(card: PokemonCard): ResolvedTrend {
  return getResolvedCardTrend(card);
}

const getPokemonDataCache = cache(async (): Promise<PokemonDataCache> => {
  const [sets, cards] = await Promise.all([
    readLocalDataFile<PokemonSet>("pokemon-sets.json"),
    readLocalDataFile<PokemonCard>("pokemon-cards.json"),
  ]);

  const cardsById = new Map<string, PokemonCard>();
  const setsById = new Map<string, PokemonSet>();
  const cardsBySetId = new Map<string, PokemonCard[]>();

  for (const set of sets) {
    setsById.set(set.id, set);
  }

  for (const card of cards) {
    cardsById.set(card.id, card);

    const setId = card.set?.id;

    if (setId) {
      const existingCards = cardsBySetId.get(setId) || [];
      existingCards.push(card);
      cardsBySetId.set(setId, existingCards);
    }
  }

  for (const [setId, setCards] of cardsBySetId.entries()) {
    cardsBySetId.set(setId, sortCardsWithinSet(setCards));
  }

  return {
    cards,
    sets,
    cardsById,
    setsById,
    cardsBySetId,
  };
});

export async function getAllPokemonCards() {
  const data = await getPokemonDataCache();

  return data.cards;
}

export async function getAllPokemonSets() {
  const data = await getPokemonDataCache();

  return data.sets;
}

export async function getPokemonCardById(id: string) {
  const data = await getPokemonDataCache();

  return data.cardsById.get(id) || null;
}

export async function getPokemonSetById(id: string) {
  const data = await getPokemonDataCache();

  return data.setsById.get(id) || null;
}

export async function getPokemonCardsBySetId(setId: string) {
  const data = await getPokemonDataCache();

  return data.cardsBySetId.get(setId) || [];
}

export async function searchPokemonCards(query: string, limit = 60) {
  const data = await getPokemonDataCache();
  const cleanedQuery = normalizeSearch(query);

  if (!cleanedQuery) {
    return data.cards.slice(0, limit);
  }

  return data.cards
    .map((card) => ({
      card,
      score: scoreCardSearch(card, cleanedQuery),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((result) => result.card);
}

export function getPokemonCardMarketPriceUSD(card: PokemonCard) {
  return getPokemonResolvedMarketPrice(card).usd;
}

export function getPokemonCardMarketPriceGBP(card: PokemonCard) {
  return getPokemonResolvedMarketPrice(card).gbp;
}

export function getPokemonCardPrice(card: PokemonCard) {
  return getPokemonCardMarketPriceGBP(card);
}

export function getPokemonCardImage(card: PokemonCard) {
  return card.images?.large || card.images?.small || "";
}

export function getPokemonSetLogo(set: PokemonSet | PokemonSetSummary) {
  return set.images?.logo || "";
}

export function getPokemonSetSymbol(set: PokemonSet | PokemonSetSummary) {
  return set.images?.symbol || "";
}

export function getPokemonSetCardCount(set: PokemonSet | PokemonSetSummary) {
  return set.printedTotal || set.total || 0;
}

export function getPokemonSetReleaseYear(set: PokemonSet | PokemonSetSummary) {
  if (!set.releaseDate) return "";

  return new Date(set.releaseDate).getFullYear().toString();
}