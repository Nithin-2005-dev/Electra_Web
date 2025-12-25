import {
  signInWithEmailLink,
  sendSignInLinkToEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "./firebase";

/* ---------- EMAIL MAGIC LINK ---------- */
export const sendEmailLink = async (email) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/verify`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  localStorage.setItem("emailForSignIn", email);
};

export const verifyEmailLink = async (link) => {
  const email = localStorage.getItem("emailForSignIn");
  if (!email) throw new Error("Missing email");

  return signInWithEmailLink(auth, email, link);
};

/* ---------- PHONE OTP ---------- */
export const initRecaptcha = (containerId) => {
  if (window.recaptchaVerifier) return;

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    { size: "invisible" }
  );
};

export const sendPhoneOTP = async (phone) => {
  if (!window.recaptchaVerifier) {
    throw new Error("Recaptcha not initialized");
  }
  return signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
};
