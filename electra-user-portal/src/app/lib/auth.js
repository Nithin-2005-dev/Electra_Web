import {
  sendSignInLinkToEmail,
  signInWithEmailLink,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "./firebase";

/* ---------- EMAIL MAGIC LINK ---------- */
export const sendEmailLink = async (email) => {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_BASE_URL is not defined");
  }

  const actionCodeSettings = {
    url: `${baseUrl}/auth/verify`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);

  // Persist email for same-device verification
  window.localStorage.setItem("emailForSignIn", email);
};

/* ---------- PHONE OTP ---------- */
let recaptchaVerifier;

export const initRecaptcha = (containerId = "recaptcha") => {
  if (typeof window === "undefined") return null;

  if (recaptchaVerifier) {
    return recaptchaVerifier;
  }

  recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    { size: "invisible" }
  );

  // Render immediately so it is ready for the OTP request.
  recaptchaVerifier.render().catch(() => {});

  return recaptchaVerifier;
};

export const sendPhoneOTP = async (phone) => {
  if (!phone || typeof phone !== "string") {
    throw new Error("Invalid phone number");
  }

  const verifier = initRecaptcha("recaptcha");
  if (!verifier) {
    throw new Error("Recaptcha not initialized");
  }

  return signInWithPhoneNumber(auth, phone, verifier);
};

/* ---------- VERIFY EMAIL LINK ---------- */
export const verifyEmailLink = async (link) => {
  let email = window.localStorage.getItem("emailForSignIn");

  // Fallback for different device / cleared storage
  if (!email) {
    email = window.prompt("Please confirm your email");
  }

  if (!email) {
    throw new Error("Email is required to complete sign-in");
  }

  const result = await signInWithEmailLink(auth, email, link);

  // Cleanup
  window.localStorage.removeItem("emailForSignIn");

  return result;
};
