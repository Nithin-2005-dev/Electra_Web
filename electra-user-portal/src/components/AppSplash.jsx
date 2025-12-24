"use client";

import { useEffect, useState } from "react";

export default function AppSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onLoad = () => {
      setVisible(false);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => window.removeEventListener("load", onLoad);
  }, []);

  if (!visible) return null;

  return (
    <div className="electra-loader">
      <div className="content">
        <h1>Electra</h1>
        <span className="line" />
        <p>Preparing the experience</p>
      </div>
    </div>
  );
}
