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
    setFormData((prev) => ({ ...prev, [key]: value }));
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

      const { email, ...updatable } = formData; // 🔒 email immutable
      await updateDoc(doc(db, "users", user.uid), updatable);

      setUserData(formData);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  /* ───────── SKELETON LOADING ───────── */
  if (authLoading || loading) {
    return (
      <main className="wrap_signout">
        <div className="skel header">
          <div className="line w40" />
          <div className="pill" />
        </div>

        <div className="skel card">
          <div className="line w25" />
          <div className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="box" />
            ))}
          </div>
        </div>

        <div className="grid actions">
          <div className="box tall" />
          <div className="box tall" />
        </div>

        <style jsx>{`
          .wrap_signout {
            min-height: 100vh;
            background: radial-gradient(circle at top, #0b0f0f, #050505);
            padding: 2.5rem;
            max-width: 1100px;
            margin: auto;
          }

          .skel {
            background: linear-gradient(
              90deg,
              #111 25%,
              #1a1a1a 37%,
              #111 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 18px;
            margin-bottom: 2rem;
          }

          .header {
            display: flex;
            justify-content: space-between;
            padding: 1.6rem;
          }

          .line {
            height: 18px;
            border-radius: 8px;
          }

          .w40 { width: 40%; }
          .w25 { width: 25%; }

          .pill {
            width: 90px;
            height: 36px;
            border-radius: 999px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
          }

          .box {
            height: 54px;
            border-radius: 14px;
          }

          .box.tall {
            height: 120px;
          }

          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}</style>
      </main>
    );
  }

  /* ───────── DASHBOARD ───────── */
  return (
    <main className="wrap_signout">
      {/* HEADER */}
      <header className="top fade-in">
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
      <section className="card slide-up">
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
          title="Merch Store"
          desc="Browse and order exclusive Electra merchandise"
          onClick={() => router.push("/gotyourmerch")}
        />
        <Action
          title="My Orders"
          desc="Track, manage, and view your order history"
          onClick={() => router.push("/dashboard/orders")}
        />
      </section>

      <style jsx>{`
        .wrap_signout {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0b0f0f, #050505);
          color: #fff;
          padding: 2.5rem;
          max-width: 1100px;
          margin: auto;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.6rem;
        }

        .top-actions {
          display: flex;
          gap: 0.6rem;
        }

        button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          cursor: pointer;
        }

        .ghost {
          border-color: rgba(255,255,255,0.15);
          color: #9ca3af;
        }

        .card {
          background: linear-gradient(180deg, #0f1414, #070808);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.6rem;
          margin-bottom: 2.6rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.2rem;
        }

        .edit-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 0.8rem;
        }

        .fade-in {
          animation: fadeIn 0.45s ease-out forwards;
        }

        .slide-up {
          animation: slideUp 0.55s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
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
          border-radius: 16px;
          padding: 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .label {
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .value {
          font-size: 0.95rem;
          font-weight: 500;
          color: #fff;
        }

        input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          padding: 0.55rem 0.65rem;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
        }

        input:focus {
          border-color: #22d3ee;
          box-shadow: 0 0 0 2px rgba(34,211,238,0.15);
        }

        .editing {
          border-color: rgba(34,211,238,0.35);
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
          border-radius: 20px;
          padding: 1.6rem;
          transition: transform 0.25s ease;
        }

        .action:hover {
          transform: translateY(-4px);
        }

        p {
          color: #9ca3af;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
