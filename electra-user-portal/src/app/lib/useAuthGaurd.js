"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignInRequiredPopup } from "./useSignInRequiredPopup";

export function useAuthGuard({ requireProfile = false } = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const popup = useSignInRequiredPopup(router);
  const { requireSignIn } = popup;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        requireSignIn({
          title: "Sign in to open dashboard",
          message: "Your dashboard contains personal data and account activity.",
        });
        setLoading(false);
        return;
      }

      if (requireProfile) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) {
          router.replace("/auth/profile");
          return;
        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router, requireProfile, requireSignIn]);

  return { loading, ...popup };
}
