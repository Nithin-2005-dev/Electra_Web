"use client";

import { auth } from "./firebase";

const SESSION_KEY = "merch_session_id";

function getSessionId() {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = `m_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    window.localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "anonymous";
  }
}

export async function logMerchEvent(type, payload = {}) {
  if (typeof window === "undefined") return;
  try {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    await fetch("/api/merch-analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        type,
        productId: payload.productId || null,
        sessionId: getSessionId(),
        meta: payload.meta || null,
      }),
    });
  } catch {
    // best-effort only
  }
}
