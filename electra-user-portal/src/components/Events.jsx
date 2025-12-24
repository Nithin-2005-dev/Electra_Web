"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EventData } from "../app/utils/Eventsdata";

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const scrollLength = track.scrollWidth - window.innerWidth;
    if (scrollLength <= 0) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollLength,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollLength}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="events">
      {/* EventsHeader */}
      <div className="EventsHeader">
        <span className="eyebrow">EVENTS</span>
        <h2>Signature experiences</h2>
        <p className="sub">
          Flagship initiatives crafted to challenge, inspire, and elevate.
        </p>
      </div>

      {/* TRACK */}
      <div className="track-wrapper">
        <div className="track" ref={trackRef}>
          {EventData.map((event, idx) => (
            <div className="card" key={idx}>
              <div className="icon">{event.icon}</div>
              <h3>{event.title}</h3>
              <p className="tagline">{event.eventTagline}</p>
              <p className="desc">{event.eventDescription}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* ===== SECTION ===== */
        .events {
          position: relative;
          background: radial-gradient(
              120% 80% at 50% 0%,
              rgba(255, 255, 255, 0.05),
              transparent 60%
            ),
            #000;
          padding: 8rem 0;
          overflow: hidden;
        }

        /* ===== EventsHeader ===== */
        .EventsHeader {
          max-width: 1150px;
          margin: 0 auto 4rem;
          padding: 0 6vw;
        }

        .eyebrow {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.32em;
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .EventsHeader h2 {
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #ffffff;
          margin-bottom: 0.8rem;
        }

        .sub {
          max-width: 520px;
          font-size: 1rem;
          color: #9ca3af;
        }

        /* ===== TRACK ===== */
        .track-wrapper {
          overflow: hidden;
        }

        .track {
          display: flex;
          gap: 3rem;
          padding: 0 max(6vw, calc((100vw - 1150px) / 2));
          will-change: transform;
        }

        /* ===== CARD ===== */
        .card {
          flex: 0 0 auto;
          width: 420px;
          min-height: 360px;
          padding: 2.6rem 2.8rem;
          border-radius: 26px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.06),
            rgba(255, 255, 255, 0.015)
          );
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          box-shadow: 0 35px 80px rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 45px 100px rgba(0, 0, 0, 0.85);
        }

        /* ===== CONTENT ===== */
        .icon {
          font-size: 2.2rem;
          color: #ffffff;
          margin-bottom: 1.6rem;
          opacity: 0.9;
        }

        .card h3 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.6rem;
        }

        .tagline {
          font-size: 0.95rem;
          color: #9ca3af;
          margin-bottom: 1.2rem;
        }

        .desc {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #cbd5e1;
        }

        /* ===== MOBILE ===== */
        @media (max-width: 900px) {
          .track {
            gap: 1.5rem;
            padding: 0 6vw;
          }

          .card {
            width: 300px;
            min-height: 320px;
            padding: 2rem;
          }

          .EventsHeader {
            margin-bottom: 3rem;
          }
        }
      `}</style>
    </section>
  );
}
