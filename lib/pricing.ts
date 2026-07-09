import { cache } from "react";

// Use React cache to memoize requests during a single render pass
export const getCardPrice = cache(
  async (cardId: string, mode = "RAW", grade = "10") => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-price?id=${cardId}&mode=${mode}&grade=${grade}`,
      {
        next: { revalidate: 3600 }, // Cache results for 1 hour
      }
    );
    return res.json();
  }
);