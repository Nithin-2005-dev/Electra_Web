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
    /* ───────── ADMIN GUARD ───────── */
    await requireAdmin(req);

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Missing productId" },
        { status: 400 }
      );
    }

    /* ───────── FETCH SHIPPED ORDERS ───────── */
    const snap = await adminDb
      .collection("orders")
      .where("fulfillmentStatus", "==", "shipped")
      .get();

    const eligibleDocs = snap.docs.filter((d) => {
      const o = d.data();
      return (
        o.items?.some((i) => i.productId === productId) ||
        o.productId === productId
      );
    });

    if (!eligibleDocs.length) {
      return NextResponse.json(
        { error: "No orders to deliver" },
        { status: 400 }
      );
    }

    /* ───────── FETCH PRODUCT DATA ───────── */
    const productSnap = await adminDb
      .collection("products")
      .doc(productId)
      .get();

    const product = productSnap.exists ? productSnap.data() : {};

    const batch = adminDb.batch();

    /* ───────── PROCESS ORDERS ───────── */
    for (const docSnap of eligibleDocs) {
      const order = docSnap.data();

      /* UPDATE ORDER */
      batch.update(docSnap.ref, {
        fulfillmentStatus: "delivered",
        deliveredAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      /* FETCH USER */
      const userSnap = await adminDb
        .collection("users")
        .doc(order.userId)
        .get();

      if (!userSnap.exists) continue;
      const user = userSnap.data();

      /* BUILD ITEMS (SAME AS SHIPPED) */
      const items = (order.items || []).map((i) => ({
        productName: i.productName,
        size: i.size,
        quantity: i.quantity || 1,
        printName: i.printName,
        printedName: i.printedName,
        price: product.price || i.price || 0,
        imageUrl: cloudinaryUrl(product.imageMain),
      }));

      /* SEND DELIVERED EMAIL */
      if (user.email) {
        await resend.emails.send({
          from: "Electra Society <no-reply@electrasocietynits.com>",
          to: [user.email],
          subject: "Your Electra order has been delivered ",
          html: deliveredEmailHtml(order, items, user),
        });
      }
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Deliver error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


/* ───────────────── EMAIL TEMPLATE ───────────────── */

function deliveredEmailHtml(order, items, user) {
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

<tr>
<td align="center" style="padding-bottom:22px;">
  <div style="
    width:56px;
    height:56px;
    border-radius:50%;
    background:#22c55e;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#fff;
    font-size:26px;
    font-weight:700;
    margin-bottom:14px;
  ">✓</div>

  <h1 style="margin:0;font-size:22px;font-weight:700;">
    Order Delivered
  </h1>

  <p style="margin-top:6px;font-size:13px;color:#6b7280;">
    Hi ${user.name || "there"}, your order has been delivered successfully
  </p>
</td>
</tr>

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

<tr>
<td style="padding-bottom:18px;">
  <h3 style="font-size:14px;letter-spacing:0.08em;color:#6b7280;">
    ORDER SUMMARY
  </h3>

  <table width="100%">
    ${items.map(i => `
    <tr>
      <td width="80">
        <img src="${i.imageUrl}" width="72" height="72"
          style="border-radius:12px;border:1px solid #e5e7eb;object-fit:cover"/>
      </td>
      <td style="padding-left:12px;">
        <strong>${i.productName}</strong><br/>
        <span style="font-size:12px;color:#6b7280;">
          Size: ${i.size || "—"} · Qty: ${i.quantity}
          ${i.printName ? `<br/>Printed: ${i.printedName}` : ""}
        </span>
      </td>
      <td align="right" style="font-weight:600;">
        ₹${i.price}
      </td>
    </tr>
    `).join("")}
  </table>
</td>
</tr>

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
    View Order Details
  </a>
</td>
</tr>

<tr>
<td style="padding-top:26px;font-size:12px;color:#6b7280;text-align:center;">
  Thanks for shopping with Electra Society · Do not reply
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
