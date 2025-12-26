"use client";

import React from "react";
import * as XLSX from "xlsx";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../app/lib/firebase";

export default function BatchCard({
  productName,
  orders = [],
  action,
  onAction,
}) {
  /* ───────── EXPORT TO EXCEL ───────── */
  const exportToExcel = async () => {
    if (!orders.length) return;

    /* 1️⃣ Collect unique userIds from orders */
    const userIds = [
      ...new Set(
        orders.map((o) => o.userId).filter(Boolean)
      ),
    ];

    /* 2️⃣ Fetch users */
    const userMap = {};

    // Firestore "in" query supports max 10 values
    for (let i = 0; i < userIds.length; i += 10) {
      const batch = userIds.slice(i, i + 10);

      const q = query(
        collection(db, "users"),
        where("uid", "in", batch)
      );

      const snap = await getDocs(q);
      snap.forEach((doc) => {
        userMap[doc.data().uid] = doc.data();
      });
    }

    /* 3️⃣ Build Excel rows */
    const rows = orders.map((o) => {
      const user = userMap[o.userId] || {};
      const addr = o.deliveryAddress || {};

      return {
        // ORDER
        Order_ID: o.orderId,
        Product_Name: o.productName,
        Product_ID: o.productId,
        Size: o.size || "",
        Base_Amount: o.amount || 0,

        // DELIVERY
        Outside_Campus: o.isOutsideCampus ? "Yes" : "No",
        Delivery_Charge: o.deliveryCharge || 0,

        // PRINT NAME
        Print_Name: o.printName ? "Yes" : "No",
        Print_Name_Charge: o.printNameCharge || 0,
        Printed_Name: o.printedName || "",

        // PAYMENT
        Total_Amount_Paid: o.totalAmountPaid || 0,
        Payment_Status: o.paymentStatus,
        Transaction_ID: o.txnId || "",
        Payment_Screenshot: o.paymentScreenshotUrl || "",
        Approved_At: o.approvedAt
          ? new Date(
              o.approvedAt.seconds * 1000
            ).toLocaleString("en-IN")
          : "",
        Approved_By: o.approvedBy || "",

        // DELIVERY ADDRESS
        Customer_Name: addr.fullName || "",
        Customer_Phone: addr.phone || "",
        Address: addr.addressLine || "",
        City: addr.city || "",
        Pincode: addr.pincode || "",

        // USER DETAILS (🔥 FIXED)
        User_Name: user.name || "",
        User_Email: user.email || "",
        User_Phone: user.phone || "",
        College: user.college || "",
        Stream: user.stream || "",
        Year: user.year || "",
        User_Role: user.role || "",
      };
    });

    /* 4️⃣ Export Excel */
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      productName.slice(0, 31)
    );

    XLSX.writeFile(
      workbook,
      `${productName.replace(/\s+/g, "_")}_ALL_ORDERS.xlsx`
    );
  };

  return (
    <div className="batch-card">
      {/* LEFT */}
      <div className="info">
        <h3 className="product">{productName}</h3>
        <p className="count">
          <strong>{orders.length}</strong> orders
        </p>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="actions">
        <button
          className="export-btn"
          onClick={exportToExcel}
          disabled={!orders.length}
        >
          Export Excel
        </button>

        {action && (
          <button
            className={`action-btn ${
              action === "Reject" ? "danger" : ""
            }`}
            onClick={onAction}
          >
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

        .info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .product {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .count {
          margin: 0;
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

        .export-btn {
          padding: 0.55rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          color: #e5e7eb;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .export-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .action-btn {
          padding: 0.55rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(34, 211, 238, 0.4);
          background: rgba(34, 211, 238, 0.12);
          color: #22d3ee;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .action-btn.danger {
          border-color: rgba(248, 113, 113, 0.45);
          background: rgba(248, 113, 113, 0.12);
          color: #f87171;
        }
      `}</style>
    </div>
  );
}
