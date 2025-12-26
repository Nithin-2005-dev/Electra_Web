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
   const html=`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmed</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f3f4f6;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  color:#111827;
">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
  <tr>
    <td align="center">

      <table width="100%" cellpadding="0" cellspacing="0" style="
        max-width:600px;
        background:#ffffff;
        border:1px solid #e5e7eb;
        border-radius:12px;
        padding:28px;
      ">

        <!-- HEADER -->
        <tr>
          <td style="padding-bottom:18px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">
              Order Confirmed
            </h2>
            <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">
              Payment successfully approved
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="font-size:14px;line-height:1.6;">
            <p style="margin:0 0 14px;">
              Hi ${user.name || "there"},
            </p>

            <p style="margin:0 0 14px;">
              Your order <strong>${order.orderId}</strong> has been
              <strong>approved and confirmed</strong>.
            </p>

            <p style="margin:0 0 18px;">
              We’ve successfully verified your payment, and your order is now
              being prepared for shipment.
            </p>

            <p style="
              margin:0 0 20px;
              padding:12px;
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:8px;
              font-size:13px;
            ">
              <strong>Order ID:</strong> ${order.orderId}<br/>
              <strong>Product:</strong> ${order.productName}<br/>
              <strong>Total Paid:</strong> ₹${order.totalAmountPaid}
            </p>

            <p style="margin:0 0 18px;">
              We’ll notify you once your order is shipped, along with tracking
              details.
            </p>

            <!-- CTA -->
            <p style="text-align:center;margin:28px 0 0;">
              <a
                href="${process.env.APP_BASE_URL}/dashboard/orders/${order.orderId}"
                style="
                  display:inline-block;
                  padding:12px 22px;
                  background:#2563eb;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:999px;
                  font-size:13px;
                  font-weight:600;
                "
              >
                View Order Details
              </a>
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="
            padding-top:24px;
            border-top:1px solid #e5e7eb;
            font-size:12px;
            color:#6b7280;
          ">
            <p style="margin:0 0 6px;">
              — Electra Society
            </p>
            <p style="margin:0;">
              This is an automated email. Please do not reply.
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`
    // 5️⃣ Notify user
    await sendUserOrderEmail(
      user,
      "Your Electra order is confirmed!",
      html
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
