"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  BarChart3,
  CalendarDays,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
  BookOpen,
  Star,
  SearchCheck,
  BadgeCheck,
  Gem,
  ExternalLink,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import AddToCollectionButton from "@/components/AddToCollectionButton";
import FavoriteButton from "@/components/FavoriteButton";
import { useCurrency } from "@/components/CurrencyProvider";
import { getResolvedCardPrice } from "@/lib/card-pricing";

function listText(values: any[], fallback = "Unknown") {
  const clean = values.filter(Boolean).map(String);
  return clean.length ? clean.join(", ") : fallback;
}

function getCardStage(card: any) {
  return card?.subtypes?.find((item: string) =>
    ["Basic", "Stage 1", "Stage 2", "V", "VMAX", "VSTAR", "ex", "GX", "BREAK"].includes(item)
  );
}

function getCardCategory(card: any) {
  if (card?.supertype) return card.supertype;
  if (card?.types?.length) return `${card.types[0]} Pokémon`;
  return "Pokémon TCG card";
}

function getCollectabilityTone(card: any) {
  const rarity = String(card?.rarity || "").toLowerCase();

  if (
    rarity.includes("special illustration") ||
    rarity.includes("illustration") ||
    rarity.includes("secret") ||
    rarity.includes("rainbow") ||
    rarity.includes("gold") ||
    rarity.includes("ultra")
  ) {
    return "This type of rarity is often watched closely by collectors because artwork, scarcity and condition can all influence demand.";
  }

  if (rarity.includes("rare")) {
    return "Rare cards can still be attractive to collectors, especially when the Pokémon is popular, the artwork stands out, or the card is part of a well-known expansion.";
  }

  if (rarity.includes("promo")) {
    return "Promo cards can vary widely in value because distribution method, availability and sealed condition often matter as much as the card itself.";
  }

  return "Even lower-rarity cards can be worth tracking when they feature popular Pokémon, useful gameplay effects, attractive artwork, or come from older sets.";
}

function getGradingAdvice(card: any) {
  const rarity = String(card?.rarity || "").toLowerCase();
  const name = String(card?.name || "this card");

  if (
    rarity.includes("special illustration") ||
    rarity.includes("secret") ||
    rarity.includes("ultra") ||
    rarity.includes("rare") ||
    rarity.includes("promo")
  ) {
    return `${name} may be worth considering for grading if it has strong centering, clean corners, no whitening, no print lines and no visible surface damage. Grading is never guaranteed to increase value, so compare raw prices with graded sale prices before sending a card away.`;
  }

  return `${name} is usually best assessed by condition first. For many lower-rarity cards, grading only makes sense if the card is especially popular, older, difficult to find in clean condition, or personally meaningful to your collection.`;
}

function getPriceExplanation(prices: ReturnType<typeof getResolvedCardPrice>) {
  if (prices.market > 0) {
    return `PokeValue is currently showing a market estimate from ${prices.source}. This is not a guaranteed sale price. Pokémon card prices can change depending on condition, language, print quality, seller fees, buyer demand, recent listings and whether the card is raw or graded.`;
  }

  return "No reliable market estimate is available for this card yet. This can happen with newer releases, low-volume cards, unusual variants, promos, or cards that have not appeared often enough on major marketplaces. In those cases, it is better to show no data than to display a misleading zero value.";
}

