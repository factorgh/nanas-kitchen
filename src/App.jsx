import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckoutPage from "./pages/Checkout";
import ContactPage from "./pages/Contact";
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
