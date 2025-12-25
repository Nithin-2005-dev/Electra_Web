import { auth } from "../../app/lib/firebase";
import * as XLSX from "xlsx";

/* ───────────────── ADMIN API CALL ───────────────── */

export async function adminApi(url, payload) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Admin action failed";
    try {
      const err = await res.json();
      msg = err.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
}

/* ───────────────── BULK GROUPING ───────────────── */
/**
 * Groups orders by productId for bulk operations
 * Keeps full order list for export / inspection
 */
export function groupBulkByProduct(orders) {
  const map = new Map();

  for (const o of orders) {
    if (!map.has(o.productId)) {
      map.set(o.productId, {
        productId: o.productId,
        productName: o.productName,
        count: 0,
        orders: [], // 🔑 individual orders preserved
      });
    }

    const bucket = map.get(o.productId);
    bucket.count += 1;
    bucket.orders.push(o);
  }

  return Array.from(map.values());
}

/* ───────────────── EXCEL EXPORT ───────────────── */
/**
 * Exports all orders of ONE product batch
 * Each row = one customer/order
 */
export function exportProductOrdersToExcel(batch) {
  if (!batch?.orders?.length) return;

  const rows = batch.orders.map((o) => ({
    OrderID: o.orderId,
    Product: o.productName,
    Amount: o.amount,
    Size: o.size || "",
    PrintName: o.printName ? o.printedName || "" : "",
    TransactionID: o.txnId || "",
    PaymentStatus: o.paymentStatus,
    FulfillmentStatus: o.fulfillmentStatus || "placed",
    CreatedAt: o.createdAt?.toDate
      ? o.createdAt.toDate().toLocaleString("en-IN")
      : "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Orders");

  const safeName = batch.productName
    .replace(/\s+/g, "_")
    .toLowerCase();

  XLSX.writeFile(
    wb,
    `${safeName}_${batch.count}_orders.xlsx`
  );
}
