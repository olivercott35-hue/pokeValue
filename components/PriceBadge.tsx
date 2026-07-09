"use client";

import { useEffect, useState } from "react";
import { getCardPrice } from "@/lib/pricing";

export default function PriceBadge({ cardId }: { cardId: string }) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    getCardPrice(cardId).then((data) => setPrice(data.price));
  }, [cardId]);

  return (
    <span
      className={`font-mono font-semibold text-xs transition-opacity duration-500 ${
        price ? "text-emerald-500" : "text-zinc-700"
      }`}
    >
      {price !== null ? `£${price.toFixed(2)}` : "Loading..."}
    </span>
  );
}