// src/app/api/admin/approve/route.js

import { NextResponse } from "next/server";
import admin, { adminDb } from "../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../lib/adminGaurd";
import { sendUserOrderEmail } from "../../../lib/email";

/* ───────── CLOUDINARY URL ───────── */
function cloudinaryUrl(publicId, opts = "w_120,h_120,c_fill,q_auto,f_auto") {
  if (!publicId) return "";
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${opts}/${publicId}`;
}

export async function POST(req) {
  try {
    /* ───────── ADMIN GUARD ───────── */
    const adminUid = await requireAdmin(req);

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    /* ───────── FETCH ORDER ───────── */
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderSnap.data();

    if (order.paymentStatus !== "pending_verification") {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    /* ───────── FETCH USER ───────── */
    const userSnap = await adminDb.collection("users").doc(order.userId).get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userSnap.data();

    /* ───────── FETCH PRODUCTS FOR ITEMS ───────── */
    const productIds = [
      ...new Set((order.items || []).map((i) => i.productId)),
    ];

    const productSnaps = await Promise.all(
      productIds.map((id) => adminDb.collection("products").doc(id).get())
    );

    const productMap = {};
    productSnaps.forEach((snap) => {
      if (snap.exists) {
        productMap[snap.id] = snap.data();
      }
    });

    /* ───────── BUILD ITEMS (MATCH SHIPPED) ───────── */
    const items = (order.items || []).map((i) => {
      const product = productMap[i.productId] || {};

      return {
        productName: i.productName,
        size: i.size,
        quantity: i.quantity || 1,
        printName: i.printName,
        printedName: i.printedName,
        price: product.price || i.price || 0,
        imageUrl: cloudinaryUrl(product.imageMain),
      };
    });

    /* ───────── UPDATE ORDER ───────── */
    await orderRef.update({
      paymentStatus: "confirmed",
      approvedBy: adminUid,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    /* ───────── SEND PREMIUM EMAIL ───────── */
    await sendUserOrderEmail(
      user,
      "Your Electra order is confirmed ",
      approvedEmailHtml(order, items, user)
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

/* ───────────────── EMAIL TEMPLATE ───────────────── */

function approvedEmailHtml(order, items, user) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f3f4f6;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
  color:#111827;
">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" style="
  max-width:640px;
  background:#ffffff;
  border-radius:16px;
  border:1px solid #e5e7eb;
  box-shadow:0 10px 30px rgba(0,0,0,0.08);
  padding:28px;
">

<!-- STATUS -->
<tr>
<td align="center" style="padding-bottom:22px;">

  <h1 style="margin:0;font-size:22px;font-weight:700;">
    Order Confirmed
  </h1>

  <p style="margin-top:6px;font-size:13px;color:#6b7280;">
    Payment verified successfully
  </p>
</td>
</tr>

<!-- ORDER ID -->
<tr>
<td align="center" style="padding-bottom:24px;">
  <div style="font-size:11px;letter-spacing:0.12em;color:#6b7280;">
    ORDER NUMBER
  </div>
  <div style="
    margin-top:6px;
    background:#111827;
    color:#ffffff;
    padding:10px 20px;
    border-radius:999px;
    font-size:14px;
    font-weight:600;
  ">
    ${order.orderId}
  </div>
</td>
</tr>

<!-- ITEMS -->
<tr>
<td style="padding-bottom:18px;">
  <h3 style="
    margin:0 0 12px;
    font-size:14px;
    letter-spacing:0.08em;
    color:#6b7280;
  ">
    ORDER SUMMARY
  </h3>

  <table width="100%">
    ${items
      .map(
        (i) => `
    <tr>
      <td width="80" style="padding-bottom:12px;">
        <img src="${i.imageUrl}" width="72" height="72"
          style="border-radius:12px;border:1px solid #e5e7eb;object-fit:cover"/>
      </td>

      <td style="padding-left:12px;padding-bottom:12px;">
        <strong>${i.productName}</strong><br/>
        <span style="font-size:12px;color:#6b7280;">
          Size: ${i.size || "—"} · Qty: ${i.quantity}
          ${i.printName ? `<br/>Printed: ${i.printedName}` : ``}
        </span>
      </td>

      <td align="right" style="font-weight:600;padding-bottom:12px;">
        ₹${i.price}
      </td>
    </tr>
    `
      )
      .join("")}
  </table>
</td>
</tr>

<!-- PAYMENT -->
<tr>
<td style="border-top:1px solid #e5e7eb;padding-top:16px;">
  <table width="100%" style="font-size:14px;">
    <tr><td style="color:#6b7280;">Base amount</td><td align="right">₹${
      order.amount
    }</td></tr>
    ${
      order.printNameCharge
        ? `<tr><td style="color:#6b7280;">Name print</td><td align="right">₹${order.printNameCharge}</td></tr>`
        : ""
    }
    ${
      order.deliveryCharge
        ? `<tr><td style="color:#6b7280;">Delivery</td><td align="right">₹${order.deliveryCharge}</td></tr>`
        : ""
    }
    <tr style="font-weight:700;">
      <td style="padding-top:8px;">Total paid</td>
      <td align="right" style="padding-top:8px;color:#22c55e;">
        ₹${order.totalAmountPaid}
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CTA -->
<tr>
<td align="center" style="padding-top:24px;">
  <a href="${process.env.APP_BASE_URL}/dashboard/orders/${order.orderId}"
     style="
       display:inline-block;
       padding:14px 28px;
       background:#111827;
       color:#ffffff;
       border-radius:999px;
       text-decoration:none;
       font-size:14px;
       font-weight:600;
     ">
    View Order Details
  </a>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding-top:26px;font-size:12px;color:#6b7280;text-align:center;">
  Automated message from Electra Society · Do not reply
</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>
`;
}
