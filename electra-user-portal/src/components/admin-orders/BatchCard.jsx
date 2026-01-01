"use client";

import React, { useMemo } from "react";
import * as XLSX from "xlsx";

export default function BatchCard({
  productId,
  productName,
  orders = [], // 🔥 actually ITEMS
  action,
  onAction,
}) {
  /* ───────── NORMALIZE ITEMS ───────── */
  const items = useMemo(() => {
    return orders
      .filter((i) => i.productId === productId)
      .map((i) => ({
        ...i,
        quantity: Number(i.quantity ?? 1),
      }));
  }, [orders, productId]);

  /* ───────── COUNTS ───────── */
  const totalProducts = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const totalOrders = useMemo(
    () => new Set(items.map((i) => i.orderId)).size,
    [items]
  );

  /* ───────── EXPORT TO EXCEL (ITEM LEVEL) ───────── */
  const exportToExcel = () => {
    if (!items.length) return;

    const rows = items.map((i) => ({
      Order_ID: i.orderId,
      Product_Name: productName,
      Product_ID: productId,

      Size: i.size || "",
      Quantity: i.quantity,
      Unit_Price: i.price || 0,
      Subtotal: (i.price || 0) * i.quantity,

      Print_Name: i.printName ? "Yes" : "No",
      Printed_Name: i.printedName || "",
      Print_Name_Charge: i.printName ? 50 : 0,

      Outside_Campus: i.isOutsideCampus ? "Yes" : "No",
      Delivery_Charge: i.deliveryCharge || 0,

      Payment_Status: i.paymentStatus,
      Transaction_ID: i.txnId || "",
      Total_Amount_Paid: i.totalAmountPaid || 0,

      Customer_Name: i.deliveryAddress?.fullName || "",
      Customer_Phone: i.deliveryAddress?.phone || "",
      Address: i.deliveryAddress?.addressLine || "",
      City: i.deliveryAddress?.city || "",
      Pincode: i.deliveryAddress?.pincode || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      productName.slice(0, 31)
    );

    XLSX.writeFile(
      wb,
      `${productName.replace(/\s+/g, "_")}_BATCH.xlsx`
    );
  };

  return (
    <div className="batch-card">
      {/* LEFT */}
      <div className="info">
        <h3 className="product">{productName}</h3>
        <p className="count">
          <strong>{totalOrders}</strong> orders ·{" "}
          <strong>{totalProducts}</strong> T-shirts
        </p>
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <button
          className="export-btn"
          onClick={exportToExcel}
          disabled={!items.length}
        >
          Export Excel
        </button>

        {action && (
          <button className="action-btn" onClick={onAction}>
            {action}
          </button>
        )}
      </div>

      <style jsx>{`
        .batch-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.2rem;
          padding: 1.1rem 1.3rem;
          border-radius: 16px;
          background: linear-gradient(
            180deg,
            rgba(11, 15, 21, 0.95),
            rgba(6, 8, 12, 0.95)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .product {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .count {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .count strong {
          color: #22d3ee;
        }

        .actions {
          display: flex;
          gap: 0.6rem;
        }

        .export-btn,
        .action-btn {
          padding: 0.55rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          color: #e5e7eb;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .export-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
