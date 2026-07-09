import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  try {
    const models = await ai.models.list();

    return NextResponse.json(models);
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e.message,
      },
      { status: 500 }
    );
  }
}