import type { Metadata } from "next";

import FavoritesClient from "./FavoritesClient";

export const metadata: Metadata = {
  title: "Favourite Pokémon Cards | PokeValue",
  description:
    "Review and manage the Pokémon cards saved to your personal PokeValue favourites list.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}