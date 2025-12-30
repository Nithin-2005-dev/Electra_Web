"use client";

import axios from "axios";
import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

export const ResourceStore = createContext(null);

export function ResourceStoreProvider({ children }) {
  const [resLoad, setResLoad] = useState(false);
  const [data, setData] = useState([]);

  // Used to cancel in-flight requests
  const abortRef = useRef(null);

  /**
   * Fetch resources by semester + subject + category
   * category === "all" should be handled by backend
   */
  const getResources = useCallback(
  async (semester, subject, category, signal) => {
    setResLoad(true);
    try {
      const resp = await axios.post(
        "/api/getRes",
        { semester, subject, category },
        { signal, headers: { "Content-Type": "application/json" } }
      );

      setData(Array.isArray(resp.data) ? resp.data : []);
    } catch (err) {
      console.error("getResources failed:", err);
    } finally {
      setResLoad(false);
    }
  },
  []
);


  const value = useMemo(
    () => ({
      getResources,
      data,
      setData,
      resLoad,
    }),
    [getResources, data, resLoad]
  );

  return (
    <ResourceStore.Provider value={value}>
      {children}
    </ResourceStore.Provider>
  );
}
