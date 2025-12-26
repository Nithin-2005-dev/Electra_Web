"use client";

import Link from "next/link";
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  const navs = [{
    name: "Home",
    link: "/",
  }, {
    name: "Gallery",
    link: "/Gallery",
  },{
    name: "Resources",
    link: "/Resources",
  },{
    name: "Team",
    link: "/Team",
  },{
    name: "Merch",
    link: "/gotyourmerch",
  },{
    name:"Dashboard",
    link:"/dashboard",
  }
]
  return (
    <footer className="relative bg-black overflow-hidden">
      {/* soft top divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 items-start">

          {/* BRAND */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dqa3ov76r/image/upload/v1766745932/dawnld1jgn6kzelqpg03.png"
                alt="Electra Society Logo"
                className="w-11"
              />
              <span className="text-xl font-semibold text-white tracking-tight">
                Electra Society
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              The official student body of the Electrical Engineering Department
              at NIT Silchar — fostering hands-on learning, real-world
              engineering, and industry collaboration.
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Navigation
            </h4>

            <div className=" text-slate-300 flex flex-col gap-1">
              {navs.map((item) => (
                <Link href={item.link}
                  key={item.name}
                  className="w-fit cursor-pointer transition hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CONNECT */}
          <div className="space-y-5">
            <h4 className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Connect
            </h4>

            <div className="flex items-center gap-3 text-slate-300 hover:text-white transition">
              <MdEmail className="text-lg" />
              <span className="text-sm">societyelectra@gmail.com</span>
            </div>

            <div className="flex gap-5 pt-2 text-xl text-slate-400">
              <a
                href="https://www.instagram.com/electrasociety/"
                target="_blank"
                className="transition hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/electrical-engineering-society-nit-silchar/"
                target="_blank"
                className="transition hover:text-white"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.facebook.com/groups/electra.nits"
                target="_blank"
                className="transition hover:text-white"
              >
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} Electra Society, NIT Silchar
          </span>
          <span>
            Designed & developed by Electra Dev Team
          </span>
        </div>
      </div>

      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white/5 to-transparent" />
    </footer>
  );
}
