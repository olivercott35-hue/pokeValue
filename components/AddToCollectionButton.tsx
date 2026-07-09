"use client";

import { useState } from "react";

interface AddToCollectionButtonProps {
  card: {
    id: string;
    name: string;
    images?: {
      small?: string;
    };
  };
}

export default function AddToCollectionButton({
  card,
}: AddToCollectionButtonProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const existing = JSON.parse(localStorage.getItem("collection") || "[]");

    const alreadyExists = existing.find((item: any) => item.id === card.id);

    if (!alreadyExists) {
      existing.push(card);

      localStorage.setItem("collection", JSON.stringify(existing));
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`px-4 py-2 rounded-xl font-medium transition ${
        added
          ? "bg-green-600 text-white"
          : "bg-purple-600 hover:bg-purple-500 text-white"
      }`}
    >
      {added ? "Added ✓" : "Add to Collection"}
    </button>
  );
}