// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-27c95.firebaseapp.com",
  projectId: "mern-estate-27c95",
  storageBucket: "mern-estate-27c95.firebasestorage.app",
  messagingSenderId: "128497504315",
  appId: "1:128497504315:web:20bc6d4f86c07ec67a4c1e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);