"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailLink } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Guard + email verification
  useEffect(() => {
    if (!mounted) return;

    const phone = sessionStorage.getItem("signupPhone");
    if (!phone) {
      router.replace("/auth/sign-in");
      return;
    }

    verifyEmailLink(window.location.href)
      .then(() => setEmailVerified(true))
      .catch(() => setError("Invalid email link"));
  }, [mounted, router]);

  if (!mounted) return null;

  const verifyPhone = async () => {
    try {
      const code = otp.join("");
      await window.confirmationResult.confirm(code);
      router.push("/auth/profile");
    } catch {
      setError("Invalid OTP");
    }
  };

  return (
    <main>
      <p>Email: {emailVerified ? "Verified" : "Waiting"}</p>

      <div>
        {otp.map((v, i) => (
          <input
            key={i}
            suppressHydrationWarning
            ref={(el) => (inputsRef.current[i] = el)}
            value={v}
            maxLength={1}
            onChange={(e) => {
              const n = [...otp];
              n[i] = e.target.value;
              setOtp(n);
            }}
          />
        ))}
      </div>

      <button suppressHydrationWarning onClick={verifyPhone}>
        Verify
      </button>

      {error && <p>{error}</p>}
    </main>
  );
}
