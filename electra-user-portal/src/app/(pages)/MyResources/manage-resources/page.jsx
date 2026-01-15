"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ManageResourcesPage() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [semester, setSemester] = useState("all");
  const [subject, setSubject] = useState("all");
  const [category, setCategory] = useState("all");

  async function fetchResources(u) {
    const token = await u.getIdToken();
    const res = await axios.get("/api/resources/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setResources(res.data.resources || []);
    setLoading(false);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return;
      setUser(u);
      fetchResources(u);
    });
    return () => unsub();
  }, []);

  async function handleDelete(id) {
    setDeletingId(id);
    const token = await user.getIdToken();
    await axios.delete("/api/resources/delete", {
      data: { id },
      headers: { Authorization: `Bearer ${token}` },
    });
    setResources((p) => p.filter((r) => r._id !== id));
    setDeletingId(null);
  }

  async function handleUpdate(updated) {
    const token = await user.getIdToken();
    await axios.put(
      "/api/resources/update",
      {
        id: updated._id,
        name: updated.name,
        driveUrl: updated.driveUrl,
        visibility: updated.visibility,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setResources((p) =>
      p.map((r) => (r._id === updated._id ? updated : r))
    );
    setEditing(null);
  }

  const semesters = useMemo(
    () => [...new Set(resources.map((r) => r.semester))],
    [resources]
  );
  const subjects = useMemo(
    () => [...new Set(resources.map((r) => r.subject))],
    [resources]
  );
  const categories = useMemo(
    () => [...new Set(resources.map((r) => r.category))],
    [resources]
  );

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      if (semester !== "all" && r.semester !== semester) return false;
      if (subject !== "all" && r.subject !== subject) return false;
      if (category !== "all" && r.category !== category) return false;
      return true;
    });
  }, [resources, semester, subject, category]);

  return (
    <>
      <main className="page">
        <div className="container">
          <header className="header">
            <h1>Manage Resources</h1>
            <p>You control what you share with the Electra community.</p>
          </header>

          {/* FILTERS */}
          <div className="filters">
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="all">All semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="all">All subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* LIST */}
          <section className="list">
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card skeleton" />
              ))}

            {!loading && filteredResources.length === 0 && (
              <div className="empty">
                <h3>No resources found</h3>
                <p>Change filters or upload a new one.</p>
              </div>
            )}

            {!loading &&
              filteredResources.map((r) => (
                <div key={r._id} className="card">
                  <div className="left">
                    <strong>{r.name}</strong>
                    <span>
                      {r.subject} · Semester {r.semester}
                    </span>
                    <span className={`pill ${r.visibility}`}>
                      {r.visibility}
                    </span>
                  </div>

                  <div className="actions">
                    <a
                      href={r.driveUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                    <button onClick={() => setEditing(r)}>Edit</button>
                    <button
                      className="danger"
                      disabled={deletingId === r._id}
                      onClick={() => handleDelete(r._id)}
                    >
                      {deletingId === r._id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
          </section>
        </div>
      </main>

      {editing && (
        <EditModal
          resource={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
        />
      )}

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 3rem 1.5rem 5rem;
        }

        .container {
          max-width: 1000px;
          margin: auto;
        }

        .header h1 {
          font-size: 2.2rem;
        }

        .header p {
          color: #9ca3af;
          margin-top: 0.3rem;
        }

        .filters {
          display: flex;
          gap: 0.8rem;
          margin: 1.8rem 0;
          flex-wrap: wrap;
        }

        select {
          background: #000;
          border: 1px solid #1f2937;
          color: #fff;
          padding: 0.5rem 0.8rem;
          border-radius: 999px;
          font-size: 0.75rem;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .card {
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 1.2rem 1.4rem;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
        }

        .left strong {
          display: block;
          font-size: 0.95rem;
        }

        .left span {
          display: block;
          font-size: 0.8rem;
          color: #9ca3af;
          margin-top: 0.2rem;
        }

        .pill {
          display: inline-block;
          margin-top: 0.4rem;
          font-size: 0.65rem;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          text-transform: capitalize;
        }

        .pill.public {
          color: #22d3ee;
          background: rgba(34,211,238,0.15);
        }

        .pill.private {
          color: #f87171;
          background: rgba(239,68,68,0.15);
        }

        .actions {
          display: flex;
          gap: 0.4rem;
        }

        .actions a,
        .actions button {
          background: none;
          border: 1px solid #1f2937;
          color: #e5e7eb;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          font-size: 0.7rem;
        }

        .actions .danger {
          color: #f87171;
          border-color: rgba(239,68,68,0.5);
        }

        .empty {
          text-align: center;
          padding: 3rem 1rem;
          color: #9ca3af;
        }

        .skeleton {
          height: 74px;
          background: #020617;
          animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.5 }
          50% { opacity: 1 }
          100% { opacity: 0.5 }
        }

        @media (max-width: 700px) {
          .card {
            flex-direction: column;
            align-items: flex-start;
          }
          .actions {
            align-self: stretch;
            justify-content: flex-end;
          }
        }
      `}</style>
    </>
  );
}

function EditModal({ resource, onClose, onSave }) {
  const [form, setForm] = useState({
    name: resource.name,
    driveUrl: resource.driveUrl,
    visibility: resource.visibility,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!form.name || !form.driveUrl) {
      setError("Name and Drive link are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({ ...resource, ...form });
      // onSave already closes modal on success in parent
    } catch (err) {
      setError("Failed to update resource. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="modal">
      <div className="box">
        {/* HEADER */}
        <div className="header">
          <h2>Edit Resource</h2>
          <button
            className="close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="body">
          <label>
            Resource name
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              disabled={saving}
            />
          </label>

          <label>
            Drive link
            <input
              value={form.driveUrl}
              onChange={(e) =>
                setForm({ ...form, driveUrl: e.target.value })
              }
              disabled={saving}
            />
          </label>

          <label>
            Visibility
            <select
              value={form.visibility}
              onChange={(e) =>
                setForm({ ...form, visibility: e.target.value })
              }
              disabled={saving}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </label>

          {error && <p className="error">{error}</p>}
        </div>

        {/* FOOTER */}
        <div className="actions">
          <button
            className="ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <span className="spinner" />
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          display: grid;
          place-items: center;
          z-index: 1000;
        }

        .box {
          width: 100%;
          max-width: 440px;
          background: radial-gradient(
            circle at top,
            #0b0f14,
            #000
          );
          border: 1px solid #1f2937;
          border-radius: 20px;
          padding: 1.8rem;
          animation: modalIn 0.25s ease-out;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .header h2 {
          font-size: 1.1rem;
          margin: 0;
        }

        .close {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 1.4rem;
          cursor: pointer;
        }

        .close:hover {
          color: #fff;
        }

        .body {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        label {
          font-size: 0.7rem;
          color: #9ca3af;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        input,
        select {
          background: #000;
          border: 1px solid #1f2937;
          color: #fff;
          padding: 0.55rem 0.6rem;
          border-radius: 8px;
          font-size: 0.8rem;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #22d3ee;
        }

        .error {
          color: #f87171;
          font-size: 0.7rem;
          margin-top: 0.2rem;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
          margin-top: 1.6rem;
        }

        .ghost {
          background: none;
          border: 1px solid #1f2937;
          color: #e5e7eb;
          padding: 0.45rem 1.1rem;
          border-radius: 999px;
          font-size: 0.75rem;
        }

        .primary {
          background: linear-gradient(
            135deg,
            #22d3ee,
            #2563eb
          );
          border: none;
          color: #020617;
          padding: 0.45rem 1.2rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 110px;
        }

        .primary:disabled,
        .ghost:disabled,
        .close:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #020617;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
