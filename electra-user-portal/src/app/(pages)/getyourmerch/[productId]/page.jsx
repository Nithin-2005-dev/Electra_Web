"use client";
import "../../../../components/product/product.css";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";

import ProductGallery from "../../../../components/product/ProductGallery";
import ProductInfo from "../../../../components/product/ProductInfo";
import ProductFAQ from "../../../../components/product/ProductFAQ";
import SizeChartModal from "../../../../components/product/SizeChartModal";
import LoadingScreen from "../../../../components/product/LoadingScreen";

export default function ProductPage() {
  const { productId } = useParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("");
  const [printName, setPrintName] = useState(false);
  const [printedName, setPrintedName] = useState("");
  const [product, setProduct] = useState(null);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [buying, setBuying] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  
  /* ───────── LOAD PRODUCT ───────── */
  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", productId));
      if (!snap.exists()) return router.replace("/getyourmerch");

      const data = snap.data();
      setProduct({
        ...data,
        productId,
        imageGallery: Array.isArray(data.imageGallery)
          ? data.imageGallery
          : [],
      });
      setActive(data.imageMain);
      setLoading(false);
    };

    loadProduct();
  }, [productId, router]);
  /* ───────── ORDER NOW ───────── */
  const orderNow = async () => {
  if (buying || !product.available) return;
  if (!selectedSize) {
    alert("Please select a size");
    return;
  }

  if (printName && !printedName.trim()) {
    alert("Please enter the name to be printed");
    return;
  }

  if (!user) return router.push("/auth/sign-in");

  setBuying(true);

  // prevent duplicate pending order for same product + size
  const q = query(
    collection(db, "orders"),
    where("userId", "==", user.uid),
    where("paymentStatus", "==", "pending_payment")
  );

  const snap = await getDocs(q);

  const existing = snap.docs
    .map(d => d.data())
    .find(o =>
      o.items?.some(
        i => i.productId === productId && i.size === selectedSize
      )
    );

  if (existing) {
    router.push(`/checkout/${existing.orderId}`);
    return;
  }

  const orderId = `ORD-${nanoid(6).toUpperCase()}`;

  const item = {
    productId,
    productName: product.name,
    price: product.price,
    size: selectedSize,
    printName,
    printedName: printName ? printedName.trim() : null,
    quantity:1
  };

  await setDoc(doc(db, "orders", orderId), {
    orderId,
    userId: user.uid,
    items: [item],
    amount: product.price,
    paymentStatus: "pending_payment",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  router.push(`/checkout/${orderId}`);
};


  if (loading) return <LoadingScreen />;

  if (!product || !active) return null;

  return (
    <main className="wrap_product">
      <ProductGallery
        active={active}
        setActive={setActive}
        product={product}
      />

      <ProductInfo
        product={product}
        buying={buying}
        onBuy={orderNow}
        size={selectedSize}
        setSize={setSelectedSize}
        printName={printName}
        setPrintName={setPrintName}
        printedName={printedName}
        setPrintedName={setPrintedName}
        onOpenSizeChart={() => setShowSizeChart(true)}
      />

      <ProductFAQ openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {showSizeChart && (
        <SizeChartModal
          image={product.sizeChartUrl}
          onClose={() => setShowSizeChart(false)}
        />
      )}

      {buying && <LoadingScreen overlay text="Redirecting to checkout…" />}
    </main>
  );
}
