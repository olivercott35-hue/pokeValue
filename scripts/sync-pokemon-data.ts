import fs from "node:fs/promises";
import path from "node:path";

const API_BASE_URL = "https://api.pokemontcg.io/v2";
const PAGE_SIZE = 250;
const DATA_DIR = path.join(process.cwd(), "data");

const CARD_FIELDS = [
  "id",
  "name",
  "supertype",
  "subtypes",
  "level",
  "hp",
  "types",
  "evolvesFrom",
  "evolvesTo",
  "rules",
  "ancientTrait",
  "abilities",
  "attacks",
  "weaknesses",
  "resistances",
  "retreatCost",
  "convertedRetreatCost",
  "set",
  "number",
  "artist",
  "rarity",
  "flavorText",
  "nationalPokedexNumbers",
  "legalities",
  "regulationMark",
  "images",
  "tcgplayer",
  "cardmarket"
].join(",");

const SET_FIELDS = [
  "id",
  "name",
  "series",
  "printedTotal",
  "total",
  "legalities",
  "ptcgoCode",
  "releaseDate",
  "updatedAt",
  "images"
].join(",");

type PokemonApiResponse<T> = {
  data: T[];
  page?: number;
  pageSize?: number;
  count?: number;
  totalCount?: number;
};

type PokemonCard = {
  id: string;
  name: string;
  number?: string;
  rarity?: string;
  set?: {
    id?: string;
    name?: string;
    series?: string;
    releaseDate?: string;
  };
  images?: {
    small?: string;
    large?: string;
  };
};

type PokemonSet = {
  id: string;
  name: string;
  series?: string;
  printedTotal?: number;
  total?: number;
  releaseDate?: string;
};

type LocalDataFile<T> = {
  version: 1;
  source: "pokemontcg.io";
  syncedAt: string;
  count: number;
  data: T[];
};

type FailedSet = {
  id: string;
  name: string;
  reason: string;
};

class PokemonApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, url: string, body: string) {
    super(`Pokemon API failed with ${status}: ${url}\n${body}`);
    this.name = "PokemonApiError";
    this.status = status;
    this.body = body;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  if (process.env.POKEMON_TCG_API_KEY) {
    headers["X-Api-Key"] = process.env.POKEMON_TCG_API_KEY;
  }

  return headers;
}

async function fetchJson<T>(url: string, attempt = 1): Promise<T> {
  const res = await fetch(url, {
    headers: getHeaders()
  });

  if (res.ok) {
    return (await res.json()) as T;
  }

  const body = await res.text().catch(() => "");

  const retryable =
    res.status === 404 ||
    res.status === 429 ||
    res.status === 500 ||
    res.status === 502 ||
    res.status === 503 ||
    res.status === 504;

  if (retryable && attempt <= 3) {
    const delay = attempt * 2500;
    console.warn(`Retrying ${res.status} after ${delay}ms`);
    await sleep(delay);
    return fetchJson<T>(url, attempt + 1);
  }

  throw new PokemonApiError(res.status, url, body);
}

