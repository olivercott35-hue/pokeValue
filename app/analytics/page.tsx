import type { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "Personal Collection Analytics | PokeValue",
  description:
    "Review private analytics generated from Pokémon cards saved in your browser.",
  alternates: { canonical: "https://www.pokevalue.co.uk/analytics" },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
