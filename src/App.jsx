import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/dashboard-layout";
import Layout from "./components/layout";
import CheckoutPage from "./pages/Checkout";
import ContactPage from "./pages/Contact";
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import Orders from "./pages/Orders";
import OurStoryPage from "./pages/OurStory";
import ProductPage from "./pages/Product";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminReviewsPage from "./pages/Reviews";
import SuccessPage from "./pages/Success";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setStoreConfig } from "./store/slices/storeConfigSlice";

const App = () => {
  const dispatch = useDispatch();

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const hostname = window.location.hostname;
    const configMap = {
      "nanashito.com": {
        domain: "nanahito.com",
        storeName: "Nana Shito",
        storeId: "shito-001",
      },
      "nanaskitchen.net": {
        domain: "nanaskitchen.net",
        storeName: "Nana's Kitchen",
        storeId: "kitchen-002",
      },
    };

    const matched = configMap[hostname] || {
      domain: hostname,
      storeName: "Nana Shito",
      storeId: "default-000",
    };

    dispatch(setStoreConfig(matched));
  }, [dispatch]);

  navigator.serviceWorker.addEventListener("message", () => {
    let count = localStorage.getItem("notifCount") || 0;
    count++;
    localStorage.setItem("notifCount", count);
    document.getElementById("notif-badge").innerText = count;
  });

  // Handle push notifications
  const publicVapidKey = import.meta.env.ITE_VAPID_PUBLIC_KEY;
  const adminId = localStorage.getItem("adminId");

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker Registered");

        // Ask for permission
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            subscribeToPush(registration, adminId);
          }
        });
      })
      .catch((error) => console.error("Service Worker Error", error));
  }

  // Subscribe to push notifications
  async function subscribeToPush(registration, adminId) {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch(`${BASE_URL}/noti/subscribe`, {
      method: "POST",
      body: JSON.stringify({ subscription, adminId }), // Send adminId
      headers: { "Content-Type": "application/json" },
    });

    console.log("Admin subscribed!");
  }

  // Convert VAPID key
  function urlBase64ToUint8Array(base64String) {
    console.log(base64String);
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        {/* Add more routes here for Admin */}

        <Route path="/product" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/product-detail/:id" element={<ProductDetailPage />} />

        {/* Protected routes */}
        <Route
          path="/admin"
          element={
            <Layout>
              <DashboardLayout />
            </Layout>
          }
        >
          <Route
            path="dashboard"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />
          <Route
            path="orders"
            element={
              <Layout>
                <Orders />
              </Layout>
            }
          />

          <Route
            path="reviews"
            element={
              <Layout>
                <AdminReviewsPage />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
