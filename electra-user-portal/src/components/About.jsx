"use client";

import { motion } from "framer-motion";

const INTRO_TEXT =
  "Electra Society is the official student body of the Electrical Engineering Department at NIT Silchar.";

const DETAIL_TEXT =
  "Electra Society is the official student body of the Electrical Engineering Department at NIT Silchar. We focus on hands-on learning, real-world projects, and a strong culture of mentorship across power systems, electronics, embedded design, and intelligent software. Guided by faculty and supported by an active alumni network, Electra enables students to prototype, publish, compete, and collaborate with industry.";

export default function AboutFramer() {
  return (
    <section className="about">
      <motion.div
        className="wrap"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="eyebrow">ABOUT</span>

        <h2>
          Engineering ideas into <span>real-world impact</span>
        </h2>

        <p className="intro">{INTRO_TEXT}</p>

        <div className="divider" />

        <p className="detail">{DETAIL_TEXT}</p>
      </motion.div>

      <style jsx>{`
        .about {
          background: #000;
          padding: 9rem 6vw;
        }

        .wrap {
          max-width: 960px;
          margin: 0 auto;
        }

        .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          color: #9ca3af;
          margin-bottom: 1.4rem;
          display: block;
        }

        h2 {
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #ffffff;
          margin-bottom: 2.4rem;
        }

        h2 span {
          color: #7dd3fc; /* single soft accent */
        }

        .intro {
          max-width: 720px;
          font-size: 1.1rem;
          line-height: 1.75;
          color: #d1d5db;
          margin-bottom: 3rem;
        }

        .divider {
          width: 80px;
          height: 1px;
          background: rgba(255,255,255,0.15);
          margin-bottom: 3rem;
        }

        .detail {
          max-width: 820px;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .about {
            padding: 6rem 6vw;
          }
        }
      `}</style>
    </section>
  );
}
