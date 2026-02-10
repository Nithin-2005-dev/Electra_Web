import admin, { adminDb } from "../../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../../lib/adminGaurd";

function toMillis(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate().getTime();
  if (value.seconds) return value.seconds * 1000;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

function encodeCursor(doc) {
  if (!doc) return null;
  const data = doc.data();
  return Buffer.from(
    JSON.stringify({
      createdAt: toMillis(data.createdAt),
      id: doc.id,
    })
  ).toString("base64");
}

function decodeCursor(cursor) {
  if (!cursor) return null;
  try {
    const json = Buffer.from(cursor, "base64").toString("utf8");
    const parsed = JSON.parse(json);
    if (!parsed?.createdAt || !parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

function normalizeOrder(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    orderId: data.orderId || docSnap.id,
    userId: data.userId || null,
    txnId: data.txnId || null,
    paymentStatus: data.paymentStatus || null,
    fulfillmentStatus: data.fulfillmentStatus || null,
    items: Array.isArray(data.items) ? data.items : [],
    deliveryAddress: data.deliveryAddress || null,
    isOutsideCampus: !!data.isOutsideCampus,
    deliveryCharge: Number(data.deliveryCharge) || 0,
    totalAmountPaid: Number(data.totalAmountPaid) || data.amount || 0,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
}

function groupBulkByProduct(items) {
  const map = new Map();
  for (const item of items) {
    const pid = item.productId;
    if (!pid) continue;
    if (!map.has(pid)) {
      map.set(pid, {
        productId: pid,
        productName: item.productName,
        orders: [],
      });
    }
    map.get(pid).orders.push(item);
  }
  return Array.from(map.values());
}

export async function GET(req) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "payments";
    const limit = Math.min(Number(searchParams.get("limit")) || 8, 50);
    const cursor = decodeCursor(searchParams.get("cursor"));
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    if (tab === "payments" || tab === "rejected") {
      let q = adminDb
        .collection("orders")
        .where(
          "paymentStatus",
          "==",
          tab === "payments" ? "pending_verification" : "rejected"
        )
        .orderBy("createdAt", "desc")
        .orderBy(admin.firestore.FieldPath.documentId(), "desc");

      if (cursor) {
        q = q.startAfter(
          admin.firestore.Timestamp.fromMillis(cursor.createdAt),
          cursor.id
        );
      }

      q = q.limit(limit);

      const snap = await q.get();
      const items = snap.docs.map(normalizeOrder);
      const nextCursor = snap.docs.length ? encodeCursor(snap.docs[snap.docs.length - 1]) : null;

      return new Response(
        JSON.stringify({ type: "orders", items, nextCursor }),
        { status: 200 }
      );
    }

    // shipping/delivery/completed -> derive from confirmed orders
    const confirmedSnap = await adminDb
      .collection("orders")
      .where("paymentStatus", "==", "confirmed")
      .get();

    const flattened = confirmedSnap.docs.flatMap((docSnap) => {
      const order = normalizeOrder(docSnap);
      return order.items.map((item) => ({
        ...item,
        orderId: order.orderId,
        userId: order.userId,
        deliveryAddress: order.deliveryAddress,
        paymentStatus: order.paymentStatus,
        txnId: order.txnId,
        isOutsideCampus: order.isOutsideCampus,
        deliveryCharge: order.deliveryCharge,
        totalAmountPaid: order.totalAmountPaid,
        createdAt: order.createdAt,
        fulfillmentStatus: item.fulfillmentStatus || "placed",
      }));
    });

    const filterStatus =
      tab === "shipping"
        ? "placed"
        : tab === "delivery"
        ? "shipped"
        : "delivered";

    const batches = groupBulkByProduct(
      flattened.filter((i) => i.fulfillmentStatus === filterStatus)
    );

    const total = batches.length;
    const start = (page - 1) * limit;
    const pageItems = batches.slice(start, start + limit);

    return new Response(
      JSON.stringify({
        type: "batches",
        items: pageItems,
        total,
        page,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("admin orders list error", err);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
