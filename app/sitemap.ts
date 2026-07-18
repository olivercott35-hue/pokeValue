import type { MetadataRoute } from "next";

import { guides } from "@/lib/guides";

import {
  getAllPokemonCards,
  getAllPokemonSets,
  getPokemonCardImage,
  getPokemonCardMarketPriceGBP,
} from "@/lib/pokemon-data";

const baseUrl = "https://www.pokevalue.co.uk";

function getValidDate(value: unknown): Date | undefined {
  if (!value) return undefined;

  const date = new Date(String(value));

  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cards, sets] = await Promise.all([
    getAllPokemonCards(),
    getAllPokemonSets(),
  ]);

  const safeCards = Array.isArray(cards) ? cards : [];
  const safeSets = Array.isArray(sets) ? sets : [];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/cards`,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sets`,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/guides`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/methodology`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${encodeURIComponent(guide.slug)}`,
    lastModified: new Date("2026-07-18"),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const setRoutes: MetadataRoute.Sitemap = safeSets
    .filter((set) => Boolean(set?.id && set?.name))
    .map((set) => {
      const lastModified =
        getValidDate(set.updatedAt) || getValidDate(set.releaseDate);

      return {
        url: `${baseUrl}/sets/${encodeURIComponent(set.id)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      };
    });

  const cardRoutes: MetadataRoute.Sitemap = safeCards
    .filter(
      (card) =>
        Boolean(
          card?.id &&
            card?.name &&
            card?.number &&
            card?.set?.id &&
            card?.set?.name &&
            getPokemonCardImage(card) &&
            getPokemonCardMarketPriceGBP(card) > 0
        )
    )
    .map((card) => {
      const lastModified =
        getValidDate(card.cardmarket?.updatedAt) ||
        getValidDate(card.tcgplayer?.updatedAt) ||
        getValidDate(card.set?.updatedAt) ||
        getValidDate(card.set?.releaseDate);

      return {
        url: `${baseUrl}/cards/${encodeURIComponent(card.id)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.65,
      };
    });

  return [...staticRoutes, ...guideRoutes, ...setRoutes, ...cardRoutes];
}
