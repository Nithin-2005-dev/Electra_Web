"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../lib/useAuthGaurd";

export default function DashboardPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuthGuard({ requireProfile: true });

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ───────── AUTH + FETCH ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setUserData(snap.data());
        setFormData(snap.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ───────── LOGOUT ───────── */
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  /* ───────── EDIT HANDLERS ───────── */
  const onChange = (key, value) => {
    setFormData((p) => ({ ...p, [key]: value }));
  };

  const cancelEdit = () => {
    setFormData(userData);
    setEditing(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const { email, ...updatable } = formData;
      await updateDoc(doc(db, "users", user.uid), updatable);

      setUserData(formData);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  /* ───────── LOADING ───────── */
 if (authLoading || loading) {
  return (
    <main className="wrap">
      <div className="loader">
        <div className="header">
          <div className="sk sk-eyebrow" />
          <div className="sk sk-title" />
        </div>

        <div className="card">
          <div className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="field" key={i}>
                <div className="sk sk-label" />
                <div className="sk sk-value" />
              </div>
            ))}
          </div>
        </div>

        <div className="actions">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="action" key={i}>
              <div className="sk sk-action-title" />
              <div className="sk sk-action-desc" />
            </div>
          ))}
        </div>

        <style jsx>{`
          .loader {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .header {
            max-width: 300px;
          }

          .sk {
            background: linear-gradient(
              100deg,
              rgba(255,255,255,0.04) 40%,
              rgba(255,255,255,0.08) 50%,
              rgba(255,255,255,0.04) 60%
            );
            background-size: 200% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 8px;
          }

          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }

          .sk-eyebrow {
            width: 120px;
            height: 10px;
            margin-bottom: 0.6rem;
          }

          .sk-title {
            width: 200px;
            height: 26px;
          }

          .card {
            background: linear-gradient(180deg, #0f1414, #070808);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 1.4rem;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
          }

          .field {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }

          .sk-label {
            width: 70px;
            height: 8px;
          }

          .sk-value {
            width: 100%;
            height: 16px;
          }

          .actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 1rem;
          }

          .action {
            background: linear-gradient(180deg, #0f1414, #070808);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 18px;
            padding: 1.4rem;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
          }

          .sk-action-title {
            width: 140px;
            height: 18px;
          }

          .sk-action-desc {
            width: 90%;
            height: 12px;
          }
        `}</style>
      </div>
    </main>
  );
}


  return (
    <main className="wrap">
      {/* HEADER */}
      <header className="top">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{userData.name}</h1>
        </div>

        <div className="top-actions">
          {!editing && (
            <button onClick={() => setEditing(true)}>Edit profile</button>
          )}
          <button onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      {/* PROFILE */}
      <section className="card">
        <h2>Profile</h2>

        <div className="grid">
          <ProfileField label="Email" value={userData.email} disabled />

          <ProfileField
            label="Name"
            value={formData.name}
            editing={editing}
            onChange={(v) => onChange("name", v)}
          />

          <ProfileField
            label="Phone"
            value={formData.phone}
            editing={editing}
            onChange={(v) => onChange("phone", v)}
          />

          <ProfileField
            label="College"
            value={formData.college}
            editing={editing}
            onChange={(v) => onChange("college", v)}
          />

          <ProfileField
            label="Stream"
            value={formData.stream}
            editing={editing}
            onChange={(v) => onChange("stream", v)}
          />

          <ProfileField
            label="Year"
            value={formData.year}
            editing={editing}
            onChange={(v) => onChange("year", v)}
          />
        </div>

        {editing && (
          <div className="edit-actions">
            <button className="ghost" onClick={cancelEdit}>
              Cancel
            </button>
            <button onClick={saveProfile} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </section>

      {/* ACTIONS */}
      <section className="actions">
      <Action
    title="My Resources"
    desc="Manage, upload and track your academic resources"
    onClick={() => router.push("/MyResources")}
  />
        <Action
          title="Merch Store"
          desc="Browse and order exclusive Electra merchandise"
          onClick={() => router.push("/getyourmerch")}
        />
        <Action
          title="My Orders"
          desc="Track, manage, and view your order history"
          onClick={() => router.push("/dashboard/orders")}
        />
      </section>

      {/* STYLES */}
      <style jsx>{`
        .wrap {
          min-height: 100vh;
          {/* background: radial-gradient(circle at top, #0b0f0f, #050505); */}
          color: #fff;
          padding: clamp(1rem, 4vw, 2.5rem);
          max-width: 1100px;
          margin: auto;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }

        .eyebrow {
          color: #9ca3af;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        h1 {
          font-size: clamp(1.4rem, 4vw, 2.1rem);
        }

        .top-actions {
          display: flex;
          gap: 0.6rem;
        }

        button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 0.5rem 0.9rem;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .ghost {
          border-color: rgba(255,255,255,0.15);
          color: #9ca3af;
        }

        .card {
          background: linear-gradient(180deg, #0f1414, #070808);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.4rem;
          margin-bottom: 2rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.9rem;
        }

        .actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
        }

        .edit-actions {
          margin-top: 1.2rem;
          display: flex;
          gap: 0.6rem;
        }

        /* MOBILE FIXES */
        @media (max-width: 640px) {
          .top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .top-actions {
            width: 100%;
          }

          .top-actions button {
            flex: 1;
            font-size: 0.75rem;
            padding: 0.45rem;
          }

          .card {
            padding: 1.1rem;
          }
        }
      `}</style>
    </main>
  );
}

/* ───────── PROFILE FIELD ───────── */
function ProfileField({ label, value, editing = false, disabled = false, onChange }) {
  return (
    <div className={`field ${editing ? "editing" : ""}`}>
      <span className="label">{label}</span>

      {editing && !disabled ? (
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <div className="value">{value}</div>
      )}

      <style jsx>{`
        .field {
          background: linear-gradient(180deg, #0b0f0f, #060707);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 0.8rem 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .label {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .value {
          font-size: 0.9rem;
        }

        input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 0.45rem 0.55rem;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
        }

        input:focus {
          border-color: #22d3ee;
        }
      `}</style>
    </div>
  );
}

/* ───────── ACTION CARD ───────── */
function Action({ title, desc, onClick }) {
  return (
    <div className="action" onClick={onClick}>
      <h3>{title}</h3>
      <p>{desc}</p>

      <style jsx>{`
        .action {
          cursor: pointer;
          background: linear-gradient(180deg, #0f1414, #070808);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 1.4rem;
          transition: transform 0.25s ease;
        }

        .action:hover {
          transform: translateY(-3px);
        }

        p {
          color: #9ca3af;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
