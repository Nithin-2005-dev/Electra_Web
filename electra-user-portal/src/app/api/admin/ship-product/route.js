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

    // 1️⃣ Fetch confirmed orders for this product and filter eligible ones
    const snap = await adminDb
      .collection("orders")
      .where("productId", "==", productId)
      .where("paymentStatus", "==", "confirmed")
      .get();

    // Filter orders where fulfillmentStatus is missing (undefined) or "pending"
    const eligibleDocs = snap.docs.filter((d) => {
      const ord = d.data();
      return !ord.fulfillmentStatus || ord.fulfillmentStatus === "pending";
    });

    if (eligibleDocs.length === 0) {
      console.log("Ship: eligibleDocs=0 for productId", productId);
      return NextResponse.json({ error: "No orders to ship" }, { status: 400 });
    }

    console.log(
      "Ship: eligibleDocs=",
      eligibleDocs.length,
      "productId=",
      productId
    );

    const batch = adminDb.batch();

    for (const docSnap of eligibleDocs) {
      const order = docSnap.data();

      // 2️⃣ Update order
      batch.update(docSnap.ref, {
        fulfillmentStatus: "shipped",
        shippedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 3️⃣ Fetch user
      const userSnap = await adminDb
        .collection("users")
        .doc(order.userId)
        .get();
      if (!userSnap.exists) continue;

      const user = userSnap.data();

      // 4️⃣ Send SHIPPED email
      await sendUserOrderEmail(
        user,
        "Your Electra order has been shipped 🚚",
        `
        <p>Your order <strong>${order.orderId}</strong> has been shipped.</p>
        <p>Product: <strong>${order.productName}</strong></p>
        <p>It’s on the way and will reach you soon.</p>
        `
      );
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Ship error:", err);
    const msg = err?.message || "Server error";
    const status =
      msg.toLowerCase().includes("missing") ||
      msg.toLowerCase().includes("no orders")
        ? 400
        : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
