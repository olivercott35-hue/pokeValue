import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params;

  return NextResponse.json({
    cardId,
    marketPrice: null,
    soldListings: [],
    source: "pending-ebay-integration",
  });
}