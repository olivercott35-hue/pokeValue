import type { Metadata } from "next";

import MarketMoversClient from "./MarketMoversClient";

export const metadata: Metadata = {
  title: "Collection Market Rankings | PokeValue",
  description:
    "Rank the Pokémon cards in your personal collection using available Cardmarket and TCGPlayer market data.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function MarketMoversPage() {
  return <MarketMoversClient />;
}