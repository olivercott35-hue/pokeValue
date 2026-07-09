import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CardClient from "./CardClient";

async function getCard(id: string) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();

    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) {
    return {
      title: "Card Not Found | PokeValue",
      description: "This Pokémon TCG card could not be found on PokeValue.",
    };
  }

  const setName = card?.set?.name || "Unknown Set";
  const rarity = card?.rarity || "Unknown rarity";
  const number = card?.number ? `#${card.number}` : "unknown number";

  return {
    title: `${card.name} ${number} | ${setName} | PokeValue`,
    description: `View ${card.name} from ${setName}. See rarity, card number, release information and available Pokémon TCG market estimates on PokeValue.`,
    openGraph: {
      title: `${card.name} | PokeValue`,
      description: `${rarity} Pokémon card from ${setName}.`,
      images: card?.images?.large ? [{ url: card.images.large }] : undefined,
    },
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) notFound();

  return <CardClient card={card} />;
}