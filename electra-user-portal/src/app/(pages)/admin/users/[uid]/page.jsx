"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function AdminUserDetails() {
  const { uid } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  /* ───── FETCH USER + ORDERS ───── */
  useEffect(() => {
    (async () => {
      const userSnap = await getDoc(doc(db, "users", uid));
      if (!userSnap.exists()) return router.replace("/admin");

      setUser(userSnap.data());

      const q = query(
        collection(db, "orders"),
        where("userId", "==", uid)
      );
      const res = await getDocs(q);
      setOrders(res.docs.map((d) => d.data()));
      setLoading(false);
    })();
  }, [uid, router]);

  /* ───── ANALYTICS ───── */
  const stats = useMemo(() => {
    const totalSpent = orders.reduce(
      (s, o) => s + (o.totalAmountPaid || 0),
      0
    );

    return {
      orders: orders.length,
      spent: totalSpent,
      avg: orders.length ? Math.round(totalSpent / orders.length) : 0,
    };
  }, [orders]);

  /* ───── FILTER ───── */
  const filteredOrders = orders.filter((o) =>
    filter === "all" ? true : o.paymentStatus === filter
  );

  if (loading) return <div className="p-10">Loading…</div>;

  return (
    <main className="p-8 bg-black text-white min-h-screen space-y-6">

      {/* USER CARD */}
      <section className="rounded-2xl bg-[#0b0f15] p-6 border border-white/10">
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-sm text-slate-400">{user.email}</p>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>📞 {user.phone}</div>
          <div>🏫 {user.college}</div>
          <div>🎓 {user.stream}</div>
          <div>📅 Year {user.year}</div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Total Orders" value={stats.orders} />
        <Stat label="Total Spent" value={`₹${stats.spent}`} />
        <Stat label="Avg Order" value={`₹${stats.avg}`} />
      </section>

      {/* FILTER */}
      <section className="flex gap-3">
        {["all", "pending_verification", "confirmed", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full border ${
              filter === s
                ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/40"
                : "border-white/10 text-slate-400"
            }`}
          >
            {s.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </section>

      {/* ORDERS */}
      <section className="space-y-3">
        {filteredOrders.map((o) => (
          <div
            key={o.orderId}
            className="p-4 rounded-xl bg-[#0b0f15] border border-white/10"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{o.orderId}</p>
                <p className="text-xs text-slate-400">
                  {o.paymentStatus} · {o.fulfillmentStatus}
                </p>
              </div>
              <p className="font-bold">₹{o.totalAmountPaid}</p>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Items: {o.items?.length || 1} · Txn: {o.txnId}
            </div>

            {o.paymentScreenshotUrl && (
              <a
                href={o.paymentScreenshotUrl}
                target="_blank"
                className="text-cyan-300 text-xs underline mt-2 inline-block"
              >
                View Payment Proof
              </a>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-[#0b0f15] p-5 border border-white/10">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
