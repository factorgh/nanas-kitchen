import { Card } from "antd";
import { motion, useInView } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/hero";
import ProductCard from "../../components/product-card";
import Wrapper from "../../components/wrapper";
import { CountryContext } from "../../context/country-context";
import { getAllProducts } from "../../services/product-service";
import { addToCart, clearCart } from "../../store/slices/cartSlice";
import {
  addToDollarCart,
  clearDollarCart,
} from "../../store/slices/dollarSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const { userCountry } = useContext(CountryContext);

  // Current country of user

  console.log(userCountry);

  // Scroll to id on mount
  useEffect(() => {
    const id = sessionStorage.getItem("scrollToId");
    if (id) {
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 1000); // Delay to ensure the DOM has loaded

      // sessionStorage.removeItem("scrollToId"); // Remove after use
    }
  }, []);

  // Get all products
  useEffect(() => {
    const getProducts = async () => {
      const res = await getAllProducts();
      setProducts(res);
    };
    getProducts();
  }, []);

  // Country Checker

  // Add To cart on home page
  const handleAddToCart = (product) => {
    dispatch(clearCart());
    console.log(product);
    const newProduct = {
      id: product._id,
      title: product.title,
      image: product.image,
      price: product.cediDiscount,
      quantity: 1,
      totalPrice: product.cediDiscount,
      weight: product.weight,
      height: product.height,
      length: product.length,
      width: product.width,
    };

    // Add to cart
    dispatch(addToCart(newProduct));

    // Navigate to check out page
    navigate("/checkout");
    window.scrollTo(0, 0); //
  };
  const handleDollarAddToCart = (product) => {
    dispatch(clearDollarCart());
    console.log(product);
    const newProduct = {
      id: product._id,
      title: product.title,
      image: product.image,
      price: product.dollarDiscount,
      quantity: 1,
      totalPrice: product.dollarDiscount,
      weight: product.weight,
      height: product.height,
      length: product.length,
      width: product.width,
    };

    // Add to cart
    dispatch(addToDollarCart(newProduct));

    // Navigate to check out page
    navigate("/checkout");
    window.scrollTo(0, 0); //
  };

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef);

  const productsRef = useRef(null);
  const productsInView = useInView(productsRef);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef);

  return (
    <Wrapper>
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className=""
      >
        <HeroSection />
      </motion.div>

      {/* Introduction Section */}
      <motion.div
        ref={productsRef}
        initial={{ opacity: 1, scale: 0.8 }}
        animate={productsInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col justify-center items-center mt-10 px-4 md:px-8"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-center mb-4">
          &ldquo;Good Food Is The Foundation Of Genuine Happiness&ldquo;
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-center mb-20">
          -- Auguste Escoffer
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-center">
          Click to buy online
        </h1>
        <p className="text-sm md:text-md md:text-lg text-slate-600 text-center">
          Shop from our variety of Shito in different sizes
        </p>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        ref={productsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={productsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "circInOut" }}
        className="container mx-auto px-4 md:px-8 lg:px-16 mb-10 mt-10"
      >
        {products.length === 0 ? (
          <div className="">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-center">
              No products available
            </h1>
          </div>
        ) : (
          <div
            id="products"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {products.map((product) => (
              <ProductCard
                handleAddToCart={() => {
                  handleAddToCart(product);
                  handleDollarAddToCart(product);
                }}
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Recipe Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 mt-20 px-4">
          {/* First Section (Images) */}
          <motion.div
            ref={gridRef}
            initial={{ opacity: 0, y: 50 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "circInOut" }}
            className="flex flex-col gap-4 items-center lg:items-end mt-10"
          >
            <img
              src="/recipe-1.jpeg"
              alt="recipe-1"
              className="w-full max-w-sm object-cover rounded"
            />
            <img
              src="/recipe-2.jpg"
              alt="recipe-2"
              className="w-full max-w-sm object-cover rounded"
            />
          </motion.div>

          {/* Second Section (Card) */}
          <div className="flex items-center justify-center mt-10">
            <Card className="flex flex-col gap-4 items-center justify-center px-8 md:px-16 py-10 shadow-xl w-full max-w-lg lg:h-[600px] rounded-tr-[50px] rounded-tl-[50px]">
              <h3
                style={{
                  fontFamily: '"Kaushan Script", cursive',
                }}
                className="text-3xl md:text-4xl lg:text-6xl italic text-red-800 text-center mb-5"
              >
                Enjoy these
              </h3>
              <p className="text-lg md:text-2xl lg:text-5xl font-bold mb-10 text-center">
                RECIPES
              </p>
              <p className="text-sm md:text-base lg:text-lg text-center">
                We want you to enjoy the foods that we enjoy; experience the joy
                that we constantly live, and so here, we are going to share many
                wonderful recipes with you. Some of these recipes have been
                passed down for generations, some are our own magical
                concoctions, and the rest are meals that combine perfectly with
                our shito.
              </p>
            </Card>
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
};

export default HomePage;
