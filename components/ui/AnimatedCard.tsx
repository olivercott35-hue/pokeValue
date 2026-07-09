"use client";

import { motion } from "framer-motion";

export default function AnimatedCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
    >
      {children}
    </motion.div>
  );
}