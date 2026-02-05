import {
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "./firebase";

/* ---------- EMAIL MAGIC LINK ---------- */
export const sendEmailLink = async (email) => {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email");
  }

  const baseUrl = process.env.APP_BASE_URL;
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
