"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

type CardImageProps = {
  src?: string | null;
  fallbackSrc?: string | null;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
};

/**
 * Card images come from a third-party CDN we don't control (currently
 * mid-migration from pokemontcg.io to Scrydex's infrastructure for the
 * newest sets), and that CDN is occasionally unreliable for hotlinked
 * requests. Rather than show a browser's broken-image icon, this tries a
 * secondary size first, then falls back to a clear "image unavailable"
 * placeholder that still shows the card name.
 */
export default function CardImage({
  src,
  fallbackSrc,
  alt,
  className,
  loading = "lazy",
}: CardImageProps) {
  const [stage, setStage] = useState<"primary" | "fallback" | "failed">(
    src ? "primary" : fallbackSrc ? "fallback" : "failed",
  );

  const currentSrc = stage === "primary" ? src : stage === "fallback" ? fallbackSrc : null;

  if (stage === "failed" || !currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-white/[0.03] p-6 text-center text-zinc-600 ${className ?? ""}`}
      >
        <ImageOff className="h-6 w-6" />
        <span className="text-xs">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      onError={() => {
        if (stage === "primary" && fallbackSrc) {
          setStage("fallback");
        } else {
          setStage("failed");
        }
      }}
    />
  );
}

/**
 * Grid variant using next/image (for the card list/set checklist grids,
 * which need fill+sizes for responsive layout). Same fallback philosophy:
 * on error, show a clear placeholder instead of a broken-image icon.
 */
export function GridCardImage({
  src,
  alt,
  sizes,
  quality = 65,
  className,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  quality?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return (
      <div className="flex h-full items-center justify-center text-xs font-bold text-zinc-600">
        No image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      quality={quality}
      loading="lazy"
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
