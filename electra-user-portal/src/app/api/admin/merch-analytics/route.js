import { adminDb } from "../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../lib/adminGaurd";

function toMillis(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate().getTime();
  if (value.seconds) return value.seconds * 1000;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

export async function GET(req) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30";
    const rangeDays = range === "all" ? null : Number(range);

    const startDate = rangeDays
      ? new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000)
      : null;

    let eventsQuery = adminDb
      .collection("merch_analytics_events")
      .orderBy("createdAt", "desc")
      .limit(1000);

    if (startDate) {
      eventsQuery = eventsQuery.where("createdAt", ">=", startDate);
    }

    const [eventsSnap, productsSnap] = await Promise.all([
      eventsQuery.get(),
      adminDb.collection("products").get(),
    ]);

    const events = eventsSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        type: data.type || null,
        productId: data.productId || null,
        userId: data.userId || null,
        sessionId: data.sessionId || null,
        meta: data.meta || null,
        createdAt: toMillis(data.createdAt),
      };
    });

    const products = {};
    productsSnap.forEach((d) => {
      const data = d.data();
      products[d.id] = {
        id: d.id,
        name: data.name || data.productName || d.id,
        image: data.imageMain || null,
      };
    });

    const userIds = [
      ...new Set(events.map((e) => e.userId).filter(Boolean)),
    ].slice(0, 120);

  const userDocs = await Promise.all(
    userIds.map((uid) => adminDb.collection("users").doc(uid).get())
  );

    const users = {};
    userDocs.forEach((snap) => {
      if (!snap.exists) return;
      const data = snap.data();
    users[snap.id] = {
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      uid: data.uid || snap.id,
    };
  });

    const ordersSnap = await adminDb.collection("orders").get();
    const orders = ordersSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        orderId: data.orderId || d.id,
        userId: data.userId || null,
        paymentStatus: data.paymentStatus || null,
        fulfillmentStatus: data.fulfillmentStatus || null,
        createdAt: toMillis(data.createdAt),
        updatedAt: toMillis(data.updatedAt),
        amount: Number(data.amount) || 0,
        totalAmountPaid: Number(data.totalAmountPaid) || 0,
        printNameCharge: Number(data.printNameCharge) || 0,
        deliveryCharge: Number(data.deliveryCharge) || 0,
        items: Array.isArray(data.items) ? data.items : [],
      };
    });

    return new Response(
      JSON.stringify({ events, products, users, orders }),
      { status: 200 }
    );
  } catch (err) {
    console.error("admin merch analytics error", err);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
