import { NextResponse } from "next/server";
import { adminDb } from "../../lib/firebaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    /* ---------- FETCH ORDER ---------- */
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orderSnap.data();

    /* ---------- FETCH USER ---------- */
    const userSnap = await adminDb
      .collection("users")
      .doc(order.userId)
      .get();

    const user = userSnap.exists ? userSnap.data() : {};

    /* ---------- ADMIN EMAIL ---------- */
    await resend.emails.send({
      from: "Electra Orders <no-reply@electrasocietynits.com>",
      to: ["societyelectra@gmail.com"],
      subject: `New payment submitted — ${orderId}`,
 html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Payment Submitted – Admin Verification</title>
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
        max-width:680px;
        background:#ffffff;
        border:1px solid #e5e7eb;
        border-radius:12px;
        padding:28px;
      ">

        <!-- HEADER -->
        <tr>
          <td style="padding-bottom:18px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">
              Payment Submitted for Verification
            </h2>
            <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">
              Action required: Admin review pending
            </p>
          </td>
        </tr>

        <!-- ORDER SUMMARY -->
        <tr>
          <td style="padding:14px 0;">
            <h3 style="
              margin:0 0 10px;
              font-size:13px;
              letter-spacing:0.08em;
              color:#6b7280;
            ">
              ORDER DETAILS
            </h3>

            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Order ID</td>
                <td style="padding:6px 0;text-align:right;"><strong>${order.orderId}</strong></td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Product</td>
                <td style="padding:6px 0;text-align:right;">${order.productName}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Size</td>
                <td style="padding:6px 0;text-align:right;">${order.size || "—"}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Base Amount</td>
                <td style="padding:6px 0;text-align:right;">₹${order.amount}</td>
              </tr>

              ${
                order.printName
                  ? `
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;">Printed Name</td>
                      <td style="padding:6px 0;text-align:right;">
                        ${order.printedName} (₹${order.printNameCharge})
                      </td>
                    </tr>
                  `
                  : ""
              }

              ${
                order.isOutsideCampus
                  ? `
                    <tr>
                      <td style="padding:6px 0;color:#6b7280;">Delivery Charge</td>
                      <td style="padding:6px 0;text-align:right;">₹${order.deliveryCharge}</td>
                    </tr>
                  `
                  : ""
              }

              <tr>
                <td style="padding:8px 0;color:#6b7280;">Total Paid</td>
                <td style="padding:8px 0;text-align:right;font-weight:700;">
                  ₹${order.totalAmountPaid}
                </td>
              </tr>

              <tr>
                <td style="padding:6px 0;color:#6b7280;">Transaction ID</td>
                <td style="padding:6px 0;text-align:right;">
                  ${order.txnId || "N/A"}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CUSTOMER -->
        <tr>
          <td style="padding:16px 0;">
            <h3 style="margin:0 0 10px;font-size:13px;color:#6b7280;letter-spacing:0.08em;">
              CUSTOMER DETAILS
            </h3>

            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Name</td>
                <td style="padding:6px 0;text-align:right;">
                  ${order.deliveryAddress?.fullName || "N/A"}
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;">Phone</td>
                <td style="padding:6px 0;text-align:right;">
                  ${order.deliveryAddress?.phone || "N/A"}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ADDRESS -->
        <tr>
          <td style="padding:16px 0;">
            <h3 style="margin:0 0 10px;font-size:13px;color:#6b7280;letter-spacing:0.08em;">
              DELIVERY ADDRESS
            </h3>

            <p style="
              margin:0;
              background:#f9fafb;
              border:1px solid #e5e7eb;
              padding:12px;
              border-radius:8px;
              font-size:13px;
              line-height:1.6;
            ">
              ${order.deliveryAddress?.addressLine || ""}<br/>
              ${order.deliveryAddress?.city || ""}<br/>
              ${order.deliveryAddress?.pincode || ""}
            </p>
          </td>
        </tr>

        <!-- PAYMENT PROOF -->
        <tr>
          <td style="padding:18px 0;border-top:1px solid #e5e7eb;">
            ${
              order.paymentScreenshotUrl
                ? `
                  <a href="${order.paymentScreenshotUrl}" target="_blank"
                     style="
                       display:inline-block;
                       padding:10px 18px;
                       background:#111827;
                       color:#ffffff;
                       text-decoration:none;
                       border-radius:999px;
                       font-size:13px;
                       font-weight:600;
                     ">
                    View Payment Screenshot
                  </a>
                `
                : `
                  <p style="color:#b45309;font-size:13px;margin:0;">
                    No payment screenshot uploaded
                  </p>
                `
            }
          </td>
        </tr>

        <!-- ADMIN CTA -->
        <tr>
          <td style="padding-top:22px;text-align:center;">
            <a href="${process.env.APP_BASE_URL}/admin/orders"
               style="
                 display:inline-block;
                 padding:12px 26px;
                 background:#2563eb;
                 color:#ffffff;
                 text-decoration:none;
                 border-radius:999px;
                 font-size:13px;
                 font-weight:600;
               ">
              Open Admin Dashboard
            </a>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="
            padding-top:24px;
            font-size:11px;
            color:#6b7280;
            border-top:1px solid #e5e7eb;
          ">
            This is an automated admin notification from the Electra Order System.
            Please verify payment and update order status accordingly.
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`


    });

    /* ---------- USER EMAIL ---------- */
    if (user.email) {
      await resend.emails.send({
        from: "Electra Society <no-reply@electrasocietynits.com>",
        to: [user.email],
        subject: "Payment Received – Verification in Progress",
html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color:#111827;
">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
  <tr>
    <td align="center">

      <table width="100%" cellpadding="0" cellspacing="0" style="
        max-width:620px;
        background:#ffffff;
        border:1px solid #e5e7eb;
        border-radius:14px;
        padding:28px;
      ">

        <!-- HEADER -->
        <tr>
          <td style="padding-bottom:20px;">
            <h2 style="
              margin:0;
              font-size:22px;
              font-weight:600;
              color:#111827;
            ">
              Payment Received
            </h2>
            <p style="
              margin:6px 0 0;
              font-size:13px;
              color:#6b7280;
            ">
              Verification in progress
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="font-size:14px; line-height:1.65; color:#374151;">

            <p style="margin:0 0 14px;">
              Hi ${user.name || "there"},
            </p>

            <p style="margin:0 0 14px;">
              We’ve received your payment proof for the order
              <strong>${orderId}</strong>.
            </p>

            <!-- ORDER SUMMARY -->
            <div style="
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:10px;
              padding:14px;
              margin:18px 0;
              font-size:13px;
              color:#111827;
            ">
              <strong>Order Summary</strong><br /><br />
              Product: ${order.productName}<br />
              Size: ${order.size || "—"}<br />
              Amount Paid: ₹${order.totalAmountPaid}<br />
              Transaction ID: ${order.txnId || "—"}
            </div>

            <!-- DELIVERY DETAILS -->
            <div style="
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:10px;
              padding:14px;
              margin-bottom:18px;
              font-size:13px;
              color:#111827;
            ">
              <strong>Delivery Details</strong><br /><br />
              ${order.deliveryAddress?.fullName || "—"}<br />
              ${order.deliveryAddress?.phone || "—"}<br />
              ${order.deliveryAddress?.addressLine || "—"},<br />
              ${order.deliveryAddress?.city || ""} – ${order.deliveryAddress?.pincode || ""}
            </div>

            <p style="margin:0 0 14px;">
              <strong>Status:</strong>
              <span style="color:#d97706;">Pending verification</span>
            </p>

            <p style="margin:0 0 18px;">
              Our team is currently verifying your payment. Once approved,
              your order will move forward for processing and shipping.
            </p>

            <!-- CTA -->
            <p style="text-align:center; margin:26px 0;">
              <a href="${process.env.APP_BASE_URL}/dashboard/orders/${orderId}"
                 style="
                   display:inline-block;
                   padding:12px 22px;
                   background:#111827;
                   color:#ffffff;
                   text-decoration:none;
                   font-size:13px;
                   font-weight:600;
                   border-radius:999px;
                 ">
                View Order Details
              </a>
            </p>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="
            padding-top:22px;
            border-top:1px solid #e5e7eb;
            font-size:12px;
            color:#6b7280;
          ">
            <p style="margin:0 0 6px;">
              — Electra Society
            </p>
            <p style="margin:0;">
              This is an automated message. Please do not reply.
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
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("notify-payment error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
