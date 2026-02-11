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
import { logMerchEvent } from "../../../lib/merchAnalytics";
import { useSignInRequiredPopup } from "../../../lib/useSignInRequiredPopup";
import SignInRequiredPopup from "../../../../components/auth/SignInRequiredPopup";

import ProductGallery from "../../../../components/product/ProductGallery";
import ProductInfo from "../../../../components/product/ProductInfo";
import ProductFAQ from "../../../../components/product/ProductFAQ";
import SizeChartModal from "../../../../components/product/SizeChartModal";
import LoadingScreen from "../../../../components/product/LoadingScreen";

export default function ProductPage() {
  const { productId } = useParams();
  const router = useRouter();
  const { open, secondsLeft, requireSignIn, goToSignIn, popupTitle, popupMessage } = useSignInRequiredPopup(router);

  const [user, setUser] = useState(null);

  const [selectedSize, setSelectedSize] = useState("");
  const [printName, setPrintName] = useState(false);
  const [printedName, setPrintedName] = useState("");

  const [product, setProduct] = useState(null);
  const [active, setActive] = useState(null);

  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  /* ───────── AUTH LISTENER ───────── */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  /* ───────── LOAD PRODUCT ───────── */
  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", productId));

      if (!snap.exists()) {
        router.replace("/getyourmerch");
        return;
      }

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

      logMerchEvent("product_view", {
        productId,
        meta: { name: data.name || null },
      });
    };

    loadProduct();
  }, [productId, router]);

  /* ───────── ORDER NOW ───────── */
  const orderNow = async (payload = {}) => {
    if (buying || !product?.available) return;

    const {
      size = selectedSize,
      printName: wantPrintName = printName,
      printedName: wantPrintedName = printedName,
    } = payload;

    if (!size) {
      alert("Please select a size");
      return;
    }

    if (wantPrintName && !String(wantPrintedName || "").trim()) {
      alert("Please enter the name to be printed");
      return;
    }

    if (!user) {
      requireSignIn({
        title: "Sign in to place your order",
        message: "We need your account to create the order and track payment and delivery updates.",
      });
      return;
    }

    setBuying(true);

    try {
      // prevent duplicate pending order
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        where("paymentStatus", "==", "pending_payment")
      );

      const snap = await getDocs(q);

      const existing = snap.docs
        .map((d) => d.data())
        .find((o) =>
          o.items?.some(
            (i) =>
              i.productId === productId &&
              i.size === size &&
              Boolean(i.printName) === Boolean(wantPrintName) &&
              String(i.printedName || "").trim() ===
                String(wantPrintedName || "").trim()
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
        size,
        printName: wantPrintName,
        printedName: wantPrintName
          ? String(wantPrintedName || "").trim()
          : null,
        quantity: 1,
      };

      await setDoc(doc(db, "orders", orderId), {
        orderId,
        userId: user.uid,
        items: [item],
        amount: product.price,
        printNameCharge: printName ? 40 : 0,
        paymentStatus: "pending_payment",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.push(`/checkout/${orderId}`);
    } finally {
      setBuying(false);
    }
  };

  /* ───────── RENDER ───────── */
  if (loading) return <LoadingScreen />;
  if (!product || !active) return null;

  return (
    <main className="wrap_product">
      <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
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

      {buying && (
        <LoadingScreen
          overlay
          text="Redirecting to checkout…"
        />
      )}
    </main>
  );
}

