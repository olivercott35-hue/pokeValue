import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("q");

  const res = await fetch(
    `https://api.pokemontcg.io/v2/cards?q=name:${search}*`,
    {
      headers: {
        "X-Api-Key": process.env.POKEMON_TCG_API_KEY || "",
      },
    }
  );

  const data = await res.json();

  return NextResponse.json(data.data);
}