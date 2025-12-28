"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function MerchHeroVideo() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const isInView = useInView(sectionRef, { amount: 0.6 });
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  /* ---------- Unlock audio ONCE (browser rule) ---------- */
  useEffect(() => {
    const unlock = () => {
      setAudioUnlocked(true);
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("scroll", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("scroll", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("scroll", unlock);
    };
  }, []);

  /* ---------- Play / Pause based on view ---------- */
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    if (isInView) {
      video.play().catch(() => {});
      if (audioUnlocked) {
        audio.volume = 0.6;
        audio.play().catch(() => {});
      }
    } else {
      video.pause();
      audio.pause();
    }
  }, [isInView, audioUnlocked]);

  /* ---------- Stop audio & video when tab changes ---------- */
  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current;
      const audio = audioRef.current;
      if (!video || !audio) return;

      if (document.hidden) {
        video.pause();
        audio.pause();
      } else if (isInView) {
        video.play().catch(() => {});
        if (audioUnlocked) audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [isInView, audioUnlocked]);

  /* ---------- Scroll button ---------- */
  const scrollToContent = () => {
    const next = sectionRef.current?.nextElementSibling;
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="hero">
      {/* Video */}
      <video
        ref={videoRef}
        src="/merch-drop.mp4"
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Audio */}
      <audio ref={audioRef} src="/merch-theme.mp3" loop />

      {/* Overlay */}
      <div className="overlay">
        <h1>NEW DROP</h1>
        <p>Electra Oversized Tee</p>
        <button onClick={scrollToContent}>SHOP NOW</button>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: black;
        }

        video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .overlay {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.85)
          );
          padding: 0 1rem;
        }

        h1 {
          font-size: clamp(3rem, 7vw, 4.8rem);
          letter-spacing: 0.18em;
          margin-bottom: 0.6rem;
        }

        p {
          opacity: 0.85;
          margin-bottom: 1.8rem;
        }

        button {
          padding: 0.75rem 2rem;
          border: 1px solid white;
          background: transparent;
          color: white;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        button:hover {
          background: white;
          color: black;
        }
      `}</style>
    </section>
  );
}
