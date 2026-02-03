import { NextResponse } from "next/server";
import { adminDb } from "../../lib/firebaseAdmin";
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
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    /* ───────── FETCH ORDER ───────── */
    const orderSnap = await adminDb
      .collection("orders")
      .doc(orderId)
      .get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderSnap.data();

    /* ───────── FETCH PRODUCTS FOR ITEMS ───────── */
    const productIds = [...new Set(order.items.map(i => i.productId))];

    const productSnaps = await Promise.all(
      productIds.map(id =>
        adminDb.collection("products").doc(id).get()
      )
    );

    const productMap = {};
    productSnaps.forEach(snap => {
      if (snap.exists) {
        productMap[snap.id] = snap.data();
      }
    });
    /* ───────── ENRICH ITEMS ───────── */
    const items = order.items.map(item => {
      const product = productMap[item.productId] || {};

      return {
        productName: item.productName,
        size: item.size,
        quantity: item.quantity || 1,
        printName: item.printName,
        printedName: item.printedName,
        price: product.price || 0,
        imageUrl: cloudinaryUrl(product.imageMain),
      };
    });
    /* ───────── FETCH USER ───────── */
    const userSnap = await adminDb
      .collection("users")
      .doc(order.userId)
      .get();

    const user = userSnap.exists ? userSnap.data() : {};

    // /* ───────── SEND ADMIN EMAIL ───────── */
    // await resend.emails.send({
    //   from: "Electra Orders <no-reply@electrasocietynits.com>",
    //   to: ["societyelectra@gmail.com"],
    //   subject: `Payment submitted — ${orderId}`,
    //   html: adminEmailHtml(order, items),
    // });

    /* ───────── SEND USER EMAIL ───────── */
    if (user.email) {
      await resend.emails.send({
        from: "Electra Society <no-reply@electrasocietynits.com>",
        to: [user.email],
        subject: "Order received — Payment under verification",
        html: userEmailHtml(order, items, user),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("notify-payment error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function userEmailHtml(order, items, user) {
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

<!-- MAIN CARD -->
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
  <h1 style="
    margin:14px 0 4px;
    font-size:22px;
    font-weight:700;
  ">
    Thanks for your order
  </h1>

  <p style="
    margin:0;
    font-size:13px;
    color:#6b7280;
  ">
    Payment received — verification in progress
  </p>
</td>
</tr>

<!-- ORDER NUMBER -->
<tr>
<td align="center" style="padding-bottom:24px;">
  <div style="
    font-size:11px;
    letter-spacing:0.12em;
    color:#6b7280;
    margin-bottom:6px;
  ">
    ORDER NUMBER
  </div>

  <div style="
    display:inline-block;
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

<!-- ORDER SUMMARY -->
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

  <table width="100%" cellpadding="0" cellspacing="0">
    ${items.map(i => `
    <tr>
      <td width="80" style="padding-bottom:12px;">
        <img src="${i.imageUrl}"
          width="72" height="72"
          style="
            border-radius:12px;
            border:1px solid #e5e7eb;
            object-fit:cover;
            display:block;
          "
        />
      </td>

      <td style="padding-left:12px;padding-bottom:12px;">
        <div style="font-size:14px;font-weight:600;">
          ${i.productName}
        </div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">
          Size: ${i.size || "—"} · Qty: ${i.quantity || 1}
          ${i.printName ? `<br/>Printed: ${i.printedName}` : ``}
        </div>
      </td>

      <td align="right" style="
        font-size:14px;
        font-weight:600;
        padding-bottom:12px;
        white-space:nowrap;
      ">
        ₹${i.price}
      </td>
    </tr>
    `).join("")}
  </table>
</td>
</tr>

<!-- PAYMENT SUMMARY -->
<tr>
<td style="
  padding:18px 0;
  border-top:1px solid #e5e7eb;
">
  <h3 style="
    margin:0 0 12px;
    font-size:14px;
    letter-spacing:0.08em;
    color:#6b7280;
  ">
    PAYMENT SUMMARY
  </h3>

  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
    <tr>
      <td style="padding:6px 0;color:#6b7280;">Base amount</td>
      <td align="right">₹${order.amount}</td>
    </tr>

    ${order.printNameCharge ? `
    <tr>
      <td style="padding:6px 0;color:#6b7280;">Name print</td>
      <td align="right">₹${order.printNameCharge}</td>
    </tr>
    ` : ``}

    ${order.deliveryCharge ? `
    <tr>
      <td style="padding:6px 0;color:#6b7280;">Delivery</td>
      <td align="right">₹${order.deliveryCharge}</td>
    </tr>
    ` : ``}

    <tr>
      <td colspan="2" style="border-top:1px solid #e5e7eb;padding-top:10px;"></td>
    </tr>

    <tr style="font-weight:700;">
      <td style="padding-top:6px;">Total paid</td>
      <td align="right" style="padding-top:6px;color:#22d3ee;">
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
       text-decoration:none;
       border-radius:999px;
       font-size:14px;
       font-weight:600;
     ">
    View Order Details
  </a>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="
  padding-top:28px;
  border-top:1px solid #e5e7eb;
  font-size:12px;
  color:#6b7280;
  text-align:center;
">
  This is an automated message from Electra Society.<br/>
  Please do not reply to this email.
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

function adminEmailHtml(order, items) {
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

<table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px;">
<tr>
<td align="center">

<!-- MAIN CONTAINER -->
<table width="100%" cellpadding="0" cellspacing="0" style="
  max-width:700px;
  background:#ffffff;
  border-radius:14px;
  border:1px solid #e5e7eb;
  box-shadow:0 10px 30px rgba(0,0,0,0.08);
  padding:26px;
">

<!-- ALERT HEADER -->
<tr>
<td style="
  background:#111827;
  color:#ffffff;
  border-radius:10px;
  padding:18px;
  text-align:center;
">
  <div style="font-size:13px;letter-spacing:0.12em;opacity:0.8;">
    ACTION REQUIRED
  </div>
  <div style="font-size:20px;font-weight:700;margin-top:6px;">
    Payment Submitted
  </div>
  <div style="font-size:13px;opacity:0.8;margin-top:4px;">
    Admin verification pending
  </div>
</td>
</tr>

<!-- ORDER ID -->
<tr>
<td align="center" style="padding:22px 0 18px;">
  <div style="font-size:11px;color:#6b7280;letter-spacing:0.12em;">
    ORDER ID
  </div>
  <div style="
    display:inline-block;
    margin-top:6px;
    background:#111827;
    color:#ffffff;
    padding:8px 18px;
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
    font-size:13px;
    letter-spacing:0.08em;
    color:#6b7280;
  ">
    ITEMS
  </h3>

  <table width="100%" cellpadding="0" cellspacing="0">
    ${items.map(i => `
    <tr>
      <td width="64" style="padding-bottom:12px;">
        <img src="${i.imageUrl}"
             width="56" height="56"
             style="
               border-radius:8px;
               border:1px solid #e5e7eb;
               object-fit:cover;
               display:block;
             " />
      </td>

      <td style="padding-left:10px;padding-bottom:12px;font-size:13px;">
        <strong>${i.productName}</strong><br/>
        <span style="color:#6b7280;">
          Size: ${i.size || "—"} · Qty: ${i.quantity || 1}
          ${i.printName ? `<br/>Printed: ${i.printedName}` : ``}
        </span>
      </td>

      <td align="right" style="
        font-size:13px;
        font-weight:600;
        white-space:nowrap;
        padding-bottom:12px;
      ">
        ₹${i.price}
      </td>
    </tr>
    `).join("")}
  </table>
</td>
</tr>

<!-- PAYMENT SUMMARY -->
<tr>
<td style="
  border-top:1px solid #e5e7eb;
  padding-top:16px;
">
  <h3 style="
    margin:0 0 12px;
    font-size:13px;
    letter-spacing:0.08em;
    color:#6b7280;
  ">
    PAYMENT SUMMARY
  </h3>

  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
    <tr>
      <td style="padding:6px 0;color:#6b7280;">Base amount</td>
      <td align="right">₹${order.amount}</td>
    </tr>

    ${order.printNameCharge ? `
    <tr>
      <td style="padding:6px 0;color:#6b7280;">Name print</td>
      <td align="right">₹${order.printNameCharge}</td>
    </tr>` : ``}

    ${order.deliveryCharge ? `
    <tr>
      <td style="padding:6px 0;color:#6b7280;">Delivery</td>
      <td align="right">₹${order.deliveryCharge}</td>
    </tr>` : ``}

    <tr>
      <td colspan="2" style="border-top:1px solid #e5e7eb;padding-top:10px;"></td>
    </tr>

    <tr style="font-weight:700;">
      <td style="padding-top:6px;">Total collected</td>
      <td align="right" style="padding-top:6px;color:#16a34a;">
        ₹${order.totalAmountPaid}
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CTA -->
<tr>
<td align="center" style="padding-top:24px;">
  <a href="${process.env.APP_BASE_URL}/admin/orders"
     style="
       display:inline-block;
       padding:14px 30px;
       background:#2563eb;
       color:#ffffff;
       text-decoration:none;
       border-radius:999px;
       font-size:14px;
       font-weight:600;
     ">
    Open Admin Dashboard
  </a>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="
  padding-top:22px;
  border-top:1px solid #e5e7eb;
  font-size:12px;
  color:#6b7280;
  text-align:center;
">
  Automated admin notification · Electra Order System
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

