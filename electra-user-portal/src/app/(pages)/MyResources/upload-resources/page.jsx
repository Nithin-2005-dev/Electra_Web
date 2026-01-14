"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { SubjectData } from "../../../utils/Subjects";

/* ===============================
   CLIENT ONLY
================================ */
function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return children;
}

/* ===============================
   HELPERS
================================ */
function getSubjectsBySemester(semester) {
  const sem = SubjectData.find(
    (s) => String(s.semester) === String(semester)
  );
  return sem ? sem.subjects : [];
}

function normalizeDriveUrl(url) {
  if (!url) return "";
  let clean = url.trim().replace(/\/$/, "");
  if (!clean.endsWith("/preview")) clean += "/preview";
  return clean;
}

/* ===============================
   PAGE EXPORT
================================ */
export default function UploadResourcePage() {
  return (
    <ClientOnly>
      <UploadResourceInner />
    </ClientOnly>
  );
}

/* ===============================
   MAIN
================================ */
function UploadResourceInner() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    driveUrl: "",
    semester: "",
    subject: "",
    category: "",
    visibility: "private",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return router.push("/");
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await user.getIdToken();

      await axios.post(
        "/api/resources/upload",
        {
          ...form,
          subject: form.subject.toLowerCase(),
          driveUrl: normalizeDriveUrl(form.driveUrl),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push("/MyResources");
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="root">
        {/* HEADER */}
        <header className="header">
          <span className="kicker">UPLOAD</span>
          <h1>Academic Resource</h1>
          <p>
            Contribute notes, books or PYQs.
            <br />
            You decide who sees them.
          </p>
        </header>

        {/* FORM */}
        <form className="card" onSubmit={handleSubmit}>
          {/* SECTION */}
          <Section >
            <Field label="Resource Name">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Unit 1 Control Systems Notes"
                required
              />
            </Field>

            <Field label="Google Drive Link">
              <input
                value={form.driveUrl}
                onChange={(e) =>
                  setForm({ ...form, driveUrl: e.target.value })
                }
                placeholder="https://drive.google.com/file/d/..."
                required
              />
            </Field>
          </Section>

          {/* SECTION */}
          <Section>
            <div className="grid">
              <Field label="Semester">
                <select
                  value={form.semester}
                  onChange={(e) => {
                    const sem = e.target.value;
                    setForm({ ...form, semester: sem, subject: "" });
                    setAvailableSubjects(getSubjectsBySemester(sem));
                  }}
                  required
                >
                  <option value="">Select</option>
                  {SubjectData.map((s) => (
                    <option key={s.semester} value={s.semester}>
                      Semester {s.semester}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Subject">
                <select
                  value={form.subject}
                  disabled={!availableSubjects.length}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  required
                >
                  <option value="">
                    {availableSubjects.length
                      ? "Select"
                      : "Select semester first"}
                  </option>
                  {availableSubjects.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              >
                <option value="">Select</option>
                <option value="notes">Notes</option>
                <option value="books">Books</option>
                <option value="pyqs">PYQs</option>
                <option value="assignments">Assignments</option>
              </select>
            </Field>
          </Section>

          {/* SECTION */}
          <Section>
            <Field label="Who can access this resource?">
              <select
                value={form.visibility}
                onChange={(e) =>
                  setForm({ ...form, visibility: e.target.value })
                }
              >
                <option value="private">Private (only me)</option>
                <option value="public">Public (everyone)</option>
              </select>
            </Field>
          </Section>

          {error && <p className="error">{error}</p>}

          {/* ACTIONS */}
          <div className="actions">
            <button className="primary" disabled={loading}>
              {loading ? "Uploading…" : "Upload"}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => router.push("/MyResources")}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .root {
          min-height: 100vh;
          background: #000;
          color: #e5e7eb;
          padding: 4rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .kicker {
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          color: #6b7280;
        }

        h1 {
          font-size: 2.6rem;
          margin: 0.6rem 0;
          color: #fff;
        }

        .header p {
          color: #9ca3af;
          font-size: 0.95rem;
        }

        .card {
          width: 100%;
          max-width: 560px;
          background: #0a0a0a;
          border: 1px solid #18181b;
          border-radius: 22px;
          padding: 2.2rem;
        }

        .section {
          margin-bottom: 2.2rem;
        }

        .section h3 {
          font-size: 0.85rem;
          color: #a1a1aa;
          margin-bottom: 1rem;
        }

        label {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-bottom: 0.4rem;
          display: block;
        }

        input,
        select {
          width: 100%;
          background: #000;
          border: 1px solid #27272a;
          color: #e5e7eb;
          padding: 0.7rem;
          border-radius: 10px;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #3f3f46;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }


        .actions {
          display: flex;
          gap: 0.8rem;
          margin-top: 1.8rem;
        }

        .primary {
          flex: 1;
          background: #fff;
          color: #000;
          border: none;
          padding: 0.75rem;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
        }

        .secondary {
          background: transparent;
          border: 1px solid #27272a;
          color: #e5e7eb;
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          cursor: pointer;
        }

        .error {
          color: #f87171;
          font-size: 0.8rem;
          margin-top: 0.6rem;
        }

        @media (max-width: 520px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

/* ===============================
   SMALL COMPONENTS
================================ */
function Section({ title, children }) {
  return (
    <div className="section">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label>{label}</label>
      {children}
    </div>
  );
}
