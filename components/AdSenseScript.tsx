"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const PUBLIC_CONTENT_ROUTES = new Set(["/", "/guides", "/cards", "/sets"]);
const PUBLIC_CONTENT_PREFIXES = ["/guides/", "/cards/", "/sets/"];

function canShowAds(pathname: string) {
  if (PUBLIC_CONTENT_ROUTES.has(pathname)) return true;
  return PUBLIC_CONTENT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function AdSenseScript({
  publisherId,
}: {
  publisherId: string;
}) {
  const pathname = usePathname();

  if (!publisherId || !canShowAds(pathname)) return null;

  return (
    <Script
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}
