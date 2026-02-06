"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SubjectData } from "../../../utils/Subjects";

/* ───────────────── HELPERS ───────────────── */

function getSubjectsBySemester(semester) {
  const sem = SubjectData.find(
    (s) => String(s.semester) === String(semester)
  );
  return sem ? sem.subjects : [];
}

function normalizeDriveUrl(url) {
  return url?.trim() || "";
}

function isCollegeEmail(email) {
  return email?.endsWith("@ee.nits.ac.in");
}

/* ───────────────── PAGE ───────────────── */

export default function UploadResourcePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [eligible, setEligible] = useState(false);
  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "",
    driveUrl: "",
    semester: "",
    subject: "",
    category: "",
    visibility: "private",
  });
  useEffect(() => {
  return () => {
    if (window.__toastTimer) {
      clearTimeout(window.__toastTimer);
    }
  };
}, []);

  /* ───────── AUTH + ROLE CHECK (FIXED) ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace("/auth/sign-in");
        return;
      }

      setUser(u);

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        const role = snap.exists() ? snap.data().role : null;

        const allowed =
          role === "admin" || isCollegeEmail(u.email);

        setEligible(allowed);
      } catch (err) {
        console.error("Eligibility check failed", err);
        setEligible(false);
      } finally {
        setChecking(false);
      }
    });

    return () => unsub();
  }, [router]);

  /* ───────── SUBMIT ───────── */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!eligible) return;

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
    } catch (err) {
    setToast({
  message:
    err?.response?.data?.message ||
    "Something went wrong. Please contact Electra Dev Team.",
});

if (window.__toastTimer) {
  clearTimeout(window.__toastTimer);
}

window.__toastTimer = setTimeout(() => {
  setToast(null);
}, 4000);


    } finally {
      setLoading(false);
    }
  }

  /* ───────── LOADING SCREEN ───────── */
  if (checking) {
    return (
      <main className="center">
        <div className="spinner" />
        <p>Verifying access…</p>

        <style jsx>{`
          .center {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #000;
            color: #9ca3af;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #222;
            border-top-color: #22d3ee;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="root">
     {toast && (
  <div className="toast">
    {toast.message}
  </div>
)}

      {/* ───── HEADER ───── */}
      <header className="header">
        <span className="kicker">CONTRIBUTE</span>
        <h1>Upload Academic Resource</h1>
        <p className="desc">
          Share verified Electrical Engineering resources with your peers.
        </p>
      </header>

      {/* ───── ACCESS DENIED ───── */}
    {!eligible && (
  <div className="alert warning access-card">
    <span className="badge">UPLOAD ACCESS</span>

    <h3>Contribution limited to verified members</h3>

    <p className="lead">
      To keep Electra’s academic resources accurate, relevant, and
      department-specific, uploads are currently limited.
    </p>

    <div className="rules">
      <p>Who can upload:</p>
      <ul>
        <li>Electrical Engineering students ( @ee.nits.ac.in )</li>
        <li>Electra administrators</li>
      </ul>
    </div>

    <p className="muted">
      You’re signed in with an account that doesn’t meet this requirement.
      You can still browse and use all public resources.
    </p>

    <button onClick={() => router.push("/auth/sign-in")}>
      Switch to college email
    </button>
  </div>
)}

      {/* ───── FORM ───── */}
      {eligible && (
        <form className="card" onSubmit={handleSubmit}>

          <Section title="Resource details">
            <Field label="Resource name">
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Control Systems – Unit 1 Notes"
              />
            </Field>

            <Field label="Google Drive file link">
              <input
                required
                value={form.driveUrl}
                onChange={(e) =>
                  setForm({ ...form, driveUrl: e.target.value })
                }
                placeholder="https://drive.google.com/file/d/FILE_ID/"
              />
              <p className="hint">
                Example:
                <code>
                  https://drive.google.com/file/d/1bB9ETheDJfZsWOmB16WUr-KyonCi_hFN/
                </code>
              </p>
            </Field>
          </Section>

          <Section title="Academic classification">
            <div className="grid">
              <Field label="Semester">
                <select
                  required
                  value={form.semester}
                  onChange={(e) => {
                    const sem = e.target.value;
                    setForm({ ...form, semester: sem, subject: "" });
                    setAvailableSubjects(getSubjectsBySemester(sem));
                  }}
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
                  required
                  disabled={!availableSubjects.length}
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                >
                  <option value="">
                    {availableSubjects.length
                      ? "Select"
                      : "Select semester first"}
                  </option>
                  {availableSubjects.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Category">
              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="notes">Notes</option>
                <option value="books">Books</option>
                <option value="pyqs">PYQs</option>
                <option value="assignments">Assignments</option>
              </select>
            </Field>
          </Section>

          <Section title="Visibility">
            <Field label="Who can access this resource?">
              <select
                value={form.visibility}
                onChange={(e) =>
                  setForm({ ...form, visibility: e.target.value })
                }
              >
                <option value="private">Private (only you)</option>
                <option value="public">Public (all students)</option>
              </select>
            </Field>
            <p className="hint">
              You can change visibility later from <strong>My Resources</strong>.
            </p>
          </Section>

          <div className="actions">
            <button className="primary" disabled={loading}>
              {loading ? "Uploading…" : "Upload resource"}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => router.push("/MyResources")}
            >
              Cancel
            </button>
          </div>

          <p className="footer-note">
            Facing issues? Contact the <strong>Electra Dev Team</strong>.
          </p>
        </form>
      )}

      {/* ───── STYLES ───── */}
      <style jsx>{`
        /* ───────── ROOT ───────── */
.root {
  min-height: 100vh;
  background: #000;
  color: #e5e7eb;
  padding: 4rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* tighten padding on small screens */
@media (max-width: 520px) {
  .root {
    padding: 2.5rem 1.25rem;
  }
}

/* ───────── HEADER ───────── */
.header {
  max-width: 640px;
  text-align: center;
  margin-bottom: 3rem;
}

.kicker {
  font-size: 0.65rem;
  letter-spacing: 0.35em;
  color: #6b7280;
  margin-bottom: 0.3rem;
}

h1 {
  font-size: clamp(1.9rem, 6vw, 2.6rem);
  margin: 0.6rem 0;
  font-weight: 600;
  line-height: 1.15;
}

.desc {
  color: #9ca3af;
  font-size: clamp(0.85rem, 3.5vw, 0.95rem);
  max-width: 34ch;
  margin: 0.5rem auto 0;
  line-height: 1.5;
}

/* ───────── CARD ───────── */
.card {
  width: 100%;
  max-width: 560px;
  background: #0a0a0a;
  border: 1px solid #18181b;
  border-radius: 22px;
  padding: 2.2rem;
}

@media (max-width: 520px) {
  .card {
    padding: 1.4rem;
    border-radius: 18px;
  }
}

/* ───────── ALERTS ───────── */
.alert {
  border-radius: 14px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
}

.alert.warning {
  background: rgba(234,179,8,0.08);
  border: 1px solid rgba(234,179,8,0.35);
}

.alert.error {
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.35);
}

.alert h3 {
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.alert button {
  margin-top: 0.8rem;
  background: #fff;
  color: #000;
  border-radius: 999px;
  padding: 0.55rem 1.4rem;
  font-weight: 600;
}

/* ───────── SECTIONS (HIERARCHY FIX) ───────── */
.section {
  margin-bottom: 2.2rem;
}

.section h3 {
  font-size: clamp(0.9rem, 3vw, 1rem);
  font-weight: 600;
  color: #f9fafb;
  margin-bottom: 1rem;
  letter-spacing: 0.02em;
}

/* add rhythm between fields */
.section > div {
  margin-bottom: 1.1rem;
}

/* ───────── GRID ───────── */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* ───────── LABELS (SECONDARY LEVEL) ───────── */
label {
  font-size: clamp(0.7rem, 2.4vw, 0.75rem);
  color: #d1d5db;
  display: block;
  margin-bottom: 0.35rem;
  font-weight: 500;
}

/* ───────── INPUTS ───────── */
input,
select {
  width: 100%;
  background: #000;
  border: 1px solid #27272a;
  color: #e5e7eb;
  padding: 0.75rem 0.8rem;
  border-radius: 10px;
  font-size: 0.9rem;
  min-height: 44px; /* mobile tap target */
}

input:focus,
select:focus {
  outline: none;
  border-color: #52525b;
}

/* ───────── HELPER TEXT (LOWEST PRIORITY) ───────── */
.hint {
  font-size: clamp(0.55rem, 2.2vw, 0.7rem);
  color: #9ca3af;
  margin-top: 0.35rem;
  max-width: 30ch;
  line-height: 1.35;
}

/* ───────── ACTIONS (RESPONSIVE FIX) ───────── */
.actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 2rem;
}

@media (max-width: 420px) {
  .actions {
    flex-direction: column;
  }
}

.primary {
  flex: 1;
  background: #fff;
  color: #000;
  border-radius: 999px;
  padding: 0.85rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.secondary {
  flex: 1;
  border: 1px solid #27272a;
  padding: 0.85rem;
  border-radius: 999px;
  font-size: 0.9rem;
  background: transparent;
  color: #e5e7eb;
}

/* ───────── FOOTER NOTE ───────── */
.footer-note {
  margin-top: 1.6rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
  max-width: 26ch;
  line-height: 1.5;
  margin-left: auto;
  margin-right: auto;
}

/* ───────── ACCESS CARD ───────── */
.access-card {
  text-align: left;
}

.badge {
  display: inline-block;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: #facc15;
  margin-bottom: 0.6rem;
}

.lead {
  color: #e5e7eb;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.rules {
  background: rgba(255,255,255,0.03);
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 0.9rem;
  margin-bottom: 1rem;
}

.rules p {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-bottom: 0.4rem;
}

.rules ul {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.75rem;
  color: #e5e7eb;
}

/* ───────── TOAST ───────── */
.toast {
  position: fixed;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  padding: 0.75rem 1.2rem;
  border-radius: 999px;
  font-size: 0.8rem;
  z-index: 9999;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

      `}</style>
    </main>
  );
}

/* ───────────────── SMALL COMPONENTS ───────────────── */

function Section({ title, children }) {
  return (
    <div className="section">
      <h3 style={{ marginBottom: "0.8rem" }}>{title}</h3>
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


