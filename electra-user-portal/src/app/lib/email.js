import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* -------------------------------------------------
   ADMIN EMAIL — payment proof submitted
-------------------------------------------------- */
export async function sendAdminPaymentEmail(order) {
  if (!process.env.ADMIN_EMAIL) {
    throw new Error("ADMIN_EMAIL is not configured");
  }

  if (!order?.orderId) {
    throw new Error("Invalid order object for admin email");
  }

  await resend.emails.send({
    from: "Electra Orders <orders@electrasocietynits.com>",
    to: [process.env.ADMIN_EMAIL],
    subject: `Payment verification needed — ${order.orderId}`,
    html: `
      <h2>Payment Verification Required</h2>

      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>User:</strong> ${order.name || "N/A"}</p>
      <p><strong>Email:</strong> ${order.email || "N/A"}</p>
      <p><strong>Amount:</strong> ₹${order.amount}</p>

      <hr />

      ${
        order.paymentScreenshotUrl
          ? `<a href="${order.paymentScreenshotUrl}" target="_blank">
               View Payment Screenshot
             </a>`
          : "<p>No screenshot uploaded</p>"
      }
    `,
  });
}

/* -------------------------------------------------
   USER EMAIL — order status updates
-------------------------------------------------- */
export async function sendUserOrderEmail(user, subject, message) {
  if (!user?.email) {
    throw new Error("User email missing — cannot send email");
  }

  await resend.emails.send({
    from: "Electra Society <no-reply@electrasocietynits.com>",
    to: [user.email],
    subject,
    html: `
      <p>Hi ${user.name || ""},</p>
      <p>${message}</p>

      <br />
      <p>
        <a href="${process.env.APP_BASE_URL}/dashboard">
          View your dashboard
        </a>
      </p>

      <br />
      <p>— Electra Society</p>
    `,
  });
}

