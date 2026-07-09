import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SetClient from "./SetClient";

async function getSet(id: string) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/sets/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();

    return json.data || null;
  } catch {
    return null;
  }
}

async function getSetCards(id: string) {
  try {
    const params = new URLSearchParams();

    params.set("q", `set.id:${id}`);
    params.set("pageSize", "250");
    params.set("orderBy", "number");

    const res = await fetch(`https://api.pokemontcg.io/v2/cards?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const json = await res.json();

    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const setData = await getSet(id);

  if (!setData) {
    return {
      title: "Set Not Found | PokeValue",
      description: "This Pokémon TCG set could not be found on PokeValue.",
    };
  }

  const total = setData.total || setData.printedTotal || 0;
  const releaseDate = setData.releaseDate || "unknown release date";
  const series = setData.series || "Pokémon TCG";

  return {
    title: `${setData.name} Pokémon Cards | PokeValue`,
    description: `Browse ${setData.name} from the ${series} series. View ${total} Pokémon cards, release date ${releaseDate}, rarities and available market estimates.`,
    openGraph: {
      title: `${setData.name} | PokeValue`,
      description: `Explore cards from ${setData.name}, including card numbers, rarities and market estimates where available.`,
      images: setData?.images?.logo
        ? [{ url: setData.images.logo }]
        : undefined,
    },
  };
}

export default async function SetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [setData, cards] = await Promise.all([getSet(id), getSetCards(id)]);

  if (!setData) notFound();

  return <SetClient setData={setData} initialCards={cards} />;
}