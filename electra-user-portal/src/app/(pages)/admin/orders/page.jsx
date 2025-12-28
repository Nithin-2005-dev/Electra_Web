
"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import Toasts from "../../../../components/merch/Toast";
import OrderCard from "../../../../components/admin-orders/OrderCard";
import OrderRow from "../../../../components/admin-orders/OrderRow";
import BatchCard from "../../../../components/admin-orders/BatchCard";

import {
  adminApi,
  groupBulkByProduct,
  exportProductOrdersToExcel,
} from "../../../../components/admin-orders/utils";

export default function AdminOrdersDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("payments");
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  };

  /* ───────── ADMIN GUARD ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.replace("/");

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        return router.replace("/");
      }

      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const res = await getDocs(q);
      setOrders(res.docs.map((d) => d.data()));
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  /* ───────── SEARCH ───────── */
  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) =>
      [o.orderId, o.txnId, o.productName]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [orders, search]);

  /* ───────── BUCKETS ───────── */

  const pendingPayments = filtered.filter(
    (o) => o.paymentStatus === "pending_verification"
  );

  const rejectedOrders = filtered.filter(
    (o) => o.paymentStatus === "rejected"
  );

  const readyToShipBulk = groupBulkByProduct(
    filtered.filter(
      (o) =>
        o.paymentStatus === "confirmed" &&
        (!o.fulfillmentStatus || o.fulfillmentStatus === "placed")
    )
  );

  const shippedBulk = groupBulkByProduct(
    filtered.filter((o) => o.fulfillmentStatus === "shipped")
  );

  const deliveredOrders = filtered.filter(
    (o) => o.fulfillmentStatus === "delivered"
  );

  /* ───────── ACTIONS ───────── */

  const approve = async (orderId) => {
    await adminApi("/api/admin/approve", { orderId });
    setOrders((o) =>
      o.map((x) =>
        x.orderId === orderId
          ? { ...x, paymentStatus: "confirmed" }
          : x
      )
    );
    addToast("Payment approved", "success");
  };

  const reject = async (orderId) => {
    await adminApi("/api/admin/reject", { orderId });
    setOrders((o) =>
      o.map((x) =>
        x.orderId === orderId ? { ...x, paymentStatus: "rejected" } : x
      )
    );
    addToast("Payment rejected", "success");
  };

  const shipProduct = async (productId) => {
    await adminApi("/api/admin/ship-product", { productId });
    setOrders((o) =>
      o.map((x) =>
        x.productId === productId &&
        x.paymentStatus === "confirmed"
          ? { ...x, fulfillmentStatus: "shipped" }
          : x
      )
    );
    addToast("Product shipped", "success");
  };

  const deliverProduct = async (productId) => {
    await adminApi("/api/admin/deliver-product", { productId });
    setOrders((o) =>
      o.map((x) =>
        x.productId === productId &&
        x.fulfillmentStatus === "shipped"
          ? { ...x, fulfillmentStatus: "delivered" }
          : x
      )
    );
    addToast("Product delivered", "success");
  };

  if (loading) {
    return <main className="center">Loading…</main>;
  }

  return (
    <main className="wrap">
      <header className="header">
        <h1>Admin · Orders</h1>
        <input
          placeholder="Search order / txn / product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <nav className="tabs">
        {[
          ["payments", `Payments (${pendingPayments.length})`],
          ["shipping", `Shipping (${readyToShipBulk.length})`],
          ["delivery", `Delivery (${shippedBulk.length})`],
          ["completed", `Completed (${deliveredOrders.length})`],
          ["rejected", `Rejected (${rejectedOrders.length})`],
        ].map(([k, l]) => (
          <button
            key={k}
            className={tab === k ? "active" : ""}
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </nav>

      <Toasts toasts={toasts} onRemove={() => {}} />

      {tab === "payments" &&
        pendingPayments.map((o) => (
          <OrderCard
            key={o.orderId}
            order={o}
            onApprove={approve}
            onReject={reject}
          />
        ))}

      {tab === "shipping" &&
        readyToShipBulk.map((p) => (
          <BatchCard
            key={p.productId}
            {...p}
            action="Mark Shipped"
            onAction={() => shipProduct(p.productId)}
            onExport={() => exportProductOrdersToExcel(p)}
          />
        ))}

      {tab === "delivery" &&
        shippedBulk.map((p) => (
          <BatchCard
            key={p.productId}
            {...p}
            action="Mark Delivered"
            onAction={() => deliverProduct(p.productId)}
            onExport={() => exportProductOrdersToExcel(p)}
          />
        ))}

      {tab === "completed" &&
        deliveredOrders.map((o) => (
          <OrderRow key={o.orderId} order={o} />
        ))}

      {tab === "rejected" &&
        rejectedOrders.map((o) => (
          <OrderRow key={o.orderId} order={o} />
        ))}
        <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 2rem;
        }
        .center {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: #9ca3af;
        }
        .header {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        input {
          padding: 0.5rem;
          background: #000;
          border: 1px solid #333;
          color: #fff;
          border-radius: 6px;
        }
        .tabs {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
          flex-wrap: wrap;
        }
        .tabs button {
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          border: 1px solid #333;
          background: transparent;
          color: #fff;
        }
        .tabs .active {
          background: #fff;
          color: #000;
        }
        .empty {
          color: #9ca3af;
          margin-top: 1rem;
        }
      `}</style>
    </main>
  );
}
