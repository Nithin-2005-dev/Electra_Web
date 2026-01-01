"use client";

import { motion } from "framer-motion";

export default function AboutFramer() {
  return (
    <section className="about">
      {/* Ambient light */}
      <div className="ambient" />

      {/* Grain */}
      <div className="grain" />

      <motion.div
        className="wrap_about"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-140px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="eyebrow">ABOUT ELECTRA</span>

        <h2>
          Engineering ideas into
          <br />
          <span>real-world impact</span>
        </h2>

        <p className="intro">
          Electra Society is the{" "}
          <strong>official student body</strong> of the Electrical Engineering
          Department at <strong>NIT Silchar</strong>.
        </p>

        <div className="divider" />

        <p className="detail">
          We focus on <strong>hands-on learning</strong>, real-world projects,
          and a culture of <strong>deep technical mentorship</strong> across
          power systems, electronics, embedded design, and intelligent software.
          <br />
          <br />
          Guided by faculty and strengthened by an active alumni network,
          Electra enables students to <strong>prototype</strong>,{" "}
          <strong>publish</strong>, <strong>compete</strong>, and collaborate
          with industry.
        </p>
      </motion.div>

      <style jsx>{`
        .about {
          position: relative;
          background: #000;
          padding: 11rem 6vw;
          overflow: hidden;
        }

        /* Directional light (Framer-style) */
        .ambient {
          position: absolute;
          top: -40%;
          right: -20%;
          width: 1400px;
          height: 800px;
          background: radial-gradient(
            50% 50%,
            rgba(255, 255, 255, 0.12),
            transparent 70%
          );
          filter: blur(160px);
          pointer-events: none;
        }

        /* Film grain */
        .grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .wrap_about {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Eyebrow */
        .eyebrow {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 1.8rem;
        }

        /* Heading */
        h2 {
          font-family: "Inter", system-ui, sans-serif;
          font-size: clamp(3rem, 5.8vw, 4.6rem);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.045em;
          color: #fff;
          margin-bottom: 3rem;
        }

        h2 span {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 700;
        }

        /* Intro */
        .intro {
          max-width: 760px;
          font-size: 1.2rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.78);
          margin-bottom: 4rem;
        }

        .intro strong {
          font-weight: 600;
          color: #fff;
        }

        /* Divider */
        .divider {
          width: 110px;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0)
          );
          margin-bottom: 4rem;
        }

        /* Detail */
        .detail {
          max-width: 880px;
          font-size: 1.05rem;
          line-height: 2;
          color: rgba(255, 255, 255, 0.55);
        }

        .detail strong {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .about {
            padding: 8rem 6vw;
          }

          h2 {
            font-size: clamp(2.5rem, 8vw, 3.4rem);
          }
        }
      `}</style>
    </section>
  );
}
