import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const VERIFICATION_TOKEN = "pokevalue-ebay-2025-verification";

export async function GET() {
  return NextResponse.json({
    status: "ok",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const challengeCode = body.challengeCode;

  const hash = crypto
    .createHash("sha256")
    .update(
      challengeCode +
        VERIFICATION_TOKEN +
        "https://pokevalue-poke-value.vercel.app/api/ebay/account-deletion"
    )
    .digest("hex");

  return NextResponse.json({
    challengeResponse: hash,
  });
}