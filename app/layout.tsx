import "./globals.css";

import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "PokeValue | UK Pokémon Card Price Tracker",
  description:
    "PokeValue helps UK Pokémon collectors check card prices, explore sets, track collections, and learn how Pokémon card values change over time.",
  keywords: [
    "Pokémon card prices",
    "Pokemon card value",
    "UK Pokémon cards",
    "Pokémon TCG prices",
    "PokeValue",
  ],
  openGraph: {
    title: "PokeValue | UK Pokémon Card Price Tracker",
    description:
      "Track Pokémon card prices, explore sets, and learn how to value your collection.",
    url: "https://www.pokevalue.co.uk",
    siteName: "PokeValue",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white font-sora">
        <CurrencyProvider>
          <Script
            async
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3780442870354296"
            crossOrigin="anonymous"
          />

          {children}
          <CookieBanner />
          <Analytics />
        </CurrencyProvider>
      </body>
    </html>
  );
}