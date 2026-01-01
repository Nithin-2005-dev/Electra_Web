"use client";

import { motion } from "framer-motion";

export default function TeamSection({ title, children }) {
  return (
    <section className="py-12">
      {title && (
        <h3 className="mb-8 text-center text-white text-lg sm:text-xl font-semibold tracking-wide">
          {title}
        </h3>
      )}

      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="
            grid gap-8
            justify-center

            [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]
            place-items-center
          "
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
