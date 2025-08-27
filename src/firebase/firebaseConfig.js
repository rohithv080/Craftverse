
// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDorO0hUT0zKMsJbGcKUn33IYlrrupoUDI",
    authDomain: "kaithiran-web.firebaseapp.com",
    projectId: "kaithiran-web",
    storageBucket: "kaithiran-web.firebasestorage.app",
    messagingSenderId: "439320923041",
    appId: "1:439320923041:web:41ea1aef36926d41a859e0",
    measurementId: "G-4MWY4YF7MY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
