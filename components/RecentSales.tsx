"use client";

import { useEffect, useState } from "react";

export default function RecentSales({ cardId }: { cardId: string }) {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<any>({
    marketPrice: null,
    soldListings: [],
  });

  useEffect(() => {
    const loadSales = async () => {
      try {
        const res = await fetch(`/api/prices/${cardId}`);

        const json = await res.json();

        setData(json);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    loadSales();
  }, [cardId]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6">Recent Sales</h2>

      {loading ? (
        <p className="text-zinc-500">Loading market data...</p>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-zinc-500">Estimated Market Price</p>

            <p className="text-4xl font-bold text-green-400">
              {data.marketPrice ? `£${data.marketPrice}` : "No market data"}
            </p>
          </div>

          {data.soldListings.length === 0 ? (
            <div className="text-zinc-500">eBay sales tracking coming soon</div>
          ) : (
            <div className="space-y-3">
              {data.soldListings.map((sale: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-zinc-800 pb-3"
                >
                  <div>
                    <p>{sale.title}</p>

                    <p className="text-xs text-zinc-500">{sale.date}</p>
                  </div>

                  <span className="font-bold text-green-400">
                    £{sale.price}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}