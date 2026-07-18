import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CardClient from "./CardClient";
import {
  getPokemonCardById,
  getPokemonCardImage,
} from "@/lib/pokemon-data";
import { getResolvedCardPrice } from "@/lib/card-pricing";

const baseUrl = "https://www.pokevalue.co.uk";

type PageProps = {
  params: Promise<{ id: string }>;
};

function isIndexableCard(card: NonNullable<Awaited<ReturnType<typeof getPokemonCardById>>>) {
  const price = getResolvedCardPrice(card);

  return Boolean(
    card.id &&
      card.name &&
      card.number &&
      card.set?.id &&
      card.set?.name &&
      getPokemonCardImage(card) &&
      price.market > 0
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const card = await getPokemonCardById(id);

  if (!card) {
    return {
      title: "Card Not Found | PokeValue",
      description: "This Pokémon TCG card could not be found on PokeValue.",
      robots: { index: false, follow: true },
    };
  }

  const setName = card.set?.name || "Unknown Set";
  const rarity = card.rarity || "Unknown rarity";
  const number = card.number ? `#${card.number}` : "unknown number";
  const canonical = `${baseUrl}/cards/${encodeURIComponent(card.id)}`;
  const image = getPokemonCardImage(card);
  const shouldIndex = isIndexableCard(card);

  return {
    title: `${card.name} ${number} | ${setName} Price | PokeValue`,
    description: `Research ${card.name} ${number} from ${setName}. View its ${rarity} details, market source, price variant and collector information on PokeValue.`,
    alternates: {
      canonical,
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
      },
    },
    openGraph: {
      title: `${card.name} ${number} | PokeValue`,
      description: `${rarity} Pokémon card from ${setName}, with a clearly labelled marketplace estimate.`,
      url: canonical,
      siteName: "PokeValue",
      type: "website",
      images: image
        ? [
            {
              url: image,
              alt: `${card.name} ${number} from ${setName}`,
            },
          ]
        : undefined,
    },
  };
}

export default async function CardPage({ params }: PageProps) {
  const { id } = await params;
  const card = await getPokemonCardById(id);

  if (!card) notFound();

  const canonical = `${baseUrl}/cards/${encodeURIComponent(card.id)}`;
  const setUrl = card.set?.id
    ? `${baseUrl}/sets/${encodeURIComponent(card.set.id)}`
    : `${baseUrl}/sets`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cards",
        item: `${baseUrl}/cards`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: card.set?.name || "Set",
        item: setUrl,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: card.name,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CardClient card={card} />
    </>
  );
}
