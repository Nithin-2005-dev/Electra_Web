"use client";

import { useCallback, useEffect, useState } from "react";

const REDIRECT_SECONDS = 5;
const DEFAULT_PROMPT = {
  title: "Sign-in required",
  message: "Please sign in to continue.",
};

export function useSignInRequiredPopup(router) {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);

  const goToSignIn = useCallback(() => {
    router.replace("/auth/sign-in");
  }, [router]);

  const requireSignIn = useCallback((nextPrompt = {}) => {
    setPrompt({
      ...DEFAULT_PROMPT,
      ...nextPrompt,
    });
    setSecondsLeft(REDIRECT_SECONDS);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const tick = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    const timeout = setTimeout(() => {
      goToSignIn();
    }, REDIRECT_SECONDS * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(timeout);
    };
  }, [open, goToSignIn]);

  return {
    open,
    secondsLeft,
    requireSignIn,
    goToSignIn,
    popupTitle: prompt.title,
    popupMessage: prompt.message,
  };
}
