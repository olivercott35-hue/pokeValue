import type { Metadata } from "next";

import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Pokémon Card Portfolio | PokeValue",
  description:
    "Review the estimated value of your personal Pokémon card collection and see your holdings ranked by market value.",
  alternates: { canonical: "https://www.pokevalue.co.uk/portfolio" },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}