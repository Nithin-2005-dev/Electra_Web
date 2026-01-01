import crypto from "crypto";

export function generateApproveToken(orderId) {
  return crypto
    .createHmac("sha256", process.env.ADMIN_APPROVAL_SECRET)
    .update(orderId)
    .digest("hex");
}

export function verifyApproveToken(orderId, token) {
  const expected = generateApproveToken(orderId);
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(token)
  );
}
