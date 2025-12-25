// src/app/api/admin/approve/route.js

import { NextResponse } from "next/server";
import admin, { adminDb } from "../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../lib/adminGaurd";
import { sendUserOrderEmail } from "../../../lib/email";

export async function POST(req) {
  try {
    // 1️⃣ Verify admin
    const adminUid = await requireAdmin(req);

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch order
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orderSnap.data();

    if (order.paymentStatus !== "pending_verification") {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    // 3️⃣ Fetch user (CRITICAL — same as reject)
    const userSnap = await adminDb
      .collection("users")
      .doc(order.userId)
      .get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userSnap.data();

    // 4️⃣ Update order
    await orderRef.update({
      paymentStatus: "confirmed",
      approvedBy: adminUid,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 5️⃣ Notify user
    await sendUserOrderEmail(
      user,
      "Your Electra order is confirmed 🎉",
      `Your order ${order.orderId} has been approved and confirmed.
We’ll notify you once it’s shipped.`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 500 }
    );
  }
}
