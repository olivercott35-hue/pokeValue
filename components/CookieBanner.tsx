"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

type CookieChoice = "accepted" | "rejected";

const STORAGE_KEY = "pokevalue_cookie_choice";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== "accepted" && saved !== "rejected") {
      setVisible(true);
    }
  }, []);

  function saveChoice(choice: CookieChoice) {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#07070b]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-purple-500/20 blur-[80px]" />

        <button
          type="button"
          onClick={() => saveChoice("rejected")}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/[0.03] p-2 text-zinc-500 transition hover:text-white"
          aria-label="Close cookie banner"
        >
          <X size={16} />
        </button>

        <div className="relative pr-10">
          <div className="mb-3 flex items-center gap-2 text-purple-400">
            <Cookie size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">
              Cookies & Ads
            </span>
          </div>

          <h2 className="text-xl font-black text-white">
            PokeValue uses cookies
          </h2>

          <p className="mt-3 text-sm leading-7 text-zinc-400">
            We use cookies and similar technologies to improve the site,
            remember preferences, measure performance, and display Google ads.
            You can accept all cookies or reject non-essential cookies.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck size={14} className="text-purple-400" />
            <Link
              href="/privacy"
              className="font-bold text-purple-400 hover:text-purple-300"
            >
              Read our Privacy Policy
            </Link>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => saveChoice("rejected")}
              className="rounded-xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-zinc-300 transition hover:bg-white/[0.05]"
            >
              Reject Non-Essential
            </button>

            <button
              type="button"
              onClick={() => saveChoice("accepted")}
              className="rounded-xl bg-purple-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_24px_rgba(168,85,247,0.35)] transition hover:bg-purple-500"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}