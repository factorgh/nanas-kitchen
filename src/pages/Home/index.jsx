import { Card } from "antd";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/hero";
import ProductCard from "../../components/product-card";
import Wrapper from "../../components/wrapper";
import { addToCart } from "../../store/slices/cartSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = [
    {
      id: 1,
      title: "16oz Black Shitor(Mild)",
      image: "/shito-p1.jpg",
      price: 11.99,
      discount: "$17.99",
    },
    {
      id: 2,
      title: "16oz Black Shitor(Hot)",
      image: "/shito-p1.jpg",
      price: 11.99,
      discount: "$17.99",
    },
    {
      id: 3,
      title: "16oz Black Shitor(Mild)",
      image: "/shito-p1.jpg",
      price: 11.99,
      discount: "$17.99",
    },
    // Add more products here
  ];

  // Add To cart on home page
  const handleAddToCart = (product) => {
    console.log(product);
    const newProduct = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      discount: product.discount,
      quantity: 1,
      totalPrice: product.price,
    };
    // Add to cart
    dispatch(addToCart(newProduct));

    // Navigate to check out page
    navigate("/checkout");
  };

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef);

  const productsRef = useRef(null);
  const productsInView = useInView(productsRef);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef);

  return (
    <Wrapper>
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>

      <motion.div
        ref={productsRef}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        animate={productsInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col justify-center items-center mt-10"
      >
        <h1 className="text-4xl font-normal mb-4">
          &ldquo;Good Food Is The Foundation Of Genuine Happiness&ldquo;
        </h1>
        <p className="text-4xl mb-20 font-normal">-- Auguste Escoffer</p>
        <h1 className="text-5xl font-bold mb-5">Click to buy online</h1>
        <p className="text-md text-slate-600">
          Shop from our variety of Shito in different sizes
        </p>
      </motion.div>

      <motion.div
        ref={productsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={productsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "circInOut" }}
        className="container mx-auto mb-10 mt-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              handleAddToCart={handleAddToCart}
              key={product.id}
              product={product}
            />
          ))}
        </div>
        {/* Recipe section */}
        <div className="flex items-center justify-center gap-20 mt-20">
          {/* First section */}
          <motion.div
            ref={gridRef}
            initial={{ opacity: 0, y: 50 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "circInOut" }}
            className="flex flex-col gap-4 col-span-1  items-end mt-10"
          >
            <img src="/recipe-1.jpeg" alt="recipe-1" className="w-64" />
            <img src="/recipe-2.jpg" alt="recipe-2" className="w-64 " />
          </motion.div>
          {/* Second section */}
          <div className=" mt-10">
            <Card className="flex flex-col gap-4 items-center justify-center px-16 h-[600px] shadow-xl w-[550px] rounded-tr-[100px] rounded-tl-[100px]">
              <h3
                style={{
                  fontFamily: '"Kaushan Script", cursive',
                }}
                className="text-6xl italic text-red-800 text-center mb-5"
              >
                Enjoy these
              </h3>

              <p className="text-center text-5xl font-bold mb-20">RECIPES</p>

              <div>
                <p>
                  We want you to enjoy the foods that we enjoy; experience the
                  joy that we constantly live, and so here, we are going to
                  share many wonderful recipes with you. Some of these recipes
                  have been passed down for generations, some are our own
                  magical concoctions and the rest are meals that combine
                  perfectly with our shito.
                </p>
              </div>
            </Card>
          </div>
        </div>
        {/* End of recipe section */}
      </motion.div>
    </Wrapper>
  );
};

export default HomePage;
