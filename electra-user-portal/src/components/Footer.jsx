"use client";

import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="relative bg-black">
      {/* subtle top divider like hero */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* LEFT — BRAND */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dqa3ov76r/image/upload/v1729535834/favoritePhotos/ldlchr4ijcpgfq8nu2gx.jpg"
                alt="Electra Society Logo"
                className="w-10 h-10 rounded-full ring-1 ring-cyan-400/30"
              />
              <span className="text-lg font-semibold text-white tracking-tight">
                Electra
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Electra Society is the official student body of the Electrical
              Engineering Department at NIT Silchar, driving hands-on learning,
              real-world projects, and industry collaboration.
            </p>
          </div>

          {/* CENTER — LINKS */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-cyan-400">
              Navigate
            </h4>

            <ul className="space-y-2 text-slate-300">
              {["Home", "Gallery", "Resources", "Team", "Merch"].map((item) => (
                <li
                  key={item}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — CONTACT */}
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-cyan-400">
              Connect
            </h4>

            <div className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition">
              <MdEmail />
              <span className="text-sm">societyelectra@gmail.com</span>
            </div>

            <div className="flex gap-4 pt-2 text-xl text-slate-400">
              <a
                href="https://www.instagram.com/electrasociety/"
                target="_blank"
                className="hover:text-cyan-400 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/electrical-engineering-society-nit-silchar/"
                target="_blank"
                className="hover:text-cyan-400 transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.facebook.com/groups/electra.nits"
                target="_blank"
                className="hover:text-cyan-400 transition"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Electra Society, NIT Silchar</span>
          <span>Designed & developed by Electra Dev Team</span>
        </div>
      </div>
    </footer>
  );
}
