"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailLink } from "../../lib/auth";
import { auth } from "../../lib/firebase";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  /* ----- HARD GUARD: SIGN-UP ONLY ----- */
  useEffect(() => {
    const phone = sessionStorage.getItem("signupPhone");
    if (!phone) {
      router.replace("/auth/sign-in");
      return;
    }

    const link = window.location.href;
    verifyEmailLink(link)
      .then(() => setEmailVerified(true))
      .catch(() => setError("Invalid email link"));
  }, [router]);

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

      <button onClick={verifyPhone}>Verify</button>
      {error && <p>{error}</p>}
    </main>
  );
}