async function writeJsonFile<T>(filename: string, data: T[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const payload: LocalDataFile<T> = {
    version: 1,
    source: "pokemontcg.io",
    syncedAt: new Date().toISOString(),
    count: data.length,
    data
  };

  const json = JSON.stringify(payload);
  const filePath = path.join(DATA_DIR, filename);

  await fs.writeFile(filePath, json, "utf8");

  const sizeMb = Buffer.byteLength(json, "utf8") / 1024 / 1024;

  console.log(
    `Saved ${filename} — ${data.length.toLocaleString()} records — ${sizeMb.toFixed(2)} MB`
  );
}

async function writeSyncReport(failedSets: FailedSet[], cardCount: number, setCount: number) {
  const report = {
    syncedAt: new Date().toISOString(),
    cardCount,
    setCount,
    failedSetCount: failedSets.length,
    failedSets
  };

  await fs.writeFile(
    path.join(DATA_DIR, "pokemon-sync-report.json"),
    JSON.stringify(report, null, 2),
    "utf8"
  );
}

function sortSets(sets: PokemonSet[]) {
  return [...sets].sort((a, b) => {
    const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;

    if (dateA !== dateB) return dateB - dateA;

    return a.name.localeCompare(b.name);
  });
}

function getCardNumberValue(number?: string) {
  if (!number) return Number.MAX_SAFE_INTEGER;

  const match = number.match(/\d+/);
  if (!match) return Number.MAX_SAFE_INTEGER;

  return Number(match[0]);
}

function sortCards(cards: PokemonCard[]) {
  return [...cards].sort((a, b) => {
    const dateA = a.set?.releaseDate ? new Date(a.set.releaseDate).getTime() : 0;
    const dateB = b.set?.releaseDate ? new Date(b.set.releaseDate).getTime() : 0;

    if (dateA !== dateB) return dateB - dateA;

    const setCompare = (a.set?.name || "").localeCompare(b.set?.name || "");
    if (setCompare !== 0) return setCompare;

    const numberA = getCardNumberValue(a.number);
    const numberB = getCardNumberValue(b.number);

    if (numberA !== numberB) return numberA - numberB;

    return (a.number || "").localeCompare(b.number || "");
  });
}

async function syncSets() {
  console.log("Syncing Pokémon sets...");

  const params = new URLSearchParams();
  params.set("pageSize", String(PAGE_SIZE));
  params.set("page", "1");
  params.set("orderBy", "-releaseDate,name");
  params.set("select", SET_FIELDS);

  const url = `${API_BASE_URL}/sets?${params.toString()}`;
  const json = await fetchJson<PokemonApiResponse<PokemonSet>>(url);

  const sets = sortSets(json.data || []);

  await writeJsonFile("pokemon-sets.json", sets);

  return sets;
}

async function fetchCardsForSet(set: PokemonSet, setIndex: number, totalSets: number) {
  const cards: PokemonCard[] = [];
  let page = 1;
  let totalCount = 0;

  while (true) {
    const params = new URLSearchParams();
    params.set("q", `set.id:${set.id}`);
    params.set("pageSize", String(PAGE_SIZE));
    params.set("page", String(page));
    params.set("select", CARD_FIELDS);

    const url = `${API_BASE_URL}/cards?${params.toString()}`;

    try {
      const json = await fetchJson<PokemonApiResponse<PokemonCard>>(url);
      const pageCards = json.data || [];

      if (typeof json.totalCount === "number") {
        totalCount = json.totalCount;
      }

      cards.push(...pageCards);

      if (pageCards.length === 0) break;
      if (totalCount > 0 && cards.length >= totalCount) break;
      if (pageCards.length < PAGE_SIZE) break;

      page += 1;
      await sleep(150);
    } catch (error) {
      if (error instanceof PokemonApiError) {
        console.warn(
          `[${setIndex}/${totalSets}] ${set.name} skipped — API ${error.status}`
        );

        return {
          failed: true as const,
          cards: [] as PokemonCard[],
          reason: `API ${error.status}`
        };
      }

      throw error;
    }
  }

  console.log(`[${setIndex}/${totalSets}] ${set.name} — ${cards.length.toLocaleString()} cards`);

  return cards;
}

async function syncCardsBySet(sets: PokemonSet[]) {
  console.log("Syncing Pokémon cards set-by-set...");

  const cardsById = new Map<string, PokemonCard>();
  const failedSets: FailedSet[] = [];

  for (let index = 0; index < sets.length; index += 1) {
    const set = sets[index];
    const result = await fetchCardsForSet(set, index + 1, sets.length);

    if (Array.isArray(result)) {
      for (const card of result) {
        cardsById.set(card.id, card);
      }
    } else {
      failedSets.push({
        id: set.id,
        name: set.name,
        reason: result.reason
      });
    }

    await sleep(150);
  }

  const cards = sortCards(Array.from(cardsById.values()));

  await writeJsonFile("pokemon-cards.json", cards);
  await writeSyncReport(failedSets, cards.length, sets.length);

  if (failedSets.length > 0) {
    console.warn("Some sets failed:");
    for (const failedSet of failedSets) {
      console.warn(`- ${failedSet.name} (${failedSet.id}): ${failedSet.reason}`);
    }
  }

  return { cards, failedSets };
}

const TCGDEX_API_BASE = "https://api.tcgdex.net/v2/en";

type TCGdexSetSummary = {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount?: { total?: number; official?: number };
};

type TCGdexSetDetail = TCGdexSetSummary & {
  releaseDate?: string;
  serie?: { name?: string };
  cards?: Array<{ id: string; image?: string; localId?: string; name?: string }>;
};

/**
 * pokemontcg.io's own team has visibly shifted focus to its paid successor
 * (Scrydex), so brand-new set releases can land there before pokemontcg.io
 * picks them up — or possibly never, if it's eventually retired. TCGdex is
 * free, open-source, and requires no API key, so this checks it for any set
 * id that isn't already in our synced data and backfills just that gap.
 *
 * This never touches or overwrites anything pokemontcg.io already provided
 * (pricing included) — it only adds sets/cards pokemontcg.io doesn't have
 * yet. Cards added this way won't have TCGplayer/Cardmarket pricing until
 * pokemontcg.io (or a future price-specific source) picks the set up; the
 * app's existing "no price data yet" handling covers that gracefully.
 */
async function fillMissingSetsFromTCGdex(existingSets: PokemonSet[], existingCards: PokemonCard[]) {
  try {
    console.log("Checking TCGdex for any set pokemontcg.io doesn't have yet...");

    const tcgdexSets = await fetchJson<TCGdexSetSummary[]>(`${TCGDEX_API_BASE}/sets`);
    const knownIds = new Set(existingSets.map((s) => s.id));
    const missing = tcgdexSets.filter((s) => s.id && !knownIds.has(s.id));

    if (missing.length === 0) {
      console.log("Nothing missing — pokemontcg.io already covers every TCGdex set id.");
      return null;
    }

    console.log(
      `Found ${missing.length} set(s) on TCGdex not yet in pokemontcg.io: ${missing
        .map((s) => s.id)
        .join(", ")}`
    );

    const mergedSets = [...existingSets];
    const cardsById = new Map(existingCards.map((c) => [c.id, c]));
    let addedCardCount = 0;

    for (const summary of missing) {
      try {
        const detail = await fetchJson<TCGdexSetDetail>(`${TCGDEX_API_BASE}/sets/${summary.id}`);

        mergedSets.push({
          id: detail.id,
          name: detail.name,
          series: detail.serie?.name,
          total: detail.cardCount?.total,
          printedTotal: detail.cardCount?.official,
          releaseDate: detail.releaseDate
        });

        for (const card of detail.cards || []) {
          if (!card.image || !card.id) continue;

          cardsById.set(card.id, {
            id: card.id,
            name: card.name || card.id,
            number: card.localId,
            set: {
              id: detail.id,
              name: detail.name,
              series: detail.serie?.name,
              releaseDate: detail.releaseDate
            },
            images: {
              small: `${card.image}/low.webp`,
              large: `${card.image}/high.webp`
            }
          });
          addedCardCount += 1;
        }

        console.log(`  + ${detail.name} (${detail.id}) — ${(detail.cards || []).length} cards from TCGdex`);
      } catch (innerError) {
        console.warn(`  TCGdex set ${summary.id} failed, skipping it:`, innerError);
      }
    }

    if (addedCardCount === 0) return null;

    return {
      sets: sortSets(mergedSets),
      cards: sortCards(Array.from(cardsById.values())),
      addedSetCount: missing.length,
      addedCardCount
    };
  } catch (error) {
    console.warn("TCGdex fallback check failed (non-fatal) — keeping pokemontcg.io data as-is.");
    console.warn(error);
    return null;
  }
}

async function main() {
  console.log("Starting local Pokémon data sync...");

  const startedAt = Date.now();

  const sets = await syncSets();
  const { cards, failedSets } = await syncCardsBySet(sets);

  const tcgdexResult = await fillMissingSetsFromTCGdex(sets, cards);

  if (tcgdexResult) {
    console.log(
      `TCGdex fallback added ${tcgdexResult.addedSetCount} set(s) / ${tcgdexResult.addedCardCount} card(s) pokemontcg.io didn't have yet.`
    );

    await writeJsonFile("pokemon-sets.json", tcgdexResult.sets);
    await writeJsonFile("pokemon-cards.json", tcgdexResult.cards);
    await writeSyncReport(failedSets, tcgdexResult.cards.length, tcgdexResult.sets.length);
  }

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log(`Pokemon sync completed in ${seconds}s.`);
}

main().catch((error) => {
  console.error("Pokemon sync failed:");
  console.error(error);
  process.exit(1);
});