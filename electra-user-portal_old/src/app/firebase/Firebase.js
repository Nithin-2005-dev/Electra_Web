// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrPtSrenGeX6djQxxYaSXgfnSm6eXrSAc",
  authDomain: "electra-361ed.firebaseapp.com",
  projectId: "electra-361ed",
  storageBucket: "electra-361ed.appspot.com",
  messagingSenderId: "229943374678",
  appId: "1:229943374678:web:5d76e3531a096aa0ff9cf7",
  measurementId: "G-N8J2V2HEV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);