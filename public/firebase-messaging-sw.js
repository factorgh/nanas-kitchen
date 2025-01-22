/* eslint-disable no-undef */
import firebase from "firebase/compat/app";

// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js");

const KEY = import.meta.env.VITE_FIREBASE;
firebase.initializeApp({
  apiKey: KEY,
  authDomain: "nana-kitchen.firebaseapp.com",
  projectId: "nana-kitchen",
  storageBucket: "nana-kitchen.firebasestorage.app",
  messagingSenderId: "685265844271",
  appId: "1:685265844271:web:1ed9409926c7df252a2eda",
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/nana-icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
