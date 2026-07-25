import { NextResponse } from "next/server";
import { getPokemonDataSyncedAt } from "@/lib/pokemon-data";

export async function GET() {
  const meta = await getPokemonDataSyncedAt();

  return NextResponse.json(meta);
}
