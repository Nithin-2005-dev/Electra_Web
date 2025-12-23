"use client";

import React from "react";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

const COLORS = { neon1: "#00e5ff", neon2: "#0077ff" };

export default function Footer() {
  return (
    <footer className="relative mt-10 w-full">
      <style jsx>{`
        .topNeon {
          position: absolute; left: 0; right: 0; top: 0; height: 2px;
          background: linear-gradient(90deg, ${COLORS.neon1}, ${COLORS.neon2});
          box-shadow: 0 0 10px ${COLORS.neon1}, 0 0 20px ${COLORS.neon2};
        }
        .bleed {
          position: relative;
          left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw; width: 100vw;
        }
        .panel {
          border: 1px solid var(--border-subtle);
          background:
            radial-gradient(900px 600px at -10% -20%, rgba(0,229,255,.06), transparent 65%),
            radial-gradient(900px 600px at 110% 120%, rgba(0,119,255,.06), transparent 65%),
            linear-gradient(180deg, rgba(18,18,18,.9), rgba(10,10,10,.62));
          box-shadow: inset 0 0 28px rgba(0,229,255,.03), 0 18px 46px rgba(0,0,0,.45);
          border-radius: 0;
          padding-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
        }
        .inner { max-width: 1150px; margin: 0 auto; padding: 1rem 1rem; }
        @media (min-width: 640px) { .inner { padding: 2rem 1.5rem; } }

        .sectionTitle { color: var(--text-primary); text-transform: uppercase; letter-spacing: .08em; text-shadow: 0 0 14px rgba(0,229,255,.16); }
        .icon { color: ${COLORS.neon1}; filter: drop-shadow(0 0 6px rgba(0,229,255,.35)); flex-shrink: 0; }
        .hit { padding: 10px 12px; border-radius: 10px; transition: background .15s ease, color .15s ease, text-shadow .15s ease; }
        .hit:where(:hover,:focus-visible) { background: rgba(255,255,255,.02); outline: none; }
        .link { color: var(--text-secondary); } .link:hover { color: ${COLORS.neon1}; text-shadow: 0 0 8px ${COLORS.neon1}; }
        .mobileDivider { height:1px; border:none; background:linear-gradient(90deg,transparent,rgba(0,229,255,.18),transparent); margin:14px 0; }
        @media (min-width:768px){ .mobileDivider{ display:none; } }
        .divider { height:1px; border:none; background:linear-gradient(90deg,transparent,rgba(0,229,255,.18),transparent); }
        .power{ position:absolute; right:12px; bottom:12px; z-index:1; width:44px; height:44px; border-radius:12px; border:1px solid rgba(255,255,255,.08); background:rgba(18,18,18,.66); color:${COLORS.neon1}; box-shadow:0 0 0 1px rgba(255,255,255,.02), 0 12px 28px rgba(0,0,0,.45), inset 0 0 10px rgba(0,229,255,.12); display:flex; align-items:center; justify-content:center; transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease; }
        .power:hover{ transform:translateY(-2px); border-color:rgba(255,255,255,.12); box-shadow:0 0 0 1px rgba(0,229,255,.12), 0 16px 36px rgba(0,0,0,.55), inset 0 0 14px rgba(0,229,255,.18); }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) { .icon{filter:none} .panel{box-shadow:0 18px 46px rgba(0,0,0,.45)} }
      `}</style>

      <div className="topNeon" aria-hidden />

      <div className="bleed">
        <div className="panel" role="contentinfo">
          <div className="inner">
            {/* Small screens: stacked; Large screens: edges + centered logo row */}
            {/* Row for large screens: left contact, center logo, right social */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:items-start lg:gap-8">
              {/* Left edge: Contact */}
              <section aria-labelledby="footer-contact-lg">
                <h3 id="footer-contact-lg" className="sectionTitle text-sm font-bold mb-4">Contact</h3>
                <ul className="space-y-3.5">
                  <li><a href="mailto:societyelectra@gmail.com" className="hit flex items-center gap-3"><MdEmail className="icon text-xl"/><span className="link text-[15px]">societyelectra@gmail.com</span></a></li>
                  <li><a href="tel:+91 8793248290" className="hit flex items-center gap-3"><FaPhoneAlt className="icon text-xl"/><span className="link text-[15px]">+91 8793248290</span></a></li>
                  <li><a href="https://wa.me/916291090769?text=Hello%2C%20I%20visited%20the%20Electra%20Society%20website." target="_blank" rel="noreferrer" className="hit flex items-center gap-3"><IoLogoWhatsapp className="icon text-xl"/><span className="link text-[15px]">WhatsApp</span></a></li>
                </ul>
              </section>

              {/* Center: Logo */}
              <section aria-labelledby="footer-brand-lg" className="flex flex-col items-center justify-start">
                <h3 id="footer-brand-lg" className="sr-only">Brand</h3>
                <div className="rounded-full overflow-hidden ring-1 ring-cyan-300/25 shadow-[0_0_24px_rgba(0,255,255,0.2)]">
                  <img
                    src="https://res.cloudinary.com/dqa3ov76r/image/upload/v1729535834/favoritePhotos/ldlchr4ijcpgfq8nu2gx.jpg"
                    alt="Electra Society, NIT Silchar logo"
                    width="132" height="132"
                    className="block object-cover w-[132px] h-[132px]"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-300/90 text-center leading-relaxed">
                  Electra Society, NIT Silchar
                </p>
              </section>

              {/* Right edge: Social */}
              <nav aria-labelledby="footer-social-lg" className="lg:justify-self-end">
                <h3 id="footer-social-lg" className="sectionTitle text-sm font-bold mb-4">Follow</h3>
                <ul className="space-y-3.5">
                  <li><a href="https://www.instagram.com/electrasociety/?__pwa=1" target="_blank" rel="noreferrer" className="hit flex items-center gap-3"><FaInstagram className="icon text-xl"/><span className="link text-[15px]">Instagram</span></a></li>
                  <li><a href="https://www.facebook.com/groups/electra.nits" target="_blank" rel="noreferrer" className="hit flex items-center gap-3"><FaFacebook className="icon text-xl"/><span className="link text-[15px]">Facebook</span></a></li>
                  <li><a href="https://www.linkedin.com/company/electrical-engineering-society-nit-silchar/posts/?feedView=all" target="_blank" rel="noreferrer" className="hit flex items-center gap-3"><FaLinkedin className="icon text-xl"/><span className="link text-[15px]">LinkedIn</span></a></li>
                </ul>
              </nav>
            </div>

            {/* Mobile / Tablet layout: stack (Brand → Contact → Social) */}
            <div className="grid grid-cols-1 gap-6 lg:hidden">
              {/* Brand */}
              <section aria-labelledby="footer-brand" className="flex flex-col items-center justify-center">
                <h3 id="footer-brand" className="sr-only">Brand</h3>
                <div className="rounded-full overflow-hidden ring-1 ring-cyan-300/25 shadow-[0_0_20px_rgba(0,255,255,0.18)]">
                  <img
                    src="https://res.cloudinary.com/dqa3ov76r/image/upload/v1729535834/favoritePhotos/ldlchr4ijcpgfq8nu2gx.jpg"
                    alt="Electra Society, NIT Silchar logo"
                    width="104" height="104"
                    className="block object-cover w-[104px] h-[104px]"
                  />
                </div>
                <p className="mt-3 text-[12px] text-slate-300/90 text-center leading-relaxed">
                  Electra Society, NIT Silchar
                </p>
                <hr className="mobileDivider" />
              </section>

              {/* Contact */}
              <section aria-labelledby="footer-contact" >
                <h3 id="footer-contact" className="sectionTitle text-[12px] font-bold mb-3">Contact</h3>
                <ul className="space-y-2.5">
                  <li><a href="mailto:societyelectra@gmail.com" className="hit flex items-center gap-3"><MdEmail className="icon text-xl"/><span className="link text-[14px]">societyelectra@gmail.com</span></a></li>
                  <li><a href="tel:+91 8793248290" className="hit flex items-center gap-3"><FaPhoneAlt className="icon text-xl"/><span className="link text-[14px]">+91 8793248290</span></a></li>
                  <li><a href="https://api.whatsapp.com/send?phone=918793248290&text=Hello%2C%20I%20visited%20the%20electra%20society%20website." target="_blank" rel="noreferrer" className="hit flex items-center gap-3"><IoLogoWhatsapp className="icon text-xl"/><span className="link text-[14px]">WhatsApp</span></a></li>
                </ul>
                <hr className="mobileDivider" />
              </section>

              {/* Social */}
              <nav aria-labelledby="footer-social">
                <h3 id="footer-social" className="sectionTitle text-[12px] font-bold mb-3">Follow</h3>
                <ul className="space-y-2.5">
                  <li><a href="https://www.instagram.com/electrasociety/?__pwa=1" target="_blank" rel="noreferrer" className="hit flex items-center gap-3"><FaInstagram className="icon text-xl"/><span className="link text-[14px]">Instagram</span></a></li>
                  <li><a href="https://www.facebook.com/groups/electra.nits" target="_blank" rel="noreferrer" className="hit flex items-center gap-3"><FaFacebook className="icon text-xl"/><span className="link text-[14px]">Facebook</span></a></li>
                  <li><a href="https://www.linkedin.com/company/electrical-engineering-society-nit-silchar/posts/?feedView=all" target="_blank" rel="noreferrer" className="hit flex items-center gap-3"><FaLinkedin className="icon text-xl"/><span className="link text-[14px]">LinkedIn</span></a></li>
                </ul>
              </nav>
            </div>

            <hr className="divider my-5 sm:my-7" />

            <div className="text-center text-slate-300/85 space-y-1">
              <p className="text-[12px] sm:text-sm">© 2024 Electra Society, NIT Silchar</p>
              <p className="text-[12px] sm:text-sm">All rights reserved</p>
              <p className="text-[12px] sm:text-sm">Designed and developed by Electra Society Development Team</p>
            </div>

            {/* <button
              type="button"
              aria-label="Scroll to top"
              className="power"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v9" stroke={COLORS.neon1} strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="14" r="7" stroke={COLORS.neon1} strokeWidth="2" />
              </svg>
            </button> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
