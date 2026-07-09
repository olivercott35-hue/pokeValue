import { NextResponse } from "next/server";
import { getCard } from "@/lib/pokemon";

export async function GET() {
  const card = await getCard("sv8-191");

  return NextResponse.json(card);
}