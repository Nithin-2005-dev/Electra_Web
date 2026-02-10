"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "All time", value: "all" },
];

export default function AdminMerchAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [error, setError] = useState("");
  const [adminReady, setAdminReady] = useState(false);

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

        setAdminReady(true);
      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    });

    return () => unsub();
  }, [router]);

  const loadData = async (rangeValue) => {
    try {
      setLoading(true);
      setError("");

      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;

      const res = await fetch(
        `/api/admin/merch-analytics?range=${encodeURIComponent(rangeValue)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) {
        throw new Error("Failed");
      }

      const data = await res.json();
      setEvents(data.events || []);
      setProductsMap(data.products || {});
      setUsersMap(data.users || {});
      setOrders(data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminReady) return;
    loadData(range);
  }, [adminReady, range]);

  const stats = useMemo(() => {
    const merchViews = events.filter((e) => e.type === "merch_page_view");
    const productViews = events.filter((e) => e.type === "product_view");
    const attempts = events.filter((e) => e.type === "add_to_cart_attempt");
    const successes = events.filter((e) => e.type === "add_to_cart_success");

    const uniqueViewers = new Set(
      merchViews.map((e) => e.sessionId || e.userId).filter(Boolean)
    ).size;

    const conversion = attempts.length
      ? ((successes.length / attempts.length) * 100).toFixed(1)
      : "0.0";

    return {
      merchViews: merchViews.length,
      uniqueViewers,
      productViews: productViews.length,
      attempts: attempts.length,
      successes: successes.length,
      conversion,
    };
  }, [events]);

  const topProducts = useMemo(() => {
    const map = {};
    for (const e of events) {
      if (!e.productId) continue;
      if (!map[e.productId]) {
        map[e.productId] = { attempts: 0, successes: 0, views: 0 };
      }
      if (e.type === "add_to_cart_attempt") map[e.productId].attempts += 1;
      if (e.type === "add_to_cart_success") map[e.productId].successes += 1;
      if (e.type === "product_view") map[e.productId].views += 1;
    }
    return Object.entries(map)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 8);
  }, [events]);

  const recentEvents = useMemo(() => events.slice(0, 40), [events]);

  const paidOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!o) return false;
      const status = o.paymentStatus;
      return status && status !== "pending_payment" && status !== "rejected";
    });
  }, [orders]);

  const orderTotal = (o) => {
    if (!o) return 0;
    if (o.totalAmountPaid && o.totalAmountPaid > 0) return o.totalAmountPaid;
    return (
      (Number(o.amount) || 0) +
      (Number(o.printNameCharge) || 0) +
      (Number(o.deliveryCharge) || 0)
    );
  };

  const revenueStats = useMemo(() => {
    const revenue = paidOrders.reduce((s, o) => s + orderTotal(o), 0);
    const buyers = new Set(
      paidOrders.map((o) => o.userId).filter(Boolean)
    );
    const ordersCount = paidOrders.length;
    const aov = ordersCount ? (revenue / ordersCount).toFixed(0) : "0";
    const itemsSold = paidOrders.reduce((s, o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      return (
        s +
        items.reduce((t, i) => t + (Number(i.quantity) || 1), 0)
      );
    }, 0);

    const buyerCounts = {};
    paidOrders.forEach((o) => {
      if (!o.userId) return;
      buyerCounts[o.userId] = (buyerCounts[o.userId] || 0) + 1;
    });

    const repeatBuyers = Object.values(buyerCounts).filter((c) => c >= 2).length;

    return {
      revenue,
      buyers: buyers.size,
      ordersCount,
      aov,
      itemsSold,
      repeatBuyers,
    };
  }, [paidOrders]);

  const topProductsByRevenue = useMemo(() => {
    const map = {};
    paidOrders.forEach((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((i) => {
        const pid = i.productId || i.productName;
        if (!pid) return;
        if (!map[pid]) map[pid] = { revenue: 0, qty: 0 };
        const qty = Number(i.quantity) || 1;
        const price = Number(i.price) || 0;
        map[pid].revenue += qty * price;
        map[pid].qty += qty;
      });
    });
    return Object.entries(map)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [paidOrders]);

  const topBuyers = useMemo(() => {
    const map = {};
    paidOrders.forEach((o) => {
      if (!o.userId) return;
      if (!map[o.userId]) map[o.userId] = { orders: 0, spend: 0 };
      map[o.userId].orders += 1;
      map[o.userId].spend += orderTotal(o);
    });
    return Object.entries(map)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 8);
  }, [paidOrders]);

  const recentPurchases = useMemo(() => {
    return [...paidOrders]
      .sort((a, b) => compareDate(b.updatedAt || b.createdAt, a.updatedAt || a.createdAt))
      .slice(0, 10);
  }, [paidOrders]);

  const funnelConversion = useMemo(() => {
    const purchaseCount = paidOrders.length;
    const addSuccess = events.filter((e) => e.type === "add_to_cart_success")
      .length;
    const viewCount = events.filter((e) => e.type === "merch_page_view")
      .length;
    return {
      viewToCart: viewCount ? ((addSuccess / viewCount) * 100).toFixed(1) : "0.0",
      cartToPurchase: addSuccess
        ? ((purchaseCount / addSuccess) * 100).toFixed(1)
        : "0.0",
    };
  }, [events, paidOrders]);

  const attemptUsers = useMemo(() => {
    const map = {};
    for (const e of events) {
      if (e.type !== "add_to_cart_attempt") continue;
      const key = e.userId || e.sessionId;
      if (!key) continue;
      if (!map[key] || compareDate(e.createdAt, map[key].createdAt) > 0) {
        map[key] = e;
      }
    }
    return Object.values(map)
      .sort((a, b) => compareDate(b.createdAt, a.createdAt))
      .slice(0, 12);
  }, [events]);

  const successUsers = useMemo(() => {
    const map = {};
    for (const e of events) {
      if (e.type !== "add_to_cart_success") continue;
      const key = e.userId || e.sessionId;
      if (!key) continue;
      if (!map[key] || compareDate(e.createdAt, map[key].createdAt) > 0) {
        map[key] = e;
      }
    }
    return Object.values(map)
      .sort((a, b) => compareDate(b.createdAt, a.createdAt))
      .slice(0, 12);
  }, [events]);

  if (loading) {
    return (
      <main className="ana-page">
        <div className="ana-center">Loading analytics…</div>
        <style jsx>{baseStyles}</style>
      </main>
    );
  }

  return (
    <main className="ana-page">
      <header className="ana-header">
        <div>
          <h1>Merch Analytics</h1>
          <p>Visibility, intent, and cart activity</p>
        </div>
        <div className="ana-controls">
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            {RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button onClick={() => loadData(range)}>Refresh</button>
        </div>
      </header>

      {error && <p className="ana-error">{error}</p>}

      <section className="ana-cards">
        <StatCard label="Merch Page Views" value={stats.merchViews} />
        <StatCard label="Unique Viewers" value={stats.uniqueViewers} />
        <StatCard label="Product Views" value={stats.productViews} />
        <StatCard label="Add to Cart Attempts" value={stats.attempts} />
        <StatCard label="Add to Cart Success" value={stats.successes} />
        <StatCard label="Cart Conversion" value={`${stats.conversion}%`} />
        <StatCard label="Orders (Paid)" value={revenueStats.ordersCount} />
        <StatCard label="Revenue" value={`₹${revenueStats.revenue}`} />
        <StatCard label="Avg Order Value" value={`₹${revenueStats.aov}`} />
        <StatCard label="Items Sold" value={revenueStats.itemsSold} />
        <StatCard label="Unique Buyers" value={revenueStats.buyers} />
        <StatCard label="Repeat Buyers" value={revenueStats.repeatBuyers} />
        <StatCard label="View → Cart" value={`${funnelConversion.viewToCart}%`} />
        <StatCard label="Cart → Purchase" value={`${funnelConversion.cartToPurchase}%`} />
      </section>

      <section className="ana-grid">
        <div className="ana-panel">
          <div className="ana-panel-head">
            <h2>Top Products</h2>
            <span>By add-to-cart attempts</span>
          </div>
          <div className="ana-list">
            {topProducts.map((p) => (
              <div key={p.id} className="ana-row">
                <div className="ana-row-left">
                  <p className="ana-name">{productsMap[p.id]?.name || p.id}</p>
                  <span className="ana-meta">
                    Views: {p.views} · Attempts: {p.attempts} · Success:{" "}
                    {p.successes}
                  </span>
                </div>
                <div className="ana-pill">{p.attempts}</div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="ana-empty">No data yet.</div>
            )}
          </div>
        </div>

        <div className="ana-panel">
          <div className="ana-panel-head">
            <h2>Recent Activity</h2>
            <span>Latest 40 events</span>
          </div>
          <div className="ana-table">
            <div className="ana-table-head">
              <span>Time</span>
              <span>Event</span>
              <span>Product</span>
              <span>User</span>
            </div>
            {recentEvents.map((e) => (
              <div key={e.id} className="ana-table-row">
                <span className="ana-mono">{formatDate(e.createdAt)}</span>
                <span className="ana-chip">{prettyEvent(e.type)}</span>
                <span>{productsMap[e.productId]?.name || e.productId || "-"}</span>
                <span className="ana-user">
                  {e.userId
                    ? usersMap[e.userId]?.name ||
                      usersMap[e.userId]?.email ||
                      shortId(e.userId)
                    : "Anonymous"}
                </span>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <div className="ana-empty">No events to show.</div>
            )}
          </div>
        </div>
      </section>

      <section className="ana-grid ana-users">
        <div className="ana-panel">
          <div className="ana-panel-head">
            <h2>Users Trying to Add</h2>
            <span>Latest attempts</span>
          </div>
          <div className="ana-list">
            {attemptUsers.map((e) => (
              <div key={e.id} className="ana-row">
                <div className="ana-row-left">
                  <p className="ana-name">
                    {e.userId
                      ? usersMap[e.userId]?.name ||
                        usersMap[e.userId]?.email ||
                        shortId(e.userId)
                      : "Anonymous"}
                  </p>
                  <span className="ana-meta">
                    {productsMap[e.productId]?.name || e.productId || "-"} ·{" "}
                    {formatDate(e.createdAt)}
                  </span>
                </div>
                <div className="ana-pill">Try</div>
              </div>
            ))}
            {attemptUsers.length === 0 && (
              <div className="ana-empty">No attempts yet.</div>
            )}
          </div>
        </div>

        <div className="ana-panel">
          <div className="ana-panel-head">
            <h2>Users Added to Cart</h2>
            <span>Latest successes</span>
          </div>
          <div className="ana-list">
            {successUsers.map((e) => (
              <div key={e.id} className="ana-row">
                <div className="ana-row-left">
                  <p className="ana-name">
                    {e.userId
                      ? usersMap[e.userId]?.name ||
                        usersMap[e.userId]?.email ||
                        shortId(e.userId)
                      : "Anonymous"}
                  </p>
                  <span className="ana-meta">
                    {productsMap[e.productId]?.name || e.productId || "-"} ·{" "}
                    {formatDate(e.createdAt)}
                  </span>
                </div>
                <div className="ana-pill">Cart</div>
              </div>
            ))}
            {successUsers.length === 0 && (
              <div className="ana-empty">No cart adds yet.</div>
            )}
          </div>
        </div>
      </section>

      <section className="ana-grid ana-users">
        <div className="ana-panel">
          <div className="ana-panel-head">
            <h2>Top Products by Revenue</h2>
            <span>Paid orders only</span>
          </div>
          <div className="ana-list">
            {topProductsByRevenue.map((p) => (
              <div key={p.id} className="ana-row">
                <div className="ana-row-left">
                  <p className="ana-name">{productsMap[p.id]?.name || p.id}</p>
                  <span className="ana-meta">
                    Revenue: ₹{p.revenue} · Qty: {p.qty}
                  </span>
                </div>
                <div className="ana-pill">₹{p.revenue}</div>
              </div>
            ))}
            {topProductsByRevenue.length === 0 && (
              <div className="ana-empty">No revenue data yet.</div>
            )}
          </div>
        </div>

        <div className="ana-panel">
          <div className="ana-panel-head">
            <h2>Top Buyers</h2>
            <span>Total spend</span>
          </div>
          <div className="ana-list">
            {topBuyers.map((b) => (
              <div key={b.id} className="ana-row">
                <div className="ana-row-left">
                  <p className="ana-name">
                    {usersMap[b.id]?.name ||
                      usersMap[b.id]?.email ||
                      shortId(b.id)}
                  </p>
                  <span className="ana-meta">
                    Orders: {b.orders} · Spend: ₹{b.spend}
                  </span>
                </div>
                <div className="ana-pill">₹{b.spend}</div>
              </div>
            ))}
            {topBuyers.length === 0 && (
              <div className="ana-empty">No buyers yet.</div>
            )}
          </div>
        </div>
      </section>

      <section className="ana-grid">
        <div className="ana-panel">
          <div className="ana-panel-head">
            <h2>Recent Purchases</h2>
            <span>Latest paid orders</span>
          </div>
          <div className="ana-table">
            <div className="ana-table-head">
              <span>Time</span>
              <span>Order</span>
              <span>Buyer</span>
              <span>Amount</span>
            </div>
            {recentPurchases.map((o) => (
              <div key={o.id} className="ana-table-row">
                <span className="ana-mono">
                  {formatDate(o.updatedAt || o.createdAt)}
                </span>
                <span>{o.orderId}</span>
                <span className="ana-user">
                  {o.userId
                    ? usersMap[o.userId]?.name ||
                      usersMap[o.userId]?.email ||
                      shortId(o.userId)
                    : "Anonymous"}
                </span>
                <span>₹{orderTotal(o)}</span>
              </div>
            ))}
            {recentPurchases.length === 0 && (
              <div className="ana-empty">No purchases yet.</div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{baseStyles}</style>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="ana-card">
      <p className="ana-label">{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
}

function shortId(id) {
  return String(id).slice(0, 6);
}

function prettyEvent(type) {
  if (!type) return "-";
  return String(type).replaceAll("_", " ");
}

function compareDate(a, b) {
  const da = new Date(a || 0);
  const db = new Date(b || 0);
  return da.getTime() - db.getTime();
}

const baseStyles = `
  .ana-page {
    min-height: 100vh;
    background: #000;
    color: #fff;
    padding: 2.6rem 2rem 4rem;
  }

  .ana-center {
    display: grid;
    place-items: center;
    min-height: 60vh;
    color: #9ca3af;
  }

  .ana-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
  }

  .ana-header p {
    color: #9ca3af;
    margin-top: 0.3rem;
  }

  .ana-controls {
    display: flex;
    gap: 0.8rem;
    align-items: center;
  }

  .ana-controls select {
    background: #0b0f15;
    color: #e5e7eb;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.5rem 0.7rem;
    border-radius: 10px;
    font-size: 0.85rem;
  }

  .ana-controls button {
    background: #fff;
    color: #000;
    border: none;
    padding: 0.55rem 1rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
  }

  .ana-error {
    color: #fca5a5;
    margin-bottom: 1rem;
  }

  .ana-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .ana-card {
    background: #0b0f15;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 1.2rem 1.1rem;
  }

  .ana-card .ana-label {
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.4rem;
  }

  .ana-card h3 {
    font-size: 1.4rem;
    font-weight: 700;
  }

  .ana-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 1.6rem;
  }

  .ana-grid.ana-users {
    margin-top: 1.6rem;
  }

  .ana-panel {
    background: #0b0f15;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 1.4rem 1.2rem;
  }

  .ana-panel-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  .ana-panel-head h2 {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .ana-panel-head span {
    color: #9ca3af;
    font-size: 0.8rem;
  }

  .ana-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .ana-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.65rem 0.8rem;
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
  }

  .ana-row .ana-name {
    font-weight: 600;
  }

  .ana-row .ana-meta {
    color: #9ca3af;
    font-size: 0.75rem;
  }

  .ana-pill {
    min-width: 36px;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: rgba(34, 211, 238, 0.15);
    color: #22d3ee;
    font-weight: 700;
    font-size: 0.8rem;
    text-align: center;
  }

  .ana-table {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .ana-table-head,
  .ana-table-row {
    display: grid;
    grid-template-columns: 1.1fr 1fr 1.2fr 1fr;
    gap: 0.8rem;
    align-items: center;
  }

  .ana-table-head {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9ca3af;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .ana-table-row {
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 0.85rem;
  }

  .ana-mono {
    font-variant-numeric: tabular-nums;
    color: #cbd5f5;
  }

  .ana-chip {
    display: inline-flex;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.07);
    font-size: 0.72rem;
    text-transform: capitalize;
  }

  .ana-user {
    color: #e5e7eb;
  }

  .ana-empty {
    color: #9ca3af;
    font-size: 0.85rem;
    padding: 0.8rem 0;
  }

  @media (max-width: 1100px) {
    .ana-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .ana-table-head,
    .ana-table-row {
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: auto;
    }

    .ana-table-head span:nth-child(3),
    .ana-table-head span:nth-child(4),
    .ana-table-row span:nth-child(3),
    .ana-table-row span:nth-child(4) {
      display: none;
    }
  }

  @media (max-width: 520px) {
    .ana-cards {
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }
  }
`;
