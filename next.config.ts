import type { NextConfig } from "next";

const retiredGuideRedirects = [
  ["psa-vs-ace-vs-cgc-grading", "should-you-grade-your-pokemon-cards"],
  ["best-pokemon-sets-to-collect", ""],
  ["why-pokemon-card-prices-change", "how-to-value-pokemon-cards"],
  ["pokemon-rarity-symbols-explained", ""],
  ["how-to-store-pokemon-cards", "pokemon-card-condition-guide"],
  ["how-to-clean-pokemon-cards-safely", "pokemon-card-condition-guide"],
  ["best-places-to-buy-pokemon-cards", "how-to-value-pokemon-cards"],
  ["best-places-to-sell-pokemon-cards", "how-to-value-pokemon-cards"],
  ["buying-singles-vs-booster-packs", ""],
  ["are-pokemon-cards-a-good-investment", "how-to-value-pokemon-cards"],
  ["most-valuable-modern-pokemon-cards", "how-to-value-pokemon-cards"],
  ["most-valuable-vintage-pokemon-cards", "how-to-value-pokemon-cards"],
  ["best-pokemon-sets-to-invest-in", "how-to-value-pokemon-cards"],
  ["how-population-reports-affect-prices", "should-you-grade-your-pokemon-cards"],
  ["what-makes-a-chase-card-valuable", "how-to-value-pokemon-cards"],
  ["understanding-pokemon-tcg-market-prices", "how-to-value-pokemon-cards"],
  ["common-mistakes-new-pokemon-collectors-make", ""],
] as const;

const nextConfig: NextConfig = {
  // Production builds should not fail only because of a lint warning.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.scrydex.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pokemontcg.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.tcgplayer.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return retiredGuideRedirects.map(([sourceSlug, destinationSlug]) => ({
      source: `/guides/${sourceSlug}`,
      destination: destinationSlug ? `/guides/${destinationSlug}` : "/guides",
      permanent: true,
    }));
  },
};

export default nextConfig;
