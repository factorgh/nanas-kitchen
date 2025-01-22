import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
const KEY = import.meta.env.VITE_FIREBASE;
const firebaseConfig = {
  apiKey: KEY,
  authDomain: "nana-kitchen.firebaseapp.com",
  projectId: "nana-kitchen",
  storageBucket: "nana-kitchen.firebasestorage.app",
  messagingSenderId: "685265844271",
  appId: "1:685265844271:web:1ed9409926c7df252a2eda",
};

const app = initializeApp(firebaseConfig);

// Get Firebase Cloud Messaging instance
const messaging = getMessaging(app);

export { getToken, messaging };
