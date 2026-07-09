import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function clean(value: any) {
  return String(value || "").trim();
}

function norm(value: any) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(
      text
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim()
    );
  } catch {
    return null;
  }
}

function extractNumber(value: any) {
  const raw = clean(value);
  if (!raw || raw.toLowerCase() === "unknown") return "";
  return raw.split("/")[0].replace(/^0+/, "") || raw.split("/")[0];
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

function getSearchTerms(scan: any) {
  const terms = new Set<string>();
  const cardName = clean(scan.cardName);
  const pokemonName = clean(scan.pokemonName);

  if (cardName && cardName.toLowerCase() !== "unknown") {
    terms.add(cardName);
    terms.add(cardName.replace(/^Mega\s+/i, "M "));
    terms.add(cardName.replace(/\s+ex$/i, "-EX"));
    terms.add(cardName.replace(/\s+EX$/i, "-EX"));
    terms.add(cardName.replace(/^Mega\s+/i, "M ").replace(/\s+ex$/i, "-EX"));
    terms.add(cardName.replace(/^Mega\s+/i, "M ").replace(/\s+EX$/i, "-EX"));
  }

  if (pokemonName && pokemonName.toLowerCase() !== "unknown") {
    terms.add(pokemonName);
  }

  return Array.from(terms).filter(Boolean);
}

async function fetchCards(q: string, pageSize = 60) {
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

function scoreCard(card: any, scan: any) {
  let score = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  const scannedNumber = norm(extractNumber(scan.cardNumber));
  const scannedFullNumber = norm(scan.cardNumber);
  const scannedName = norm(scan.cardName);
  const scannedPokemon = norm(scan.pokemonName);
  const scannedSet = norm(scan.setName);
  const scannedHp = norm(scan.hp);
  const scannedRarity = norm(scan.rarityGuess);
  const visibleText = norm((scan.visibleText || []).join(" "));
  const scannedAttacks = (scan.attacks || []).map(norm).filter(Boolean);

  const apiName = norm(card.name);
  const apiNumber = norm(card.number);
  const apiSet = norm(card.set?.name);
  const apiHp = norm(card.hp);
  const apiRarity = norm(card.rarity);
  const apiAttackText = norm(
    (card.attacks || []).map((attack: any) => attack.name).join(" ")
  );

  if (scannedNumber && apiNumber === scannedNumber) {
    score += 500;
    reasons.push("Collector number matches");
  } else if (scannedNumber && apiNumber !== scannedNumber) {
    warnings.push("Collector number does not match this official card");
  }

  if (scannedFullNumber && visibleText.includes(scannedFullNumber)) {
    score += 120;
    reasons.push("Printed number appears in OCR text");
  }

  if (scannedName && apiName === scannedName) {
    score += 220;
    reasons.push("Card name matches exactly");
  } else if (scannedName && apiName.includes(scannedName)) {
    score += 120;
    reasons.push("Card name partially matches");
  } else if (
    scannedName &&
    scannedPokemon &&
    apiName.includes(scannedPokemon)
  ) {
    score += 90;
    reasons.push("Pokémon name matches");
    warnings.push(
      "Full scanned card name does not exactly match official name"
    );
  }

  if (scannedSet && apiSet.includes(scannedSet)) {
    score += 160;
    reasons.push("Set name matches");
  }

  if (scannedHp && apiHp === scannedHp) {
    score += 120;
    reasons.push("HP matches");
  } else if (scannedHp && apiHp && scannedHp !== apiHp) {
    warnings.push("HP does not match this official card");
  }

  if (scannedRarity && apiRarity.includes(scannedRarity)) {
    score += 60;
    reasons.push("Rarity matches");
  }

  if (visibleText && visibleText.includes(apiNumber)) {
    score += 120;
    reasons.push("API card number appears in OCR text");
  }

  for (const attack of scannedAttacks) {
    if (attack && apiAttackText.includes(attack)) {
      score += 100;
      reasons.push(`Attack matches: ${attack}`);
    }
  }

  return { score, reasons, warnings };
}

function scoreToConfidence(score: number) {
  if (score >= 850) return 99;
  if (score >= 700) return 96;
  if (score >= 550) return 90;
  if (score >= 400) return 82;
  if (score >= 275) return 70;
  if (score >= 150) return 55;
  return 35;
}

function buildMatchStatus(best: any, scan: any, confidence: number) {
  const warnings: string[] = [];

  if (!best) {
    return {
      exactMatch: false,
      confidence: 0,
      warning:
        "No official Pokémon TCG database match was found. Try a clearer front-facing image.",
      warnings: ["No possible matches found"],
    };
  }

  const scannedNumber = norm(extractNumber(scan.cardNumber));
  const scannedName = norm(scan.cardName);
  const apiNumber = norm(best.number);
  const apiName = norm(best.name);

  if (scannedNumber && apiNumber && scannedNumber !== apiNumber) {
    warnings.push(
      "The scanned collector number does not match the selected official card."
    );
  }

  if (
    scannedName &&
    apiName &&
    !apiName.includes(scannedName) &&
    apiName !== scannedName
  ) {
    warnings.push(
      "The scanned name does not fully match the selected official card."
    );
  }

  if (confidence < 70) {
    warnings.push(
      "Low confidence match. This may be a different print, custom card, proxy, fake, or unclear image."
    );
  }

  const exactMatch = confidence >= 82 && warnings.length === 0;

  return {
    exactMatch,
    confidence,
    warning: exactMatch
      ? ""
      : "No exact official match confirmed. Review the possible matches before trusting the result.",
    warnings,
  };
}

async function findMatches(scan: any) {
  const number = extractNumber(scan.cardNumber);
  const searchTerms = getSearchTerms(scan);
  const queries: string[] = [];

  if (number) queries.push(`number:${number}`);

  for (const term of searchTerms.slice(0, 5)) {
    if (number) queries.push(`name:"${term}" number:${number}`);
    queries.push(`name:"${term}"`);
    queries.push(`name:${term.split(" ")[0]}*`);
  }

  const uniqueQueries = Array.from(new Set(queries)).slice(0, 12);
  const results = await Promise.all(uniqueQueries.map((q) => fetchCards(q)));
  const allCards = results.flat();

  const deduped = Array.from(
    new Map(allCards.map((card: any) => [card.id, card])).values()
  );

  const ranked = deduped
    .map((card: any) => {
      const scoring = scoreCard(card, scan);
      const confidence = scoreToConfidence(scoring.score);

      return {
        ...card,
        _matchScore: scoring.score,
        _matchConfidence: confidence,
        _matchReasons: scoring.reasons,
        _matchWarnings: scoring.warnings,
        _price: getPrice(card),
      };
    })
    .sort((a: any, b: any) => b._matchScore - a._matchScore);

  const best = ranked[0] || null;
  const confidence = best?._matchConfidence || 0;
  const status = buildMatchStatus(best, scan, confidence);

  return {
    bestMatch: best,
    matches: ranked.slice(0, 12),
    price: best?._price || 0,
    matchScore: best?._matchScore || 0,
    confidence,
    exactMatch: status.exactMatch,
    warning: status.warning,
    warnings: status.warnings,
  };
}

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Return ONLY valid JSON. No markdown.

You are OCR-reading a Pokémon card. Do not guess from artwork only.

Extract:
{
  "pokemonName": "main Pokémon only",
  "cardName": "official-looking card name",
  "setName": "set name if visible or unknown",
  "cardNumber": "exact printed collector number near bottom, for example XY121, 13, 013/100, or unknown",
  "hp": "HP number only or unknown",
  "rarityGuess": "rarity if visible or unknown",
  "attacks": ["visible attack names"],
  "visibleText": ["all readable words and numbers from the card"],
  "confidence": number from 0 to 100,
  "conditionEstimate": {
    "overall": "Poor | Played | Lightly Played | Excellent | Near Mint | Mint | Unknown",
    "centering": number from 1 to 10,
    "corners": number from 1 to 10,
    "edges": number from 1 to 10,
    "surface": number from 1 to 10,
    "notes": "short condition notes"
  },
  "worthGrading": "Yes | Maybe | No | Unknown",
  "summary": "short useful summary"
}

Rules:
- Collector number is the most important field.
- If you see M Charizard-EX, write M Charizard-EX.
- If you see XY121, write XY121.
- Include attack names if readable.
- If unclear, use unknown.
              `,
            },
            {
              inlineData: {
                mimeType: image.type || "image/jpeg",
                data: base64,
              },
            },
          ],
        },
      ],
    });

    const scan = safeJsonParse(response.text || "");

    if (!scan) {
      return NextResponse.json(
        {
          error: "Gemini response could not be parsed",
          raw: response.text || "",
        },
        { status: 500 }
      );
    }

    const lookup = await findMatches(scan);

    return NextResponse.json({
      scan,
      lookup,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: error?.message || "Scanner failed" },
      { status: 500 }
    );
  }
}