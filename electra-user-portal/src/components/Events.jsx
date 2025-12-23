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
      <div className="header">
        <span className="eyebrow">EVENTS</span>
        <h2>Signature experiences</h2>
      </div>

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
        /* SECTION */
        .events {
          position: relative;
          background: radial-gradient(circle at top, #0c1016, #000 65%);
          padding: 8rem 0;
          overflow: hidden;
        }

        /* HEADER */
        .header {
          padding: 0 6vw 3.5rem;
        }

        .eyebrow {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          color: #14f7ff;
          margin-bottom: 0.9rem;
        }

        h2 {
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 800;
          color: #f2f6ff;
        }

        /* TRACK */
        .track-wrapper {
          overflow: hidden;
        }

        .track {
          display: flex;
          gap: 48px;
          padding: 0 6vw;
          will-change: transform;
        }

        /* CARD – UPDATED SIZE */
        .card {
          min-width: 400px;   /* wider */
          height: 380px;      /* shorter */
          padding: 2.4rem 2.6rem;
          border-radius: 24px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.075),
            rgba(255, 255, 255, 0.015)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .card:hover {
          transform: translateY(-10px);
          border-color: rgba(20, 247, 255, 0.6);
          box-shadow:
            0 30px 70px rgba(0, 0, 0, 0.85),
            0 0 22px rgba(20, 247, 255, 0.35);
        }

        .icon {
          font-size: 2.4rem;
          color: #14f7ff;
          margin-bottom: 1.4rem;
          text-shadow: 0 0 14px rgba(20, 247, 255, 0.5);
        }

        h3 {
          font-size: 1.7rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .tagline {
          font-size: 1rem;
          color: #7df9ff;
          margin-bottom: 1.2rem;
        }

        .desc {
          font-size: 0.98rem;
          line-height: 1.65;
          color: #b6c3cf;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .card {
            min-width: 300px;
            height: 320px;
          }
        }
      `}</style>
    </section>
  );
}
