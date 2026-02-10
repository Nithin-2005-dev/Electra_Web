import admin, { adminDb } from "../../lib/firebaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, productId = null, sessionId = null, meta = null } = body || {};

    if (!type) {
      return new Response(JSON.stringify({ error: "Missing type" }), {
        status: 400,
      });
    }

    let userId = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split("Bearer ")[1];
        const decoded = await admin.auth().verifyIdToken(token);
        userId = decoded?.uid || null;
      } catch {
        userId = null;
      }
    }

    await adminDb.collection("merch_analytics_events").add({
      type,
      productId,
      userId,
      sessionId,
      meta,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("merch analytics error", err);
    return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
  }
}
