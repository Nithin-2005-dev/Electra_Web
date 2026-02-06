"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailLink, initRecaptcha, sendPhoneOTP } from "../../lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!email.includes("@") || !phone) {
      setError("Enter a valid email and phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendEmailLink(email);

      initRecaptcha("recaptcha");
      const confirmation = await sendPhoneOTP(phone);

      window.confirmationResult = confirmation;
      sessionStorage.setItem("signupPhone", phone);

      router.push("/auth/verify");
    } catch (err) {
      const code = err?.code ? ` (${err.code})` : "";
      setError(`Verification setup failed${code}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={handleContinue} disabled={loading}>
        Continue
      </button>
      <div id="recaptcha" />
      {error && <p>{error}</p>}
    </main>
  );
}
