"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full bg-[#04040c]">
      {/* This absolute overlay matches your background exactly. 
        It masks the instant route switch by starting at full opacity 
        and smoothly fading away to reveal the fresh content.
      */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="pointer-events-none fixed inset-0 z-50 bg-[#04040c]"
      />

      {/* Subtle fade and lift for the actual page content */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.05, // Waits a microsecond for the mask overlay to catch up
          ease: [0.25, 1, 0.5, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}