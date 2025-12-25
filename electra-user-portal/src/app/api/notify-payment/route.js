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
        <h3>New Payment Submitted</h3>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>User:</strong> ${user.name || "N/A"}</p>
        <p><strong>Email:</strong> ${user.email || "N/A"}</p>
        <p><strong>Amount:</strong> ₹${order.amount}</p>

        ${
          order.paymentScreenshotUrl
            ? `
              <p>
                <a href="${order.paymentScreenshotUrl}" target="_blank">
                  View Payment Screenshot
                </a>
              </p>
            `
            : `<p>No payment screenshot uploaded</p>`
        }
      `,
    });

    /* ---------- USER EMAIL ---------- */
    if (user.email) {
      await resend.emails.send({
        from: "Electra Society <no-reply@electrasocietynits.com>",
        to: [user.email],
        subject: "Payment received — pending verification",
        html: `
          <p>Hi ${user.name || ""},</p>

          <p>
            We’ve received your payment proof for order
            <strong>${orderId}</strong>.
          </p>

          <p>Status: <b>Pending verification</b></p>

          <p>
            You’ll be notified once the payment is approved.
          </p>

          <br />
          <p>— Electra Society</p>
        `,
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