export default function CardClient({ card }: { card: any }) {
  const { formatPrice } = useCurrency();

  const prices = useMemo(() => getResolvedCardPrice(card), [card]);

  const displayPrice = (value: number) =>
    formatPrice(value, prices.sourceCurrency);

  const setName = card?.set?.name || "Unknown Set";
  const rarity = card?.rarity || "Unknown rarity";
  const number = card?.number || "N/A";
  const types = listText(card?.types || []);
  const subtypes = listText(card?.subtypes || []);
  const stage = getCardStage(card) || "Not specified";
  const category = getCardCategory(card);
  const illustrator = card?.artist || "Unknown";
  const hp = card?.hp || "N/A";
  const regulationMark = card?.regulationMark || "N/A";
  const releaseDate = card?.set?.releaseDate || "Unknown";
  const hasPrice = prices.market > 0;

  return (
    <AppLayout>
      <div className="pv-page w-full overflow-x-hidden text-white">
        <div className="pointer-events-none absolute top-0 right-[-120px] h-80 w-80 rounded-full bg-violet-500/10 blur-[120px] sm:right-24 sm:h-96 sm:w-96 sm:blur-[140px]" />
        <div className="pointer-events-none absolute bottom-20 left-[-140px] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[130px] sm:left-24 sm:h-96 sm:w-96 sm:blur-[150px]" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-12">
          <motion.section
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 135,
              damping: 24,
            }}
            className="xl:col-span-4"
          >
            <div className="sticky top-6">
              <div className="group relative mx-auto max-w-[320px] rounded-[2rem] border border-white/[0.06] bg-white/[0.035] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:max-w-[380px] sm:p-4">
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/10 opacity-50 blur-2xl" />

                <img
                  src={card.images?.large || card.images?.small}
                  alt={card.name}
                  loading="eager"
                  decoding="async"
                  className="relative z-10 w-full rounded-[1.35rem] shadow-2xl"
                />
              </div>
            </div>
          </motion.section>

          <section className="grid min-w-0 gap-4 xl:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 135,
                damping: 24,
              }}
              className="pv-hero pv-shine"
            >
              <div className="mb-2 flex items-center gap-2 text-violet-300">
                <Sparkles size={14} />

                <span className="text-[9px] font-black uppercase tracking-[0.24em] sm:text-[10px] sm:tracking-[0.3em]">
                  Asset Intelligence
                </span>
              </div>

              <h1 className="pv-title pv-title-compact">
                {card.name}
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {setName} • #{number} • {rarity}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              <Metric
                icon={<BadgeDollarSign size={14} />}
                label="Market estimate"
                value={displayPrice(prices.market)}
              />

              <Metric
                icon={<TrendingUp size={14} />}
                label="Low reference"
                value={displayPrice(prices.low)}
              />

              <Metric
                icon={<BarChart3 size={14} />}
                label="Average reference"
                value={displayPrice(prices.average)}
              />

              <Metric
                icon={<Layers size={14} />}
                label="Source"
                value={prices.source}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 135,
                damping: 24,
                delay: 0.04,
              }}
              className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.035] p-5 backdrop-blur-2xl sm:p-6"
            >
              <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />

              <div className="relative flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-violet-300">
                      <TrendingUp size={14} />

                      <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                        Marketplace reference data
                      </span>
                    </div>

                    <p className="max-w-2xl text-xs leading-6 text-zinc-500">
                      These are labelled marketplace fields for the same selected
                      price source and variant. They are not presented as a
                      historical price chart.
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-3xl font-black">
                      {displayPrice(prices.market)}
                    </p>

                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                      {prices.label}
                    </p>
                  </div>
                </div>

                {prices.referenceValues.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {prices.referenceValues.map((point) => (
                      <div
                        key={point.label}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                      >
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          {point.label}
                        </p>
                        <p className="mt-2 text-lg font-black text-white">
                          {displayPrice(point.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 text-center text-sm text-zinc-500">
                    No marketplace reference data is available yet.
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    Variant: <span className="font-bold text-zinc-300">{prices.variantLabel}</span>
                    {prices.updatedAt ? ` • Source updated ${prices.updatedAt}` : ""}
                  </p>

                  {prices.sourceUrl && (
                    <a
                      href={prices.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener nofollow"
                      className="inline-flex items-center gap-2 font-bold text-violet-200 transition hover:text-purple-200"
                    >
                      View source
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
              <Info
                icon={<ShieldCheck size={14} />}
                label="Rarity"
                value={rarity}
              />

              <Info
                icon={<CalendarDays size={14} />}
                label="Released"
                value={releaseDate}
              />

              <Info
                icon={<WalletCards size={14} />}
                label="Number"
                value={`#${number}`}
              />

              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-end">
                <FavoriteButton card={card} />
                <AddToCollectionButton card={card} />
              </div>
            </div>
          </section>
        </div>

        <section className="relative mx-auto mt-8 max-w-7xl space-y-6">
          <div className="grid gap-6 xl:grid-cols-12">
            <ContentPanel
              className="xl:col-span-7"
              icon={<BookOpen size={16} />}
              eyebrow="Card Overview"
              title={`About ${card.name}`}
            >
              <p>
                <strong>{card.name}</strong> is a {category} from{" "}
                <strong>{setName}</strong>. It appears as card{" "}
                <strong>#{number}</strong> and is listed with the rarity{" "}
                <strong>{rarity}</strong>. PokeValue tracks this card alongside
                set data, rarity information, artwork details and available
                marketplace estimates so collectors can make a more informed
                decision before buying, selling, grading or adding it to a
                personal collection.
              </p>

              <p>
                This card is connected to the {setName} expansion, which means
                its long-term demand can be influenced by the popularity of the
                set, the Pokémon featured, the artwork style, competitive
                interest, pull rates, condition sensitivity and collector demand
                for complete set lists.
              </p>
            </ContentPanel>

            <ContentPanel
              className="xl:col-span-5"
              icon={<SearchCheck size={16} />}
              eyebrow="Quick Facts"
              title="Card Details"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Fact label="Name" value={card.name} />
                <Fact label="Set" value={setName} />
                <Fact label="Number" value={`#${number}`} />
                <Fact label="Rarity" value={rarity} />
                <Fact label="Type" value={types} />
                <Fact label="Subtype" value={subtypes} />
                <Fact label="Stage" value={stage} />
                <Fact label="HP" value={hp} />
                <Fact label="Artist" value={illustrator} />
                <Fact label="Regulation" value={regulationMark} />
              </div>
            </ContentPanel>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ContentPanel
              icon={<BadgeDollarSign size={16} />}
              eyebrow="Market Information"
              title="Understanding the price"
            >
              <p>{getPriceExplanation(prices)}</p>

              <p>
                A market estimate should be treated as a guide rather than a
                fixed value. Two copies of the same card can sell for different
                amounts depending on condition, centering, surface scratches,
                whitening, print defects, seller reputation and whether the card
                is graded or raw.
              </p>

              {!hasPrice && (
                <p>
                  PokeValue intentionally avoids showing fake prices when the
                  data is not reliable. If this card becomes more actively
                  traded, pricing may appear later as marketplace data improves.
                </p>
              )}
            </ContentPanel>

            <ContentPanel
              icon={<Gem size={16} />}
              eyebrow="Collectability"
              title="Collector demand"
            >
              <p>
                Collectability is not only about the current price. Cards can be
                desirable because of the Pokémon, artwork, rarity, age, set
                popularity, nostalgia, competitive history, or how difficult
                clean copies are to find.
              </p>

              <p>{getCollectabilityTone(card)}</p>
            </ContentPanel>

            <ContentPanel
              icon={<BadgeCheck size={16} />}
              eyebrow="Grading"
              title="Is it worth grading?"
            >
              <p>{getGradingAdvice(card)}</p>

              <p>
                Before grading, compare recent raw card values with graded
                examples and remember to include grading fees, postage,
                insurance, turnaround time and the chance of receiving a lower
                grade than expected.
              </p>
            </ContentPanel>
          </div>

          <ContentPanel
            icon={<Star size={16} />}
            eyebrow="Collector Guide"
            title={`How to evaluate ${card.name}`}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-lg font-black text-white">
                  Condition checks
                </h3>

                <p>
                  Start by checking the front and back under bright light. Look
                  for whitening on edges, corner wear, surface scratches,
                  dents, print lines, holo scratches, silvering and any marks
                  that could reduce grade or resale appeal.
                </p>

                <p>
                  Centering also matters. A card can look clean but still lose
                  value if the borders are noticeably uneven, especially for
                  collectors targeting high graded copies.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-black text-white">
                  Market checks
                </h3>

                <p>
                  Compare current asking prices with actual sold prices where
                  possible. Active listings can be optimistic, while sold
                  results show what buyers recently paid.
                </p>

                <p>
                  For newer cards, wait for more sales before assuming the
                  first market value is stable. Early hype can move prices up
                  or down quickly after release.
                </p>
              </div>
            </div>
          </ContentPanel>

          <ContentPanel
            icon={<Sparkles size={16} />}
            eyebrow="FAQ"
            title={`Frequently asked questions about ${card.name}`}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FAQ
                question={`Which set is ${card.name} from?`}
                answer={`${card.name} is from ${setName}. It is listed as card #${number} in that set.`}
              />

              <FAQ
                question={`What rarity is ${card.name}?`}
                answer={`${card.name} is currently listed as ${rarity}. Rarity can affect collectability, but condition, demand and artwork also matter.`}
              />

              <FAQ
                question={`Why does ${card.name} show no price data?`}
                answer="Some cards do not have enough reliable marketplace data yet. This is common for newer cards, promos, low-volume cards and unusual variants."
              />

              <FAQ
                question={`Is ${card.name} worth grading?`}
                answer="It may be worth grading if the card is valuable, rare, in excellent condition, or personally important. Always compare raw and graded sale prices before paying grading fees."
              />

              <FAQ
                question="How do I check if this card is genuine?"
                answer="Check print quality, card texture, font, holo pattern, back colour, weight, edges and compare it with verified images. For expensive cards, buy from trusted sellers or seek expert authentication."
              />

              <FAQ
                question="Can the displayed market value change?"
                answer="Yes. Pokémon card prices can change as supply, demand, condition, new releases, grading trends and collector interest change over time."
              />
            </div>
          </ContentPanel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResourceLink
              href={`/sets/${card?.set?.id || ""}`}
              icon={<Layers size={16} />}
              title="View this set"
              desc={`Explore more cards from ${setName}.`}
            />

            <ResourceLink
              href="/cards"
              icon={<SearchCheck size={16} />}
              title="Browse cards"
              desc="Search the full Pokémon card archive."
            />

            <ResourceLink
              href="/guides"
              icon={<BookOpen size={16} />}
              title="Read guides"
              desc="Learn about values, grading and collecting."
            />

            <ResourceLink
              href="/collection"
              icon={<WalletCards size={16} />}
              title="Collection tracker"
              desc="Track saved cards in your vault."
            />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2 text-violet-300">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>

      <p className="truncate text-xl font-black">{value}</p>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div className="mb-1 flex items-center gap-2 text-violet-300">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>

      <p className="truncate text-sm font-bold">{value}</p>
    </div>
  );
}

function ContentPanel({
  icon,
  eyebrow,
  title,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl ${className}`}
    >
      <div className="mb-4 flex items-center gap-2 text-violet-300">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.24em]">
          {eyebrow}
        </span>
      </div>

      <h2 className="mb-4 text-2xl font-black text-white">{title}</h2>

      <div className="space-y-4 text-sm leading-7 text-zinc-400">
        {children}
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-4">
      <p className="mb-1 text-[9px] font-black uppercase tracking-[0.22em] text-violet-300">
        {label}
      </p>

      <p className="truncate text-sm font-bold text-zinc-300">{value}</p>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.025] p-5">
      <h3 className="mb-2 text-sm font-black text-white">{question}</h3>

      <p className="text-sm leading-7 text-zinc-500">{answer}</p>
    </div>
  );
}

function ResourceLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-2xl transition hover:border-violet-300/30 hover:bg-white/[0.045]"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500 group-hover:text-white">
        {icon}
      </div>

      <div className="flex items-center gap-2">
        <h3 className="font-black text-white">{title}</h3>
        <ExternalLink size={13} className="text-zinc-600" />
      </div>

      <p className="mt-2 text-sm leading-6 text-zinc-500">{desc}</p>
    </Link>
  );
}