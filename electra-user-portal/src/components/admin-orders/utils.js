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

/* ───────────────── BULK GROUPING (FIXED) ───────────────── */
/**
 * Groups orders by productId (ITEM-AWARE)
 * - Supports cart + buy-now orders
 * - Preserves full order reference
 * - Quantity-safe
 */
export function groupBulkByProduct(orders) {
  const map = new Map();

  for (const order of orders) {
    // Case 1: cart-based order
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        const pid = item.productId;
        if (!pid) continue;

        if (!map.has(pid)) {
          map.set(pid, {
            productId: pid,
            productName: item.productName,
            orders: [],
          });
        }

        map.get(pid).orders.push(order);
      }
      continue;
    }

    // Case 2: buy-now / legacy
    if (order.productId) {
      if (!map.has(order.productId)) {
        map.set(order.productId, {
          productId: order.productId,
          productName: order.productName,
          orders: [],
        });
      }

      map.get(order.productId).orders.push(order);
    }
  }

  return Array.from(map.values());
}

/* ───────────────── EXCEL EXPORT (ITEM-LEVEL) ───────────────── */
/**
 * Exports ONE product batch
 * Each row = ONE T-SHIRT (quantity exploded)
 */



export function exportProductOrdersToExcel(batch) {
  if (!batch?.orders?.length) return;

  const rows = [];

  batch.orders.forEach((i) => {
    rows.push({
      /* ───────── ORDER META ───────── */
      Order_ID: i.orderId || "",
      User_ID: i.userId || "",
      Payment_Status: i.paymentStatus || "",
      Transaction_ID: i.txnId || "",
      Approved_At: i.approvedAt?.toDate
        ? i.approvedAt.toDate().toLocaleString("en-IN")
        : "",
      Created_At: i.createdAt?.toDate
        ? i.createdAt.toDate().toLocaleString("en-IN")
        : "",
      Updated_At: i.updatedAt?.toDate
        ? i.updatedAt.toDate().toLocaleString("en-IN")
        : "",

      /* ───────── CUSTOMER ───────── */
      Customer_Name: i.deliveryAddress?.fullName || "",
      Phone: i.deliveryAddress?.phone || "",
      Address: i.deliveryAddress?.addressLine || "",
      City: i.deliveryAddress?.city || "",
      Pincode: i.deliveryAddress?.pincode || "",
      Outside_Campus: i.isOutsideCampus ? "Yes" : "No",

      /* ───────── PRODUCT ───────── */
      Product_ID: i.productId || "",
      Product_Name: i.productName || "",
      Size: i.size || "",
      Quantity: Number(i.quantity || 1),

      /* ───────── PRINT LOGIC (IMPORTANT) ───────── */
      Print_Name: i.printName ? "Yes" : "No",
      Printed_Name: i.printName
        ? i.printedName || ""
        : "ALL",

      /* ───────── PRICING ───────── */
      Unit_Price: Number(i.price || 0),
      Item_Total:
        Number(i.price || 0) * Number(i.quantity || 1),
      Print_Name_Charge: i.printName ? 50 : 0,
      Delivery_Charge: Number(i.deliveryCharge || 0),
      Total_Amount_Paid: Number(i.totalAmountPaid || 0),

      /* ───────── FULFILLMENT ───────── */
      Fulfillment_Status: i.fulfillmentStatus || "",
      Shipped_At: i.shippedAt?.toDate
        ? i.shippedAt.toDate().toLocaleString("en-IN")
        : "",
      Delivered_At: i.deliveredAt?.toDate
        ? i.deliveredAt.toDate().toLocaleString("en-IN")
        : "",
    });
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Orders");

  const safeName = batch.productName
    .replace(/\s+/g, "_")
    .toLowerCase();

  XLSX.writeFile(
    wb,
    `${safeName}_FULL_EXPORT_${rows.length}.xlsx`
  );
}
