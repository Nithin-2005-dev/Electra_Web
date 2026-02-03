"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function AdminProductsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [desc, setDesc] = useState("");
  const [description, setDescription] = useState(""); // optional short
  const [price, setPrice] = useState("");
  const [imageMain, setImageMain] = useState("");
  const [gallery, setGallery] = useState("");
  const [video, setVideo] = useState("");

  /* ================= ADMIN GUARD ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || userSnap.data()?.role !== "admin") {
        router.replace("/");
        return;
      }

      await loadProducts();
    });

    return () => unsub();
  }, [router]);

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  /* ================= ADD PRODUCT ================= */
  const addProduct = async () => {
    if (!name || !price || !imageMain) return alert("Missing required fields");

    await addDoc(collection(db, "products"), {
      name,
      tagline,
      desc,
      description,
      price: Number(price),

      imageMain,
      imageGallery: gallery
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      video,

      available: true,
      createdAt: serverTimestamp(),
    });

    setName("");
    setTagline("");
    setDesc("");
    setDescription("");
    setPrice("");
    setImageMain("");
    setGallery("");
    setVideo("");

    loadProducts();
  };

  /* ================= TOGGLE STOCK ================= */
  const toggleAvailability = async (id, current) => {
    await updateDoc(doc(db, "products", id), { available: !current });

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, available: !current } : p
      )
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <main className="loading">
        Loading admin…
        <style jsx>{`
          .loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #000;
            color: #9ca3af;
          }
        `}</style>
      </main>
    );
  }

  /* ================= UI ================= */
  return (
    <main className="wrap_admin_products">
      <h1>Admin · Products</h1>

      <section className="card">
        <h2>Add Product</h2>

        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />

        <textarea
          placeholder="Full description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <textarea
          placeholder="Short description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Main image public_id (Cloudinary)"
          value={imageMain}
          onChange={(e) => setImageMain(e.target.value)}
        />

        <textarea
          placeholder="Gallery public_ids (one per line)"
          value={gallery}
          onChange={(e) => setGallery(e.target.value)}
        />

        <input
          placeholder="Video public_id (Cloudinary)"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
        />

        <button onClick={addProduct}>Add Product</button>
      </section>

      <section className="list">
        {products.map((p) => (
          <div key={p.id} className="item">
            <strong>{p.name}</strong>
            <small>{p.tagline}</small>
            <span>₹{p.price}</span>
            <span>Status: {p.available ? "Available" : "Out of stock"}</span>
            {p.video && <small>🎥 Video attached</small>}

            <button
              className={p.available ? "danger" : "ok"}
              onClick={() => toggleAvailability(p.id, p.available)}
            >
              {p.available ? "Mark Out of Stock" : "Mark Available"}
            </button>
          </div>
        ))}
      </section>

      <style jsx>{`
        .wrap_admin_products {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 2rem;
          max-width: 900px;
          margin: auto;
        }

        .card {
          background: #0b0b0b;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        input,
        textarea {
          width: 100%;
          margin-bottom: 0.7rem;
          padding: 0.6rem;
          background: #000;
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          border-radius: 6px;
        }

        button {
          padding: 0.6rem 1rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .list {
          display: grid;
          gap: 1rem;
        }

        .item {
          background: #0b0b0b;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1rem;
          display: grid;
          gap: 0.4rem;
        }

        .danger {
          background: #ef4444;
          color: #fff;
        }

        .ok {
          background: #22c55e;
          color: #000;
        }
      `}</style>
    </main>
  );
}
