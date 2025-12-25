import { NextResponse } from "next/server";
import admin, { adminDb } from "../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../lib/adminGaurd";
import { sendUserOrderEmail } from "../../../lib/email";

export async function POST(req) {
  try {
    await requireAdmin(req);
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // 1️⃣ Get shipped orders
    const snap = await adminDb
      .collection("orders")
      .where("productId", "==", productId)
      .where("fulfillmentStatus", "==", "shipped")
      .get();

    if (snap.empty) {
      return NextResponse.json(
        { error: "No orders to deliver" },
        { status: 400 }
      );
    }

    const batch = adminDb.batch();

    for (const docSnap of snap.docs) {
      const order = docSnap.data();

      // 2️⃣ Update order
      batch.update(docSnap.ref, {
        fulfillmentStatus: "delivered",
        deliveredAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 3️⃣ Fetch user
      const userSnap = await adminDb
        .collection("users")
        .doc(order.userId)
        .get();
      if (!userSnap.exists) continue;

      const user = userSnap.data();

      // 4️⃣ Send DELIVERED email
      await sendUserOrderEmail(
        user,
        "Your Electra order has been delivered 📦",
        `
        <p>Your order <strong>${order.orderId}</strong> has been successfully delivered.</p>
        <p>We hope you enjoy your purchase!</p>
        `
      );
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Deliver error:", err);
    const msg = err?.message || "Server error";
    const status = msg.toLowerCase().includes("missing") ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
