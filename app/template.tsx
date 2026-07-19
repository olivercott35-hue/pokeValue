"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-full w-full bg-[#050507]">
      <motion.div
        aria-hidden="true"
        initial={{ opacity: reduceMotion ? 0 : 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 z-[60] bg-[#050507]"
      />
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
