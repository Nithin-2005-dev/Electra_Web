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

  /* FILTER STATE */
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

  /* FILTER OPTIONS */
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

  /* FILTERED DATA */
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
          <header className="header-resources">
            <div>
              <h1 className="title">Manage Resources</h1>
              <p className="subtitle">
                Control visibility and manage uploaded content
              </p>
            </div>
          </header>

          {/* FILTER BAR */}
          <div className="filter-bar">
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="all">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <section className="table-card">
            <div className="table-head">
              <span>Name</span>
              <span>Subject</span>
              <span>Status</span>
              <span className="right">Actions</span>
            </div>

            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="row skeleton">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              ))}

            {!loading && filteredResources.length === 0 && (
              <div className="empty">
                <h3>No resources found</h3>
                <p>Try changing filters or upload a new resource.</p>
              </div>
            )}

            {!loading &&
              filteredResources.map((r) => (
                <div key={r._id} className="row">
                  <span className="name">{r.name}</span>
                  <span className="muted">{r.subject}</span>
                  <span>
                    <span className={`pill ${r.visibility}`}>
                      {r.visibility}
                    </span>
                  </span>
                  <span className="actions">
                    <a
                      href={r.driveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="icon-btn-resources"
                    >
                      Open
                    </a>
                    <button
                      className="icon-btn-resources"
                      onClick={() => setEditing(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="icon-btn-resources danger"
                      disabled={deletingId === r._id}
                      onClick={() => handleDelete(r._id)}
                    >
                      {deletingId === r._id ? "…" : "Delete"}
                    </button>
                  </span>
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

      {/* STYLES — YOUR ORIGINAL + FILTERS + EMPTY */}
      <style>{`
        .page {
          min-height: 100vh;
          {/* background: radial-gradient(circle at top, #0b0f14, #05070a); */}
          padding: 3rem 1.5rem;
          color: #fff;
        }

        .container {
          max-width: 1200px;
          margin: auto;
        }

        .header-resources {
          margin-bottom: 1.6rem;
        }

        .title {
          font-size: 2.2rem;
          margin: 0;
        }

        .subtitle {
          color: #9ca3af;
          margin-top: 0.4rem;
        }

        .filter-bar {
          display: flex;
          gap: 0.8rem;
          margin-bottom: 1.2rem;
        }

        .filter-bar select {
          background: #020617;
          border: 1px solid #1f2937;
          color: #fff;
          padding: 0.45rem 0.8rem;
          border-radius: 10px;
          font-size: 0.75rem;
        }

        .table-card {
          background: linear-gradient(180deg, #020617, #010409);
          border: 1px solid #1f2937;
          border-radius: 20px;
          overflow: hidden;
        }

        .table-head,
        .row {
          display: grid;
          grid-template-columns: 3fr 1.5fr 1fr 2fr;
          padding: 1rem 1.6rem;
          align-items: center;
        }

        .table-head {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
        }

        .row {
          border-top: 1px solid #1f2937;
        }

        .row:hover {
          background: rgba(255,255,255,0.02);
        }

        .name {
          font-weight: 600;
        }

        .muted {
          color: #9ca3af;
          font-size: 0.85rem;
        }

        .pill {
          font-size: 0.7rem;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          text-transform: capitalize;
        }

        .pill.public {
          background: rgba(34,211,238,0.15);
          color: #22d3ee;
        }

        .pill.private {
          background: rgba(239,68,68,0.15);
          color: #f87171;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.4rem;
        }

        .icon-btn-resources {
          background: transparent;
          border: 1px solid #1f2937;
          color: #e5e7eb;
          padding: 0.35rem 0.65rem;
          border-radius: 8px;
          font-size: 0.7rem;
          cursor: pointer;
        }

        .icon-btn-resources.danger {
          color: #f87171;
          border-color: rgba(239,68,68,0.4);
        }

        .skeleton span {
          height: 12px;
          border-radius: 6px;
          background: #1f2937;
          animation: pulse 1.4s infinite;
        }

        .empty {
          padding: 3rem;
          text-align: center;
          color: #9ca3af;
        }

        .empty h3 {
          color: #fff;
          margin-bottom: 0.4rem;
        }

        @keyframes pulse {
          0% { opacity: 0.5 }
          50% { opacity: 1 }
          100% { opacity: 0.5 }
        }
      `}</style>
    </>
  );
}

/* EDIT MODAL — UNCHANGED */
function EditModal({ resource, onClose, onSave }) {
  const [form, setForm] = useState({
    name: resource.name,
    driveUrl: resource.driveUrl,
    visibility: resource.visibility,
  });

  return (
    <div className="modal">
      <div className="modal-box">
        <h2>Edit Resource</h2>

        <input
          className="modal-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="modal-input"
          value={form.driveUrl}
          onChange={(e) => setForm({ ...form, driveUrl: e.target.value })}
        />

        <select
          className="modal-input"
          value={form.visibility}
          onChange={(e) =>
            setForm({ ...form, visibility: e.target.value })
          }
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>

        <div className="modal-actions">
          <button onClick={() => onSave({ ...resource, ...form })}>Save</button>
          <button className="ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
