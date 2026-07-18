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
import AdSenseScript from "@/components/AdSenseScript";

const baseUrl = "https://www.pokevalue.co.uk";
const adsensePublisherId =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ||
  "ca-pub-3780442870354296";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "PokeValue | UK Pokémon Card Price Tracker",
  description:
    "PokeValue helps UK Pokémon collectors research card prices, explore sets, organise collections and understand how marketplace estimates are selected.",
  keywords: [
    "Pokémon card prices",
    "Pokemon card value",
    "UK Pokémon cards",
    "Pokémon TCG prices",
    "PokeValue",
  ],
  applicationName: "PokeValue",
  authors: [{ name: "PokeValue Editorial Team" }],
  creator: "PokeValue",
  publisher: "PokeValue",
  other: {
    "google-adsense-account": adsensePublisherId,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "PokeValue | UK Pokémon Card Price Tracker",
    description:
      "Research Pokémon card prices, explore sets and understand the marketplace source behind each estimate.",
    url: baseUrl,
    siteName: "PokeValue",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokeValue | UK Pokémon Card Price Tracker",
    description:
      "Research Pokémon card prices, sets and clearly labelled marketplace estimates.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="bg-[#050505] text-white font-sora">
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>

        <CurrencyProvider>
          <AdSenseScript publisherId={adsensePublisherId} />

          {children}
          <Analytics />
        </CurrencyProvider>
      </body>
    </html>
  );
}
