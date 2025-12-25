import { NextResponse } from "next/server";
import admin, { adminDb } from "../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../lib/adminGaurd";
import { sendUserOrderEmail } from "../../../lib/email";

export async function POST(req) {
  try {
    const adminUid = await requireAdmin(req);
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch order
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orderSnap.data();

    // 2️⃣ Fetch user (THIS WAS MISSING)
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

    // 3️⃣ Update order
    await orderRef.update({
      paymentStatus: "rejected",
      rejectedBy: adminUid,
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4️⃣ Notify user (PASS USER OBJECT, NOT EMAIL STRING)
    await sendUserOrderEmail(
      user,
      "Your Electra order was rejected ❌",
      `Your order ${order.orderId} was rejected due to payment verification issues.
If you believe this is a mistake, please contact the Electra team.`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reject error:", err);
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 500 }
    );
  }
}
