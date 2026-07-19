"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex min-h-dvh w-full bg-[#050507] text-white">
      <div className="pv-app-backdrop" aria-hidden="true" />
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="relative z-10 flex min-h-dvh min-w-0 flex-1 flex-col lg:h-dvh lg:overflow-hidden">
        <Header setMobileOpen={setMobileOpen} />
        <div className="min-h-0 flex-1 lg:overflow-y-auto lg:overscroll-contain pv-app-scroll">
          <div className="min-h-full">
            {children}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
