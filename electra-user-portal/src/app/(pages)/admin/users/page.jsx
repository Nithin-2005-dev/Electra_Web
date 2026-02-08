"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../app/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
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
  const [createdAfter, setCreatedAfter] = useState("");
  const [ordersAfter, setOrdersAfter] = useState("");
  const [orderedProduct, setOrderedProduct] = useState("");

  /* ───── ADMIN GUARD + LOAD DATA ───── */
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

        /* Load users */
        const usersSnap = await getDocs(collection(db, "users"));
        const usersData = usersSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            uid: data.uid || d.id,
            name: data.name?.trim() || "",
            email: data.email?.trim() || "",
            phone: data.phone?.trim() || "",
            stream: data.stream?.trim() || "",
            year: data.year ? String(data.year).trim() : "",
            role: data.role?.trim() || "",
            createdAt: data.createdAt || null,
          };
        });

        /* Load orders */
        const ordersSnap = await getDocs(collection(db, "orders"));
        const map = {};

        ordersSnap.forEach((d) => {
          const o = d.data();
          if (!o.userId) return;

          if (!map[o.userId]) map[o.userId] = [];

          map[o.userId].push({
            id: d.id,
            ...o,
            totalAmountPaid: Number(o.totalAmountPaid) || 0,
          });
        });

        setUsers(usersData);
        setOrdersMap(map);
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    });

    return () => unsub();
  }, [router]);

  /* Date conversion */
  const createdAfterDate = createdAfter
    ? new Date(createdAfter + ":00")
    : null;

  const ordersAfterDate = ordersAfter
    ? new Date(ordersAfter + ":00")
    : null;

  /* Orders filter */
  const getFilteredOrders = (uid) => {
    let orders = ordersMap[uid] || [];

    if (ordersAfterDate) {
      orders = orders.filter((o) => {
        const d = getDateFromTimestamp(o.createdAt || o.timestamp);
        return d && d.getTime() >= ordersAfterDate.getTime();
      });
    }

    return orders;
  };

  /* ───── FILTER USERS ───── */
  const filteredUsers = useMemo(() => {
    const qSearch = search.trim().toLowerCase();
    const qProduct = orderedProduct.trim().toLowerCase();

    return users.filter((u) => {
      const orders = getFilteredOrders(u.uid);
      const createdAt = getDateFromTimestamp(u.createdAt);

      /* Search */
      if (qSearch) {
        const fields = [u.name, u.email, u.phone, u.uid]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());

        if (!fields.some((v) => v.includes(qSearch))) return false;
      }

      if (year && String(u.year) !== String(year)) return false;
      if (stream && u.stream !== stream) return false;
      if (role && u.role !== role) return false;

      /* Created After */
      if (createdAfterDate) {
        if (!createdAt) return false;
        if (createdAt.getTime() < createdAfterDate.getTime()) return false;
      }

      /* Orders existence */
      if (hasOrders === "yes" && orders.length === 0) return false;
      if (hasOrders === "no" && orders.length > 0) return false;

      /* Ordered product */
      if (qProduct) {
        const match = orders.some((o) =>
          getOrderProductNames(o).some((p) =>
            p.toLowerCase().includes(qProduct)
          )
        );
        if (!match) return false;
      }

      return true;
    });
  }, [
    users,
    ordersMap,
    search,
    year,
    stream,
    role,
    hasOrders,
    createdAfterDate,
    ordersAfterDate,
    orderedProduct,
  ]);

  /* Unique stream list (trimmed, no duplicates) */
  const streamOptions = useMemo(() => {
    return [...new Set(users.map((u) => u.stream).filter(Boolean))];
  }, [users]);

  /* CSV Export */
  const exportCsv = () => {
    const rows = filteredUsers.map((u) => {
      const orders = getFilteredOrders(u.uid);

      const totalSpent = orders.reduce(
        (s, o) => s + (o.totalAmountPaid || 0),
        0
      );

      const products = uniqueList(
        orders.flatMap((o) => getOrderProductNames(o))
      );

      return {
        name: u.name,
        email: u.email,
        phone: u.phone,
        stream: u.stream,
        year: u.year,
        role: u.role,
        createdAt: formatDateForCsv(u.createdAt),
        ordersCount: orders.length,
        totalSpent,
        orderedProducts: products.join(" | "),
      };
    });

    downloadCsv(toCsv(rows), `users-${Date.now()}.csv`);
  };

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-black text-slate-400">
        Loading users…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Admin · Users</h1>

      <input
        placeholder="Search name / email / phone / uid"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-black border border-white/10 rounded-lg text-sm"
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <DateFilter label="User Created After" value={createdAfter} setValue={setCreatedAfter} />
        <DateFilter label="Orders After" value={ordersAfter} setValue={setOrdersAfter} />

        <TextFilter label="Ordered Product" value={orderedProduct} setValue={setOrderedProduct} />

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
          Export ({filteredUsers.length})
        </button>
      </div>

      <div className="space-y-3">
        {filteredUsers.map((u) => {
          const orders = getFilteredOrders(u.uid);
          const spent = orders.reduce((s, o) => s + o.totalAmountPaid, 0);

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
                  <p>{orders.length} orders</p>
                  <p className="text-cyan-300">₹{spent}</p>
                </div>
              </div>
            </div>
          );
        })}
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

function getDateFromTimestamp(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateForCsv(value) {
  const d = getDateFromTimestamp(value);
  return d ? d.toISOString() : "";
}

function getOrderProductNames(order) {
  if (!order) return [];
  if (Array.isArray(order.items)) {
    return order.items.map((i) => i.productName || i.productId).filter(Boolean);
  }
  return [order.productName || order.productId].filter(Boolean);
}

function uniqueList(arr) {
  return [...new Set(arr)];
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


