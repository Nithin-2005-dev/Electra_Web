"use client";

export default function SignInRequiredPopup({
  open,
  secondsLeft = 5,
  onContinue,
  title = "Sign-in required",
  message = "Please sign in to continue.",
}) {
  if (!open) return null;

  const safeSeconds = Math.max(0, secondsLeft);
  const progress = ((5 - safeSeconds) / 5) * 100;

  return (
    <div className="signin-required-overlay" role="alert" aria-live="assertive">
      <div className="signin-required-card">
        <span className="kicker">SECURE ACCESS</span>
        <div className="icon">!</div>
        <h2>{title}</h2>
        <p>
          {message}
          <br />
          Redirecting in {safeSeconds}s.
        </p>

        <div className="progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <button onClick={onContinue}>Continue to Sign in</button>
      </div>

      <style jsx>{`
        .signin-required-overlay {
          position: fixed;
          inset: 0;
          z-index: 1200;
          display: grid;
          place-items: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.86);
          backdrop-filter: blur(8px);
        }

        .signin-required-card {
          position: relative;
          width: 100%;
          max-width: 520px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: linear-gradient(
            160deg,
            rgba(8, 8, 8, 0.96),
            rgba(20, 20, 20, 0.95) 62%,
            rgba(12, 12, 12, 0.97)
          );
          padding: 1.25rem 1.05rem 1.1rem;
          text-align: center;
          box-shadow:
            0 24px 64px rgba(0, 0, 0, 0.72),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .signin-required-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            );
          background-size: 100% 4px;
          opacity: 0.28;
        }

        .kicker {
          position: relative;
          display: inline-block;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: #a3a3a3;
          margin-bottom: 0.6rem;
        }

        .icon {
          position: relative;
          width: 42px;
          height: 42px;
          margin: 0 auto 0.7rem;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.08);
          color: #f3f4f6;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-weight: 800;
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.03);
        }

        h2 {
          position: relative;
          margin: 0;
          color: #ffffff;
          font-size: clamp(1.2rem, 4vw, 1.75rem);
          letter-spacing: 0.01em;
        }

        p {
          position: relative;
          margin: 0.7rem 0 1rem;
          color: #d1d5db;
          line-height: 1.5;
        }

        .progress {
          position: relative;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          transition: width 0.6s ease;
          background: linear-gradient(90deg, #f3f4f6, #9ca3af);
        }

        button {
          position: relative;
          width: 100%;
          height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-weight: 700;
          color: #000000;
          background: linear-gradient(180deg, #ffffff, #e5e7eb);
          cursor: pointer;
          transition: transform 0.16s ease, box-shadow 0.22s ease;
        }

        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.16);
        }

        @media (min-width: 640px) {
          .signin-required-card {
            padding: 1.9rem 1.7rem 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
