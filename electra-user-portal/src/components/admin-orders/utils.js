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

  batch.orders.forEach((order) => {
    const base = {
      Order_ID: order.orderId,
      Payment_Status: order.paymentStatus,
      Fulfillment_Status: order.fulfillmentStatus || "placed",
      Transaction_ID: order.txnId || "",
      Outside_Campus: order.isOutsideCampus ? "Yes" : "No",
      Delivery_Charge: order.deliveryCharge || 0,
      Total_Amount_Paid: order.totalAmountPaid || order.amount || 0,
      Created_At: order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleString("en-IN")
        : "",
    };

    // CART ORDER
    if (Array.isArray(order.items)) {
      order.items
        .filter((i) => i.productId === batch.productId)
        .forEach((item) => {
          const qty = Number(item.quantity || 1);

          for (let i = 0; i < qty; i++) {
            rows.push({
              ...base,
              Product_ID: batch.productId,
              Product_Name: item.productName,
              Size: item.size || "",
              Print_Name: item.printName ? "Yes" : "No",
              Printed_Name: item.printedName || "",
              Unit_Price: item.price || 0,
            });
          }
        });

      return;
    }

    // BUY-NOW ORDER
    if (order.productId === batch.productId) {
      rows.push({
        ...base,
        Product_ID: batch.productId,
        Product_Name: order.productName,
        Size: order.size || "",
        Print_Name: order.printName ? "Yes" : "No",
        Printed_Name: order.printedName || "",
        Unit_Price: order.amount || 0,
      });
    }
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Orders");

  const safeName = batch.productName
    .replace(/\s+/g, "_")
    .toLowerCase();

  XLSX.writeFile(
    wb,
    `${safeName}_${rows.length}_tshirts.xlsx`
  );
}
