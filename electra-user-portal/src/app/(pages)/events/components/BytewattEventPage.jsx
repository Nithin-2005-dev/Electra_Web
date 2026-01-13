"use client"
export default function BytewattEventPage() {
  const register = () => {
    window.open(
      "https://forms.gle/RnuYZ8GGbBYnvwhw8",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <main className="page">
        {/* ───────── HERO ───────── */}
        <section className="hero">
          <div className="heroOverlay" />

          <div className="heroContent">
            <span className="org">
              ELECTRA SOCIETY × COMPUTER SCIENCE SOCIETY
            </span>

            <h1>BYTEWATT</h1>

            <p className="tagline">Fake it Till You Make It</p>

            <p className="heroDesc">
              A high-stakes, mind-driven competition where confidence,
              strategy, and presence decide the winner.
            </p>

            <div className="heroActions">
              <button className="primary" onClick={register}>
                Register Now
              </button>
              <span className="deadline">
                Deadline · <strong>14 Jan 2026</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ───────── ABOUT ───────── */}
        <section className="section">
          <div className="sectionHeader">
            <h2>About BYTEWATT</h2>
            <span className="line" />
          </div>

          <p className="text">
            Think you’ve got sharp instincts, quick wit, and the confidence to lead?
            BYTEWATT is designed for individuals who thrive under pressure,
            enjoy mind games, and can command a room when it matters.
          </p>

          <p className="text">
            This is not about technical knowledge alone — it’s about how you think,
            react, communicate, and present yourself in high-pressure situations.
          </p>
        </section>

        {/* ───────── ROUNDS ───────── */}
        <section className="section dark">
          <div className="sectionHeader">
            <h2>Competition Structure</h2>
            <span className="line" />
          </div>

          <div className="rounds">
            <div className="roundCard">
              <span className="roundNo">01</span>
              <h3>The Traitor in the Grid</h3>
              <p>
                A psychological and logical elimination round.
                Observation, pattern recognition, and strategic thinking
                are the keys to survival.
              </p>
            </div>

            <div className="roundCard">
              <span className="roundNo">02</span>
              <h3>The Interview Reboot</h3>
              <p>
                A simulated professional interview.
                Your confidence, clarity, decision-making, and communication
                will be tested under pressure.
              </p>
            </div>
          </div>
        </section>

        {/* ───────── GUIDELINES ───────── */}
        <section className="section">
          <div className="sectionHeader">
            <h2>Important Guidelines</h2>
            <span className="line" />
          </div>

          <ul className="guidelines">
            <li>Individual participation only</li>
            <li>Further round details will be revealed on the spot</li>
            <li>Professionalism and decorum are mandatory</li>
            <li>Judges’ decisions will be final and binding</li>
          </ul>
        </section>

        {/* ───────── CTA ───────── */}
        <section className="ctaSection">
          <h2>Ready to Prove Yourself?</h2>
          <p>
            Register now and step into one of the most
            competitive non-technical events of Technoesis 2026.
          </p>

          <button className="primary big" onClick={register}>
            Register on Google Form
          </button>

          <p className="note">
            After registration, make sure to join the WhatsApp group for updates.
          </p>
        </section>

        {/* ───────── FOOTER ───────── */}
        <footer className="footer">
          <p>
            Organized by <strong>Electra Society</strong> &{" "}
            <strong>Computer Science Society</strong>
          </p>
          <span>NIT Silchar · Technoesis 2026</span>
        </footer>

        {/* ───────── STYLES ───────── */}
        <style jsx>{`
          .page {
            background: #000;
            color: #fff;
          }

          .hero {
            position: relative;
            min-height: 100vh;
            display: grid;
            place-items: center;
            overflow: hidden;
            background: radial-gradient(
              120% 120% at 50% 0%,
              #1b1b1b 0%,
              #000 65%
            );
          }

          .heroOverlay {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(to bottom, rgba(0,0,0,0.2), #000),
              radial-gradient(circle at top, rgba(34,211,238,0.15), transparent 55%);
          }

          .heroContent {
            position: relative;
            z-index: 2;
            max-width: 820px;
            text-align: center;
            padding: 2rem;
          }

          .org {
            font-size: 0.75rem;
            letter-spacing: 0.25em;
            color: #9ca3af;
          }

          h1 {
            font-size: clamp(3.2rem, 8vw, 5.2rem);
            letter-spacing: 0.18em;
            margin: 0.6rem 0;
          }

          .tagline {
            font-size: 1.1rem;
            opacity: 0.85;
            margin-bottom: 1.2rem;
          }

          .heroDesc {
            font-size: 0.95rem;
            color: #d1d5db;
            line-height: 1.7;
            margin-bottom: 2rem;
          }

          .heroActions {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
          }

          .deadline {
            font-size: 0.8rem;
            color: #9ca3af;
          }

          .primary {
            padding: 0.85rem 2.4rem;
            border-radius: 999px;
            border: 1px solid #22d3ee;
            background: rgba(34,211,238,0.15);
            color: #22d3ee;
            font-weight: 600;
            letter-spacing: 0.12em;
            cursor: pointer;
            transition: all 0.25s ease;
          }

          .primary:hover {
            background: #22d3ee;
            color: #000;
          }

          .section {
            max-width: 1000px;
            margin: auto;
            padding: 4rem 1.5rem;
          }

          .section.dark {
            background: linear-gradient(180deg, #0b0b0b, #000);
          }

          .sectionHeader {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.6rem;
          }

          .line {
            flex: 1;
            height: 1px;
            background: rgba(255,255,255,0.12);
          }

          .rounds {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.6rem;
          }

          .roundCard {
            position: relative;
            padding: 1.8rem;
            border-radius: 22px;
            background: linear-gradient(180deg, #121212, #0b0b0b);
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          }

          .roundNo {
            position: absolute;
            top: -16px;
            right: 18px;
            font-size: 3.2rem;
            font-weight: 800;
            opacity: 0.08;
          }

          .ctaSection {
            text-align: center;
            padding: 4.5rem 1.5rem;
            background: radial-gradient(
              120% 120% at 50% 0%,
              #141414 0%,
              #000 70%
            );
          }

          .footer {
            padding: 2rem;
            text-align: center;
            font-size: 0.75rem;
            color: #9ca3af;
          }
        `}</style>
      </main>
    </>
  );
}