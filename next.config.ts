import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This allows production builds to complete even if ESLint errors are present
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
};

export default nextConfig;