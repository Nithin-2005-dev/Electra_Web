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
   const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Payment Rejected</title>
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
            <h2 style="margin:0;font-size:20px;font-weight:600;color:#111827;">
              Payment Verification Failed
            </h2>
            <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">
              Action required for your order
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="font-size:14px;line-height:1.6;color:#111827;">

            <p style="margin:0 0 14px;">
              Hi ${user.name || "there"},
            </p>

            <p style="margin:0 0 14px;">
              Unfortunately, your order <strong>${order.orderId}</strong> was
              <strong>rejected due to payment verification issues</strong>.
            </p>

            <!-- STATUS BADGE -->
            <div style="margin:14px 0 18px;">
              <span style="
                display:inline-block;
                padding:6px 12px;
                font-size:12px;
                font-weight:600;
                border-radius:999px;
                background:#fef2f2;
                color:#991b1b;
                border:1px solid #fecaca;
              ">
                Order Status: Payment Rejected
              </span>
            </div>

            <p style="margin:0 0 14px;">
              This usually happens when the payment details or proof provided
              could not be verified successfully.
            </p>

            <p style="margin:0 0 18px;">
              If you believe this is a mistake or need clarification, please
              contact the Electra team before placing a new order.
            </p>

            <!-- ORDER SUMMARY -->
            <div style="
              margin:0 0 20px;
              padding:14px;
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:8px;
              font-size:13px;
            ">
              <strong>Order ID:</strong> ${order.orderId}<br/>
              <strong>Product:</strong> ${order.productName}<br/>
              <strong>Amount:</strong> ₹${order.totalAmountPaid}
            </div>

            <!-- CTA BUTTON -->
            <div style="text-align:center;margin:28px 0 0;">
              <a
                href="${process.env.APP_BASE_URL}/dashboard/orders/${order.orderId}"
                style="
                  display:inline-block;
                  padding:12px 24px;
                  background:#dc2626;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:999px;
                  font-size:13px;
                  font-weight:600;
                  letter-spacing:0.04em;
                "
              >
                View Order Details
              </a>
            </div>

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
              This is an automated message. Please do not reply to this email.
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
    // 4️⃣ Notify user (PASS USER OBJECT, NOT EMAIL STRING)
    await sendUserOrderEmail(
      user,
      "Your Electra order was rejected",
      html
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
