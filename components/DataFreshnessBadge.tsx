"use client";

import { useEffect, useState } from "react";

type SyncMeta = {
  syncedAt: string | null;
  cardCount: number;
  setCount: number;
  failedSetCount: number;
};

function formatSyncedDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStaleness(iso: string | null) {
  if (!iso) return "unknown" as const;

  const ageMs = Date.now() - new Date(iso).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays <= 3) return "fresh" as const;
  if (ageDays <= 14) return "aging" as const;
  return "stale" as const;
}

const STATUS_STYLES = {
  fresh: "text-emerald-500",
  aging: "text-amber-500",
  stale: "text-red-500",
  unknown: "text-zinc-500",
} as const;

/**
 * PokeValue prices come from a periodic sync of Cardmarket/TCGplayer data via
 * pokemontcg.io, not a live feed. Rather than imply real-time accuracy, this
 * shows visitors exactly how old the underlying data is. Fetches from
 * /api/sync-status (a thin server route) instead of importing the
 * "server-only" pokemon-data module directly, since this component can be
 * rendered inside client trees (e.g. via Footer -> AppLayout).
 */
export default function DataFreshnessBadge({
  variant = "compact",
}: {
  variant?: "compact" | "detailed";
}) {
  const [meta, setMeta] = useState<SyncMeta | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/sync-status")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setMeta(json);
      })
      .catch(() => {
        if (!cancelled) setMeta({ syncedAt: null, cardCount: 0, setCount: 0, failedSetCount: 0 });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!meta) {
    return <p className={`text-xs ${STATUS_STYLES.unknown}`}>Checking data freshness…</p>;
  }

  if (!meta.syncedAt) {
    return (
      <p className={`text-xs ${STATUS_STYLES.unknown}`}>
        Pricing data sync time unavailable.
      </p>
    );
  }

  const staleness = getStaleness(meta.syncedAt);
  const dateLabel = formatSyncedDate(meta.syncedAt);

  if (variant === "compact") {
    return (
      <p className={`text-xs ${STATUS_STYLES[staleness]}`}>
        Card & price data last synced {dateLabel} from Cardmarket / TCGplayer
        via pokemontcg.io.
      </p>
    );
  }

  return (
    <div className={`text-sm ${STATUS_STYLES[staleness]}`}>
      <p>
        Card and pricing data was last synced on <strong>{dateLabel}</strong>{" "}
        from Cardmarket and TCGplayer listings via the pokemontcg.io data
        source ({meta.cardCount.toLocaleString()} cards across{" "}
        {meta.setCount.toLocaleString()} sets).
      </p>
      {staleness === "stale" && (
        <p className="mt-1">
          This is older than we&apos;d like — treat displayed prices as a
          starting reference point and check the linked marketplace for the
          current listing price before buying or selling.
        </p>
      )}
    </div>
  );
}
