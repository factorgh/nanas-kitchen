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
import SuccessPage from "./pages/Success";

const App = () => {
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
