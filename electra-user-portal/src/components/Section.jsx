"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export default function Section({ children, className = "" }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className={`relative py-[clamp(6rem,10vw,10rem)] ${className}`}
    >
      {children}
    </motion.section>
  );
}
