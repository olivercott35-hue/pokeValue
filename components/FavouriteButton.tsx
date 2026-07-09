"use client";

import { useEffect, useState } from "react";

export default function FavoriteButton({ card }: any) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    setFavorited(favorites.some((f: any) => f.id === card.id));
  }, [card.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    const exists = favorites.some((f: any) => f.id === card.id);

    let updated;

    if (exists) {
      updated = favorites.filter((f: any) => f.id !== card.id);
      setFavorited(false);
    } else {
      updated = [...favorites, card];
      setFavorited(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`px-4 py-2 rounded-xl font-medium transition ${
        favorited
          ? "bg-pink-600 hover:bg-pink-500"
          : "bg-zinc-800 hover:bg-zinc-700"
      }`}
    >
      {favorited ? "♥ Favorited" : "♡ Favorite"}
    </button>
  );
}