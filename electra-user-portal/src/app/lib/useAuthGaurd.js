"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard({ requireProfile = false } = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth/sign-in");
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
  }, [router, requireProfile]);

  return { loading };
}
