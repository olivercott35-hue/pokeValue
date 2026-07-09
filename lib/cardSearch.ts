export type SearchScanData = {
  rawText: string;
  nameGuesses: string[];
  collectorNumbers: string[];
  hp?: string;
};

function clean(value: any) {
  return String(value || "").trim();
}

function norm(value: any) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getPrice(card: any) {
  const cm = card?.cardmarket?.prices;
  const tcg = card?.tcgplayer?.prices;
  const firstTcg: any = tcg ? Object.values(tcg)[0] : null;

  const values = [
    cm?.trendPrice,
    cm?.averageSellPrice,
    cm?.avg7,
    cm?.avg30,
    firstTcg?.market,
    firstTcg?.mid,
    firstTcg?.low,
  ];

  for (const value of values) {
    const number = Number(value);
    if (!Number.isNaN(number) && number > 0) return number;
  }

  return 0;
}

async function fetchCards(q: string, pageSize = 50) {
  const params = new URLSearchParams();
  params.set("q", q);
  params.set("pageSize", String(pageSize));

  const res = await fetch(`https://api.pokemontcg.io/v2/cards?${params}`, {
    headers: process.env.POKEMON_TCG_API_KEY
      ? { "X-Api-Key": process.env.POKEMON_TCG_API_KEY }
      : {},
    cache: "no-store",
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json.data || [];
}

function scoreCard(card: any, scan: SearchScanData) {
  let score = 0;
  const reasons: string[] = [];

  const raw = norm(scan.rawText);
  const hp = norm(scan.hp);
  const cardName = norm(card.name);
  const cardNumber = norm(card.number);
  const cardHp = norm(card.hp);
  const cardSet = norm(card.set?.name);

  for (const number of scan.collectorNumbers) {
    const simpleNumber = norm(number.split("/")[0].replace(/^0+/, ""));

    if (simpleNumber && cardNumber === simpleNumber) {
      score += 500;
      reasons.push(`Collector number matched: ${number}`);
    }

    if (simpleNumber && raw.includes(simpleNumber)) {
      score += 80;
      reasons.push("Collector number found in OCR text");
    }
  }

  for (const name of scan.nameGuesses) {
    const n = norm(name);

    if (n && cardName === n) {
      score += 250;
      reasons.push(`Exact name matched: ${name}`);
    } else if (n && cardName.includes(n)) {
      score += 150;
      reasons.push(`Partial name matched: ${name}`);
    }
  }

  if (hp && cardHp === hp) {
    score += 100;
    reasons.push(`HP matched: ${hp}`);
  }

  if (cardSet && raw.includes(cardSet)) {
    score += 90;
    reasons.push("Set name found in OCR text");
  }

  const attacks = (card.attacks || []).map((attack: any) => norm(attack.name));

  for (const attack of attacks) {
    if (attack && raw.includes(attack)) {
      score += 120;
      reasons.push(`Attack matched: ${attack}`);
    }
  }

  return { score, reasons };
}

export async function searchAndRankCards(scan: SearchScanData) {
  const queries: string[] = [];

  for (const number of scan.collectorNumbers) {
    const base = number.split("/")[0].replace(/^0+/, "");
    if (base) queries.push(`number:${base}`);
  }

  for (const name of scan.nameGuesses) {
    const firstWord = clean(name).split(" ")[0];

    if (name) queries.push(`name:"${name}"`);
    if (firstWord) queries.push(`name:${firstWord}*`);
  }

  const uniqueQueries = Array.from(new Set(queries)).slice(0, 10);

  const results = await Promise.all(uniqueQueries.map((q) => fetchCards(q)));
  const allCards = results.flat();

  const deduped = Array.from(
    new Map(allCards.map((card: any) => [card.id, card])).values()
  );

  const ranked = deduped
    .map((card: any) => {
      const scoring = scoreCard(card, scan);

      return {
        ...card,
        _matchScore: scoring.score,
        _matchReasons: scoring.reasons,
        _price: getPrice(card),
      };
    })
    .sort((a: any, b: any) => b._matchScore - a._matchScore);

  const best = ranked[0] || null;

  return {
    bestMatch: best,
    matches: ranked.slice(0, 12),
    price: best?._price || 0,
    matchScore: best?._matchScore || 0,
  };
}