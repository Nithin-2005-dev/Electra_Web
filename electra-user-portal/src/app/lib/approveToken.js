import crypto from "crypto";

/**
 * Creates deterministic HMAC token for an order approval action.
 *
 * @param {string} orderId
 * @returns {string}
 */
export function generateApproveToken(orderId) {
  return crypto
    .createHmac("sha256", process.env.ADMIN_APPROVAL_SECRET)
    .update(orderId)
    .digest("hex");
}

/**
 * Verifies an approval token in constant time.
 *
 * @param {string} orderId
 * @param {string} token
 * @returns {boolean}
 */
export function verifyApproveToken(orderId, token) {
  const expected = generateApproveToken(orderId);
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(token)
  );
}
