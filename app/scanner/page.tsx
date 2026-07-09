"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  Loader2,
  Sparkles,
  ShieldCheck,
  BadgeDollarSign,
  Search,
  Star,
  CheckCircle2,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";

type ScanResult = {
  scan: any;
  lookup: {
    bestMatch: any;
    matches: any[];
    price: number;
    matchScore?: number;
  };
};

function getPrice(card: any, fallback = 0) {
  if (card?._price) return Number(card._price);

  const cm = card?.cardmarket?.prices;
  const tcg = card?.tcgplayer?.prices;
  const firstTcg: any = tcg ? Object.values(tcg)[0] : null;

  const values = [
    cm?.trendPrice,
    cm?.averageSellPrice,
    cm?.avg7,
    cm?.avg30,
    firstTcg?.market,
    firstTcg?.mid,
    firstTcg?.low,
  ];

  for (const value of values) {
    const number = Number(value);
    if (!Number.isNaN(number) && number > 0) return number;
  }

  return fallback;
}

export default function ScannerPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(file: File) {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setSelectedCardId(null);
    setError("");
  }

  async function scanCard() {
    if (!imageFile) {
      setError("Upload a card image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setSelectedCardId(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/scan-card", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Scan failed");
      }

      setResult(data);
      setSelectedCardId(data.lookup?.bestMatch?.id || null);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const matches = result?.lookup?.matches || [];

  const selectedCard = useMemo(() => {
    if (!result) return null;

    return (
      matches.find((match) => match.id === selectedCardId) ||
      result.lookup?.bestMatch ||
      null
    );
  }, [matches, result, selectedCardId]);

  const scan = result?.scan;
  const selectedPrice = getPrice(selectedCard, result?.lookup?.price || 0);

  return (
    <AppLayout>
      <div className="relative min-h-full w-full overflow-hidden px-4 py-6 text-white sm:px-6 md:px-10 md:py-10">
        <div className="pointer-events-none absolute right-[-120px] top-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-20 left-[-140px] h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl">
          <section className="mb-8 rounded-3xl border border-white/[0.06] bg-white/[0.035] p-6 backdrop-blur-2xl sm:p-8">
            <div className="mb-3 flex items-center gap-2 text-purple-400">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                AI Card Scanner
              </span>
            </div>

            <h1 className="bg-gradient-to-r from-white via-zinc-200 to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              Scan a Pokémon Card
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
              Upload a card photo, review the best match, then choose from
              possible matches if the scanner detects the wrong print.
            </p>
          </section>

          <div className="grid gap-6 xl:grid-cols-12">
            <section className="xl:col-span-5">
              <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-5 backdrop-blur-2xl sm:p-6">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex min-h-[420px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-purple-500/30 bg-purple-500/5 p-6 text-center transition hover:border-purple-400/60 hover:bg-purple-500/10"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Uploaded card"
                      className="max-h-[420px] rounded-2xl object-contain shadow-2xl"
                    />
                  ) : (
                    <>
                      <Camera className="mb-5 h-12 w-12 text-purple-400" />
                      <h2 className="text-2xl font-black text-white">
                        Upload Card Photo
                      </h2>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                        Use a clear front-facing photo with good lighting for
                        the best result.
                      </p>
                    </>
                  )}
                </button>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.07]"
                  >
                    <Upload size={16} />
                    Choose Image
                  </button>

                  <button
                    type="button"
                    onClick={scanCard}
                    disabled={loading || !imageFile}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Search size={16} />
                    )}
                    {loading ? "Scanning..." : "Scan Card"}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                  </div>
                )}
              </div>
            </section>

            <section className="xl:col-span-7">
              {!result ? (
                <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.035] p-8 text-center backdrop-blur-2xl">
                  <div>
                    <Sparkles className="mx-auto mb-5 h-10 w-10 text-purple-400" />
                    <h2 className="text-2xl font-black text-white">
                      Results will appear here
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500">
                      Once scanned, you’ll see the detected card, condition
                      estimate, price data, and selectable possible matches.
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-6 backdrop-blur-2xl">
                    <div className="flex flex-col gap-6 md:flex-row">
                      {selectedCard?.images?.small && (
                        <div className="shrink-0">
                          <img
                            src={selectedCard.images.small}
                            alt={selectedCard.name}
                            className="w-44 rounded-2xl shadow-2xl"
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
                          Selected Match
                        </p>

                        <h2 className="text-3xl font-black text-white">
                          {selectedCard?.name ||
                            scan?.cardName ||
                            "Unknown card"}
                        </h2>

                        <p className="mt-2 text-sm leading-7 text-zinc-400">
                          {selectedCard
                            ? `${selectedCard.set?.name || "Unknown set"} • #${
                                selectedCard.number || "N/A"
                              } • ${selectedCard.rarity || "Unknown rarity"}`
                            : "No exact Pokémon TCG database match found."}
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <ResultMetric
                            icon={<BadgeDollarSign size={14} />}
                            label="Market"
                            value={
                              selectedPrice > 0
                                ? `£${selectedPrice.toFixed(2)}`
                                : "No data"
                            }
                          />

                          <ResultMetric
                            icon={<Star size={14} />}
                            label="AI Confidence"
                            value={`${scan?.confidence || 0}%`}
                          />

                          <ResultMetric
                            icon={<ShieldCheck size={14} />}
                            label="Grade?"
                            value={scan?.worthGrading || "Unknown"}
                          />
                        </div>

                        {selectedCard && (
                          <Link
                            href={`/cards/${selectedCard.id}`}
                            className="mt-5 inline-flex rounded-2xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-500"
                          >
                            Open full card page
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {matches.length > 0 && (
                    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-6 backdrop-blur-2xl">
                      <div className="mb-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
                          Possible Matches
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-white">
                          Choose the correct card
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-zinc-500">
                          Some cards have similar names, art, or promo numbers.
                          Select the correct print if the top match is wrong.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {matches.map((match) => {
                          const active = selectedCard?.id === match.id;
                          const matchPrice = getPrice(match);
                          const score = Number(match._matchScore || 0);

                          return (
                            <button
                              key={match.id}
                              type="button"
                              onClick={() => setSelectedCardId(match.id)}
                              className={`flex gap-4 rounded-2xl border p-3 text-left transition ${
                                active
                                  ? "border-purple-500/60 bg-purple-500/15"
                                  : "border-white/[0.06] bg-white/[0.03] hover:border-purple-500/30 hover:bg-white/[0.05]"
                              }`}
                            >
                              {match.images?.small && (
                                <img
                                  src={match.images.small}
                                  alt={match.name}
                                  className="h-28 w-20 shrink-0 rounded-xl object-cover"
                                />
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="truncate text-sm font-black text-white">
                                    {match.name}
                                  </p>

                                  {active && (
                                    <CheckCircle2
                                      size={16}
                                      className="shrink-0 text-purple-400"
                                    />
                                  )}
                                </div>

                                <p className="mt-1 text-xs leading-5 text-zinc-500">
                                  {match.set?.name || "Unknown set"} • #
                                  {match.number || "N/A"}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-zinc-300">
                                    Score {score}
                                  </span>

                                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-zinc-300">
                                    {match.rarity || "Unknown"}
                                  </span>

                                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold text-purple-300">
                                    {matchPrice > 0
                                      ? `£${matchPrice.toFixed(2)}`
                                      : "No price"}
                                  </span>
                                </div>

                                {Array.isArray(match._matchReasons) &&
                                  match._matchReasons.length > 0 && (
                                    <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-zinc-600">
                                      {match._matchReasons.join(" • ")}
                                    </p>
                                  )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    <InfoPanel title="AI Identification">
                      <InfoRow label="Card name" value={scan?.cardName} />
                      <InfoRow label="Set" value={scan?.setName} />
                      <InfoRow label="Card number" value={scan?.cardNumber} />
                      <InfoRow label="Rarity" value={scan?.rarityGuess} />
                    </InfoPanel>

                    <InfoPanel title="Condition Estimate">
                      <InfoRow
                        label="Overall"
                        value={scan?.conditionEstimate?.overall}
                      />
                      <InfoRow
                        label="Centering"
                        value={`${
                          scan?.conditionEstimate?.centering || "?"
                        }/10`}
                      />
                      <InfoRow
                        label="Corners"
                        value={`${scan?.conditionEstimate?.corners || "?"}/10`}
                      />
                      <InfoRow
                        label="Edges"
                        value={`${scan?.conditionEstimate?.edges || "?"}/10`}
                      />
                      <InfoRow
                        label="Surface"
                        value={`${scan?.conditionEstimate?.surface || "?"}/10`}
                      />
                    </InfoPanel>
                  </div>

                  <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6">
                    <h3 className="mb-3 text-xl font-black text-white">
                      Scanner Notes
                    </h3>
                    <p className="text-sm leading-7 text-zinc-400">
                      {scan?.conditionEstimate?.notes || scan?.summary}
                    </p>
                    <p className="mt-4 text-xs leading-6 text-zinc-600">
                      AI condition estimates are guidance only. Real card value
                      depends on exact condition, buyer demand, platform fees,
                      and recent sales.
                    </p>
                  </div>
                </motion.div>
              )}
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ResultMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2 text-purple-400">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>
      <p className="truncate text-lg font-black text-white">{value}</p>
    </div>
  );
}

function InfoPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-6 backdrop-blur-2xl">
      <h3 className="mb-4 text-xl font-black text-white">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] pb-3">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-right text-sm font-bold text-zinc-200">
        {value || "Unknown"}
      </span>
    </div>
  );
}