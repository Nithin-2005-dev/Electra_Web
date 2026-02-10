"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginating, setPaginating] = useState(false);
  const [page, setPage] = useState(1);
  const [nextCursor, setNextCursor] = useState(null);
  const [cursorStack, setCursorStack] = useState([null]);

  /* Filters */
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [stream, setStream] = useState("");
  const [role, setRole] = useState("");
  const [hasOrders, setHasOrders] = useState("");
  const [createdAfter, setCreatedAfter] = useState("");
  const [ordersAfter, setOrdersAfter] = useState("");
  const [orderedProductInput, setOrderedProductInput] = useState("");
  const [orderedProduct, setOrderedProduct] = useState("");

  const fetchUsers = async (cursor = null) => {
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();

    const params = new URLSearchParams();
    params.set("limit", "20");
    if (cursor) params.set("cursor", cursor);
    if (search) params.set("search", search);
    if (year) params.set("year", year);
    if (stream) params.set("stream", stream);
    if (role) params.set("role", role);
    if (hasOrders) params.set("hasOrders", hasOrders);
    if (createdAfter) params.set("createdAfter", createdAfter);
    if (ordersAfter) params.set("ordersAfter", ordersAfter);
    if (orderedProduct) params.set("orderedProduct", orderedProduct);

    const res = await fetch(`/api/admin/users/list?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load users");
    return res.json();
  };

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const t = setTimeout(
      () => setOrderedProduct(orderedProductInput.trim()),
      400
    );
    return () => clearTimeout(t);
  }, [orderedProductInput]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists() || snap.data().role !== "admin") {
          router.replace("/");
          return;
        }

        setLoading(true);
        const data = await fetchUsers(null);
        setUsers(data?.users || []);
        setNextCursor(data?.nextCursor || null);
        setCursorStack([null]);
        setPage(1);
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    });

    return () => unsub();
  }, [router]);

  useEffect(() => {
    const run = async () => {
      try {
        setPaginating(true);
        const data = await fetchUsers(null);
        setUsers(data?.users || []);
        setNextCursor(data?.nextCursor || null);
        setCursorStack([null]);
        setPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setPaginating(false);
      }
    };
    run();
  }, [search, year, stream, role, hasOrders, createdAfter, ordersAfter, orderedProduct]);

  /* Unique stream list (trimmed, no duplicates) */
  const streamOptions = useMemo(() => {
    return [...new Set(users.map((u) => u.stream).filter(Boolean))];
  }, [users]);

  /* CSV Export */
  const exportCsv = () => {
    const rows = users.map((u) => ({
      name: u.name,
      email: u.email,
      phone: u.phone,
      stream: u.stream,
      year: u.year,
      role: u.role,
      createdAt: formatDateForCsv(u.createdAt),
      ordersCount: u.ordersCount || 0,
      totalSpent: u.totalSpent || 0,
    }));

    downloadCsv(toCsv(rows), `users-${Date.now()}.csv`);
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-black text-slate-400">
        Loading users...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Admin · Users</h1>

      <input
        placeholder="Search name / email / phone / uid"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-black border border-white/10 rounded-lg text-sm"
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <DateFilter label="User Created After" value={createdAfter} setValue={setCreatedAfter} />
        <DateFilter label="Orders After" value={ordersAfter} setValue={setOrdersAfter} />

        <TextFilter
          label="Ordered Product"
          value={orderedProductInput}
          setValue={setOrderedProductInput}
        />

        <Select label="Year" value={year} onChange={setYear}>
          <option value="">All</option>
          <option value="1">1st</option>
          <option value="2">2nd</option>
          <option value="3">3rd</option>
          <option value="4">4th</option>
        </Select>

        <Select label="Stream" value={stream} onChange={setStream}>
          <option value="">All</option>
          {streamOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>

        <Select label="Role" value={role} onChange={setRole}>
          <option value="">All</option>
          <option value="member">member</option>
          <option value="admin">admin</option>
        </Select>

        <Select label="Orders" value={hasOrders} onChange={setHasOrders}>
          <option value="">All</option>
          <option value="yes">Has orders</option>
          <option value="no">No orders</option>
        </Select>

        <button
          onClick={exportCsv}
          className="px-4 py-2 bg-white text-black rounded-lg text-sm"
        >
          Export ({users.length})
        </button>
      </div>

      <div className="space-y-3">
        {paginating ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-[#0b0f15] rounded-xl border border-white/10 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-white/10 rounded" />
                  <div className="h-3 w-56 bg-white/5 rounded" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-3 w-20 bg-white/10 rounded ml-auto" />
                  <div className="h-4 w-16 bg-white/10 rounded ml-auto" />
                </div>
              </div>
            </div>
          ))
        ) : (
          users.map((u) => {
            const spent = u.totalSpent || 0;

            return (
              <div
                key={u.uid}
                onClick={() => router.push(`/admin/users/${u.uid}`)}
                className="p-4 bg-[#0b0f15] rounded-xl border border-white/10 cursor-pointer"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-slate-400">
                      {u.email} · {u.phone}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{u.ordersCount || 0} orders</p>
                    <p className="text-cyan-300">₹{spent}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <span>Page {page}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              if (page === 1) return;
              setPaginating(true);
              const prevCursor = cursorStack[page - 2] || null;
              const data = await fetchUsers(prevCursor);
              setUsers(data?.users || []);
              setNextCursor(data?.nextCursor || null);
              setPage((p) => Math.max(1, p - 1));
              setPaginating(false);
            }}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-white/10 text-white disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={async () => {
              if (!nextCursor) return;
              setPaginating(true);
              const data = await fetchUsers(nextCursor);
              setUsers(data?.users || []);
              setNextCursor(data?.nextCursor || null);
              setCursorStack((s) => [...s, nextCursor]);
              setPage((p) => p + 1);
              setPaginating(false);
            }}
            disabled={!nextCursor}
            className="px-3 py-1 rounded border border-white/10 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

/* UI Components */

function Select({ label, value, onChange, children }) {
  return (
    <label className="text-xs text-slate-400 flex flex-col">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black border border-white/10 px-3 py-2 rounded"
      >
        {children}
      </select>
    </label>
  );
}

function DateFilter({ label, value, setValue }) {
  return (
    <label className="text-xs text-slate-400 flex flex-col">
      {label}
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-black border border-white/10 px-3 py-2 rounded"
      />
    </label>
  );
}

function TextFilter({ label, value, setValue }) {
  return (
    <label className="text-xs text-slate-400 flex flex-col">
      {label}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-black border border-white/10 px-3 py-2 rounded"
      />
    </label>
  );
}

/* Helpers */

function formatDateForCsv(value) {
  if (!value) return "";
  if (value.toDate) return value.toDate().toISOString();
  if (value.seconds) return new Date(value.seconds * 1000).toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

function toCsv(rows) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  return [header, ...lines].join("\n");
}

function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
