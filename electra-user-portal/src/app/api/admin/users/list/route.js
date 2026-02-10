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

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export async function GET(req) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const cursor = decodeCursor(searchParams.get("cursor"));

    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const year = (searchParams.get("year") || "").trim();
    const stream = (searchParams.get("stream") || "").trim();
    const role = (searchParams.get("role") || "").trim();
    const hasOrders = (searchParams.get("hasOrders") || "").trim();
    const createdAfter = searchParams.get("createdAfter");
    const ordersAfter = searchParams.get("ordersAfter");
    const orderedProduct = (searchParams.get("orderedProduct") || "")
      .trim()
      .toLowerCase();

    const createdAfterDate = createdAfter ? new Date(createdAfter) : null;
    const ordersAfterDate = ordersAfter ? new Date(ordersAfter) : null;

    let q = adminDb.collection("users").orderBy("createdAt", "desc");
    if (role) q = q.where("role", "==", role);
    if (year) q = q.where("year", "==", year);
    if (stream) q = q.where("stream", "==", stream);
    if (createdAfterDate) q = q.where("createdAt", ">=", createdAfterDate);
    q = q.orderBy(admin.firestore.FieldPath.documentId(), "desc");

    let nextCursor = cursor;
    let results = [];
    let lastDoc = null;

    const maxLoops = 6;
    let loops = 0;

    while (results.length < limit && loops < maxLoops) {
      loops += 1;
      let pageQuery = q.limit(limit * 2);
      if (nextCursor) {
        pageQuery = pageQuery.startAfter(
          admin.firestore.Timestamp.fromMillis(nextCursor.createdAt),
          nextCursor.id
        );
      }

      const snap = await pageQuery.get();
      if (snap.empty) {
        nextCursor = null;
        break;
      }

      lastDoc = snap.docs[snap.docs.length - 1];
      nextCursor = {
        createdAt: toMillis(lastDoc.data().createdAt),
        id: lastDoc.id,
      };

      const users = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          uid: data.uid || d.id,
          name: data.name?.trim() || "",
          email: data.email?.trim() || "",
          phone: data.phone?.trim() || "",
          stream: data.stream?.trim() || "",
          year: data.year ? String(data.year).trim() : "",
          role: data.role?.trim() || "",
          createdAt: data.createdAt || null,
        };
      });

      const userIds = users.map((u) => u.uid);
      const orderMap = {};

      if (userIds.length) {
        const chunks = chunk(userIds, 10);
        const orderSnaps = await Promise.all(
          chunks.map((ids) => {
            let oq = adminDb
              .collection("orders")
              .where("userId", "in", ids);
            if (ordersAfterDate) {
              oq = oq.where("createdAt", ">=", ordersAfterDate);
            }
            return oq.get();
          })
        );

        orderSnaps.forEach((os) => {
          os.forEach((docSnap) => {
            const o = docSnap.data();
            if (!o.userId) return;
            if (!orderMap[o.userId]) orderMap[o.userId] = [];
            orderMap[o.userId].push({
              id: docSnap.id,
              ...o,
              totalAmountPaid: Number(o.totalAmountPaid) || 0,
            });
          });
        });
      }

      const filtered = users.filter((u) => {
        const orders = orderMap[u.uid] || [];

        if (search) {
          const fields = [u.name, u.email, u.phone, u.uid]
            .filter(Boolean)
            .map((v) => String(v).toLowerCase());
          if (!fields.some((v) => v.includes(search))) return false;
        }

        if (hasOrders === "yes" && orders.length === 0) return false;
        if (hasOrders === "no" && orders.length > 0) return false;

        if (orderedProduct) {
          const match = orders.some((o) =>
            (Array.isArray(o.items) ? o.items : [])
              .map((i) => i.productName || i.productId || "")
              .some((p) => String(p).toLowerCase().includes(orderedProduct))
          );
          if (!match) return false;
        }

        return true;
      });

      const enriched = filtered.map((u) => {
        const orders = orderMap[u.uid] || [];
        const totalSpent = orders.reduce(
          (s, o) => s + (o.totalAmountPaid || 0),
          0
        );
        return {
          ...u,
          ordersCount: orders.length,
          totalSpent,
        };
      });

      results = results.concat(enriched);
    }

    const pageItems = results.slice(0, limit);
    const cursorOut = lastDoc ? encodeCursor(lastDoc) : null;

    return new Response(
      JSON.stringify({
        users: pageItems,
        nextCursor: results.length >= limit ? cursorOut : null,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("admin users list error", err);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
}
