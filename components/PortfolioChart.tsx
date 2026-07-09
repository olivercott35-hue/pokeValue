"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Financial tracking data array
const performanceData = [
  { date: "Jan", value: 8400 },
  { date: "Feb", value: 9100 },
  { date: "Mar", value: 8900 },
  { date: "Apr", value: 10400 },
  { date: "May", value: 11200 },
  { date: "Jun", value: 12489 },
];

export default function PortfolioChart() {
  return (
    <div className="w-full h-[260px] bg-zinc-900/20 border border-zinc-800/60 rounded-2xl p-4 backdrop-blur-md">
      <div className="mb-4">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Portfolio History
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-zinc-100">£12,489.00</h3>
          <span className="text-xs font-semibold text-emerald-400">
            +14.2% this month
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <AreaChart
          data={performanceData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#52525b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#52525b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `£${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              borderColor: "#27272a",
              borderRadius: "12px",
              color: "#f4f4f5",
            }}
            formatter={(value) => [`£${value}`, "Value"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#a855f7"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}