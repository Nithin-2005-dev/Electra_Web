"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../app/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [ordersMap, setOrdersMap] = useState({});
  const [loading, setLoading] = useState(true);

  /* Filters */
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [stream, setStream] = useState("");
  const [role, setRole] = useState("");
  const [hasOrders, setHasOrders] = useState("");

  /* ───── ADMIN GUARD + LOAD DATA ───── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.replace("/");

      const adminCheck = await getDocs(
        query(
          collection(db, "users"),
          where("uid", "==", user.uid),
          where("role", "==", "admin")
        )
      );

      if (adminCheck.empty) return router.replace("/");

      const usersSnap = await getDocs(collection(db, "users"));
      const ordersSnap = await getDocs(collection(db, "orders"));

      const ordersByUser = {};
      ordersSnap.forEach((d) => {
        const o = d.data();
        ordersByUser[o.userId] ||= [];
        ordersByUser[o.userId].push(o);
      });

      setOrdersMap(ordersByUser);
      setUsers(usersSnap.docs.map((d) => d.data()));
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  /* ───── FILTER LOGIC ───── */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const orders = ordersMap[u.uid] || [];

      if (
        search &&
        ![u.name, u.email, u.phone, u.uid]
          .filter(Boolean)
          .some((v) =>
            v.toLowerCase().includes(search.toLowerCase())
          )
      )
        return false;

      if (year && u.year !== year) return false;
      if (stream && u.stream !== stream) return false;
      if (role && u.role !== role) return false;

      if (hasOrders === "yes" && orders.length === 0) return false;
      if (hasOrders === "no" && orders.length > 0) return false;

      return true;
    });
  }, [users, ordersMap, search, year, stream, role, hasOrders]);

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-black text-slate-400">
        Loading users…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* HEADER */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-4">
          Admin · Users
        </h1>

        {/* SEARCH */}
        <input
          placeholder="Search name / email / phone / uid"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-black border border-white/10 rounded-lg text-sm"
        />

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">
          <Select value={year} onChange={setYear} label="Year">
            <option value="">All</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
            <option value="m.tech">M.Tech</option>
            <option value="phd">PhD</option>
            <option value="mba">MBA</option>
            <option value="faculty">Faculty</option>
            <option value="alumni">Alumni</option>
          </Select>

          <Select value={stream} onChange={setStream} label="Stream">
            <option value="">All</option>
            {[...new Set(users.map((u) => u.stream))].map(
              (s) =>
                s && (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
            )}
          </Select>

          <Select value={role} onChange={setRole} label="Role">
            <option value="">All</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </Select>

          <Select
            value={hasOrders}
            onChange={setHasOrders}
            label="Orders"
          >
            <option value="">All</option>
            <option value="yes">Has orders</option>
            <option value="no">No orders</option>
          </Select>
        </div>
      </header>

      {/* USERS LIST */}
      <section className="space-y-3">
        {filteredUsers.map((u) => {
          const orders = ordersMap[u.uid] || [];
          const spent = orders.reduce(
            (s, o) => s + (o.totalAmountPaid || 0),
            0
          );

          return (
            <div
              key={u.uid}
              onClick={() =>
                router.push(`/admin/users/${u.uid}`)
              }
              className="
                cursor-pointer
                p-4 rounded-xl
                bg-[#0b0f15]
                border border-white/10
                hover:border-cyan-400/40
                transition
              "
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-slate-400">
                    {u.email} · {u.phone}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {u.stream} · Year {u.year} · {u.college}
                  </p>
                </div>

                <div className="text-right text-sm">
                  <p>
                    <strong>{orders.length}</strong> orders
                  </p>
                  <p className="text-cyan-300">
                    ₹{spent}
                  </p>
                  <p className="text-xs text-slate-400">
                    {u.role}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

/* ───── SMALL SELECT COMPONENT ───── */
function Select({ label, value, onChange, children }) {
  return (
    <label className="text-xs text-slate-400 flex flex-col gap-1">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
      >
        {children}
      </select>
    </label>
  );
}
