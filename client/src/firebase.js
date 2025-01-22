// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-38dac.firebaseapp.com",
  projectId: "mern-estate-38dac",
  storageBucket: "mern-estate-38dac.firebasestorage.app",
  messagingSenderId: "892064053292",
  appId: "1:892064053292:web:7a1569a7ebda7a2770f989"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);