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
    const ref = adminDb.collection("orders").doc(orderId);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = snap.data();

    if (order.paymentStatus !== "pending_verification") {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // 3️⃣ Update order (ADMIN SDK TIMESTAMPS)
    await ref.update({
      paymentStatus: "confirmed",
      approvedBy: adminUid,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4️⃣ Notify user
    if (order.email) {
      await sendUserOrderEmail(
        order.email,
        "Your Electra order is confirmed 🎉",
        `Your order ${order.orderId} has been approved and confirmed.`
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }
}
