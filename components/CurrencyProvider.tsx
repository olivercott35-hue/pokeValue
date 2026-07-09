"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CurrencyCode = "GBP" | "USD" | "EUR";
export type PriceSourceCurrency = CurrencyCode;

const symbols: Record<CurrencyCode, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

const toGBP: Record<CurrencyCode, number> = {
  GBP: 1,
  USD: 0.79,
  EUR: 0.86,
};

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (value: number, sourceCurrency?: PriceSourceCurrency) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("GBP");

  useEffect(() => {
    const saved = localStorage.getItem("pokevalue_currency");

    if (saved === "GBP" || saved === "USD" || saved === "EUR") {
      setCurrencyState(saved);
    }
  }, []);

  function setCurrency(nextCurrency: CurrencyCode) {
    setCurrencyState(nextCurrency);
    localStorage.setItem("pokevalue_currency", nextCurrency);
  }

  const value = useMemo(() => {
    return {
      currency,
      setCurrency,
      formatPrice: (
        rawValue: number,
        sourceCurrency: PriceSourceCurrency = "GBP"
      ) => {
        const number = Number(rawValue);

        if (!number || Number.isNaN(number)) return "No data";

        const valueInGBP = number * toGBP[sourceCurrency];
        const converted = valueInGBP / toGBP[currency];

        return `${symbols[currency]}${converted.toFixed(2)}`;
      },
    };
  }, [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return context;
}