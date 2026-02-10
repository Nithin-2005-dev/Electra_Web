export function deriveOrderStep(order) {
  if (!order) {
    return { step: "placed", terminal: false };
  }

  /* ───────── CANCELLED ───────── */
  if (order.paymentStatus === "rejected") {
    return { step: "cancelled", terminal: true };
  }

  /* ───────── PAYMENT NOT DONE ───────── */
  if (order.paymentStatus === "pending_verification") {
    return { step: "placed", terminal: false };
  }

  /* ───────── CONFIRMED PAYMENT FLOW ───────── */
  // Highest priority wins
  if (order.deliveredAt || order.fulfillmentStatus === "delivered") {
    return { step: "delivered", terminal: true };
  }

  if (order.shippedAt) {
    return { step: "shipped", terminal: false };
  }

  if (order.approvedAt) {
    return { step: "confirmed", terminal: false };
  }

  return { step: "placed", terminal: false };
}
