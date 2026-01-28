"use client";

import { AnimatePresence } from "framer-motion";

export default function MerchLayout({ children }) {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
}
