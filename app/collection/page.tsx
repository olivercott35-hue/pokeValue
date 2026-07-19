import type { Metadata } from "next";

import CollectionClient from "./CollectionClient";

export const metadata: Metadata = {
  title: "My Pokémon Card Collection | PokeValue",
  description:
    "Manage your personal Pokémon card collection and review estimated market values in PokeValue.",
  alternates: { canonical: "https://www.pokevalue.co.uk/collection" },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function CollectionPage() {
  return <CollectionClient />;
}