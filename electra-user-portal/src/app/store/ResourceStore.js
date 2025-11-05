// app/store/ResourceStore.jsx
"use client";

import axios from "axios";
import React, { createContext, useCallback, useMemo, useState } from "react";

export const ResourceStore = createContext(null);

export function ResourceStoreProvider({ children }) {
  const [resLoad, setResLoad] = useState(false);
  const [data, setData] = useState([]);
  const [doubt, setDoubt] = useState(false);

  // Stable identity; optional AbortSignal supported by axios v1+
  const getResources = useCallback(async (semester, category, signal) => {
    setResLoad(true);
    try {
      const resp = await axios.post(
        "/api/getRes",
        { semester, category },
        { signal, headers: { "Content-Type": "application/json" } }
      );
      const payload = Array.isArray(resp.data) ? resp.data : [];
      setData(payload);
    } catch (err) {
      console.error("getResources failed:", err?.message || err);
    } finally {
      setResLoad(false);
    }
  }, []);

  const value = useMemo(
    () => ({ getResources, data, setData, resLoad, doubt, setDoubt }),
    [getResources, data, resLoad, doubt]
  );

  return <ResourceStore.Provider value={value}>{children}</ResourceStore.Provider>;
}
