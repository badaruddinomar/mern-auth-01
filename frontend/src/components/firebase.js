// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-2571d.firebaseapp.com",
  projectId: "mern-auth-2571d",
  storageBucket: "mern-auth-2571d.appspot.com",
  messagingSenderId: "104666136757",
  appId: "1:104666136757:web:9ac576dda2eb485404fefc",
  measurementId: "G-3CE5ZJ49YW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
