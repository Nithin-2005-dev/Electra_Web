"use client";

import { useEffect } from "react";

export default function AppSplash() {
  useEffect(() => {
    const removeLoader = () => {
      const loader = document.getElementById("electra-static-loader");
      if (!loader) return;

      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.8s ease";

      setTimeout(() => {
        loader.remove();
      }, 800);
    };

    // ✅ wait until EVERYTHING loads (images, video, fonts)
    if (document.readyState === "complete") {
      removeLoader();
    } else {
      window.addEventListener("load", removeLoader);
    }

    return () => {
      window.removeEventListener("load", removeLoader);
    };
  }, []);

  return null;
}
