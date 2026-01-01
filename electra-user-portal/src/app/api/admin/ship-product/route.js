import { NextResponse } from "next/server";
import admin, { adminDb } from "../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../lib/adminGaurd";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* ───────── CLOUDINARY URL ───────── */
function cloudinaryUrl(
  publicId,
  opts = "w_120,h_120,c_fill,q_auto,f_auto"
) {
  if (!publicId) return "";
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${opts}/${publicId}`;
}

export async function POST(req) {
  try {
    await requireAdmin(req);

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Missing productId" },
        { status: 400 }
      );
    }

    /* ───────── FETCH CONFIRMED ORDERS ───────── */
    const snap = await adminDb
      .collection("orders")
      .where("paymentStatus", "==", "confirmed")
      .get();

    const batch = adminDb.batch();

    for (const docSnap of snap.docs) {
      const order = docSnap.data();
      if (!Array.isArray(order.items)) continue;

      /* ───────── NORMALIZE ITEMS ───────── */
      const normalizedItems = order.items.map((i) => ({
        ...i,
        fulfillmentStatus: i.fulfillmentStatus || "placed",
      }));

      /* ───────── CHECK SHIPPABLE ITEMS ───────── */
      const shippableItems = normalizedItems.filter(
        (i) =>
          i.productId === productId &&
          i.fulfillmentStatus === "placed"
      );

      if (!shippableItems.length) continue;

      /* ───────── UPDATE ITEMS (NO TIMESTAMPS INSIDE ARRAY) ───────── */
      batch.update(docSnap.ref, {
        items: normalizedItems.map((item) =>
          item.productId === productId &&
          item.fulfillmentStatus === "placed"
            ? {
                ...item,
                fulfillmentStatus: "shipped",
              }
            : item
        ),
        shippedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      /* ───────── FETCH USER ───────── */
      const userSnap = await adminDb
        .collection("users")
        .doc(order.userId)
        .get();

      if (!userSnap.exists || !userSnap.data().email) continue;
      const user = userSnap.data();

      /* ───────── BUILD EMAIL ITEMS ───────── */
      const emailItems = shippableItems.map((i) => ({
        productName: i.productName,
        size: i.size,
        quantity: i.quantity || 1,
        printName: i.printName,
        printedName: i.printedName,
        price: i.price || 0,
        imageUrl: cloudinaryUrl(i.image),
      }));

      /* ───────── SEND EMAIL ───────── */
      await resend.emails.send({
        from: "Electra Society <no-reply@electrasocietynits.com>",
        to: [user.email],
        subject: "Your Electra order item has been shipped",
        html: shippedEmailHtml(order, emailItems, user),
      });
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Ship error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* ───────────────── EMAIL TEMPLATE ───────────────── */

function shippedEmailHtml(order, items, user) {
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

<!-- HEADER -->
<tr>
<td align="center" style="padding-bottom:22px;">
  <h1 style="margin:0;font-size:22px;font-weight:700;">
    Order Shipped
  </h1>
  <p style="margin-top:6px;font-size:13px;color:#6b7280;">
    Hi ${user.fullName || user.name || "there"},
    your order has been shipped and is on the way
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
    color:#fff;
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
  <h3 style="font-size:14px;letter-spacing:0.08em;color:#6b7280;">
    ORDER SUMMARY
  </h3>

  <table width="100%" cellpadding="0" cellspacing="0">
    ${items.map((i) => `
    <tr>
      <td width="80" style="padding-bottom:12px;">
        <img src="${i.imageUrl}" width="72" height="72"
          style="border-radius:12px;border:1px solid #e5e7eb;object-fit:cover"/>
      </td>
      <td style="padding-left:12px;padding-bottom:12px;">
        <strong>${i.productName}</strong><br/>
        <span style="font-size:12px;color:#6b7280;">
          Size: ${i.size || "—"} · Qty: ${i.quantity}
          ${i.printName ? `<br/>Printed: ${i.printedName}` : ""}
        </span>
      </td>
      <td align="right" style="font-weight:600;padding-bottom:12px;">
        ₹${(i.price || 0) * (i.quantity || 1)}
      </td>
    </tr>
    `).join("")}
  </table>
</td>
</tr>

<!-- CHARGES -->
<tr>
<td style="border-top:1px solid #e5e7eb;padding-top:16px;">
  <table width="100%" style="font-size:14px;">
    <tr>
      <td>Base amount</td>
      <td align="right">₹${order.amount || 0}</td>
    </tr>

    ${
      order.printNameCharge
        ? `<tr><td>Name print</td><td align="right">₹${order.printNameCharge}</td></tr>`
        : ""
    }

    ${
      order.deliveryCharge
        ? `<tr><td>Delivery</td><td align="right">₹${order.deliveryCharge}</td></tr>`
        : ""
    }

    <tr style="font-weight:700;">
      <td style="padding-top:8px;">Total paid</td>
      <td align="right" style="padding-top:8px;color:#22c55e;">
        ₹${order.totalAmountPaid || 0}
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
       color:#fff;
       border-radius:999px;
       text-decoration:none;
       font-size:14px;
       font-weight:600;
     ">
    Track Order
  </a>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding-top:26px;font-size:12px;color:#6b7280;text-align:center;">
  This is an automated message from Electra Society · Do not reply
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
