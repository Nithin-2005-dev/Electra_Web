"use client";

import { CldImage } from "next-cloudinary";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

export default function TeamCard({ ele }) {
  return (
    <article className="team-card">
      {/* IMAGE */}
      <div className="image-wrap">
        {ele.publicId ? (
          <CldImage
            src={ele.publicId}
            width="600"
            height="800"
            crop="fill"
            gravity="face"
            quality="auto"
            format="auto"
            alt={ele.name}
            className="image"
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      {/* CONTENT */}
      <div className="content">
        <p className="role">{ele.position}</p>
        <h3 className="name">{ele.name}</h3>

        {(ele.linkedin || ele.linkdin || ele.insta || ele.fb) && (
          <div className="socials">
            {(ele.linkedin || ele.linkdin) && (
              <a
                href={ele.linkedin || ele.linkdin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            )}
            {ele.insta && (
              <a
                href={ele.insta}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            )}
            {ele.fb && (
              <a
                href={ele.fb}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
            )}
          </div>
        )}
      </div>

      {/* STYLES */}
      <style jsx>{`
        /* ───────── CARD ───────── */
        .team-card {
          width: 100%;
          max-width: 260px;
          background: linear-gradient(
            180deg,
            rgba(10, 15, 25, 0.9),
            rgba(2, 4, 9, 1)
          );
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .team-card:hover {
          transform: translateY(-8px);
          border-color: rgba(34, 211, 238, 0.35);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
        }

        /* ───────── IMAGE ───────── */
        .image-wrap {
          width: 100%;
          aspect-ratio: 3 / 4;
          background: #020409;
          overflow: hidden;
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .team-card:hover .image {
          transform: scale(1.07);
        }

        .no-image {
          height: 100%;
          display: grid;
          place-items: center;
          font-size: 0.8rem;
          color: #64748b;
        }

        /* ───────── CONTENT ───────── */
        .content {
          padding: 14px 14px 16px;
          text-align: center;
        }

        .role {
          font-size: 0.62rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #22d3ee;
          opacity: 0.85;
          margin-bottom: 6px;
        }

        .name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
          margin-bottom: 12px;
        }

        /* ───────── SOCIALS ───────── */
        .socials {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .socials a {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 13px;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.04);
          transition: all 0.25s ease;
        }

        .socials a:hover {
          color: #ffffff;
          background: rgba(34, 211, 238, 0.18);
          transform: translateY(-2px);
        }

        /* ───────── RESPONSIVE ───────── */
        @media (max-width: 640px) {
          .team-card {
            max-width: 100%;
          }

          .name {
            font-size: 1rem;
          }
        }
      `}</style>
    </article>
  );
}
