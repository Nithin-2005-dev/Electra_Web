import admin from "./firebaseAdmin";

/**
 * Validates bearer token and ensures caller has admin role in Firestore.
 *
 * @param {Request} req
 * @returns {Promise<string>} Admin UID.
 */
export async function requireAdmin(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing token");
  }

  const token = authHeader.split("Bearer ")[1];

  const decoded = await admin.auth().verifyIdToken(token);
  const uid = decoded.uid;

  const userSnap = await admin.firestore().collection("users").doc(uid).get();

  if (!userSnap.exists) {
    throw new Error("User not found");
  }

  const user = userSnap.data();

  if (user.role !== "admin") {
    throw new Error("Not admin");
  }

  return uid; // return admin UID
}
