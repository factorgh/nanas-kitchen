/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useContext } from "react";
import { CountryContext } from "../context/country-context";
import { formatCurrency } from "../utils/currency-formatter";

const ProductCard = ({ product, handleAddToCart }) => {
  const { userCountry } = useContext(CountryContext);

  const formattedPrice = (price, currency, locale) =>
    formatCurrency(price, currency, locale);

  return (
    <motion.div
      animate={{
        scale: [0.4, 1],
      }}
      transition={{
        ease: "circInOut",
        duration: 0.5,
      }}
      className="flex flex-col items-center"
    >
      {/* Image */}
      <div className="flex justify-end w-full ">
        <div className="w-12 h-12 bg-[#FFE2C7] flex items-center justify-center rounded-3xl text-end">
          Sale!
        </div>
      </div>
      <img className="w-52 h-52" src={product.image} alt={product.title} />
      {/* Title */}
      <h3 className="text-2xl font-bold">{product.title}</h3>
      {/* Price */}
      <p>
        <span className="line-through mr-2 text-lg">
          {formattedPrice(
            userCountry === "GHANA" ? product.cediPrice : product.dollarPrice,
            userCountry === "GHANA" ? "GHS" : "USD",
            userCountry === "GHANA" ? "en-GH" : "en-US"
          )}
        </span>
        <span className="text-lg">
          {formattedPrice(
            userCountry === "GHANA"
              ? product.cediDiscount
              : product.dollarDiscount,

            userCountry === "GHANA" ? "GHS" : "USD",
            userCountry === "GHANA" ? "en-GH" : "en-US"
          )}
        </span>
      </p>
      {/* Button */}
      <button
        onClick={() => handleAddToCart(product)}
        className="bg-red-500 text-white p-4 mt-3 w-48 rounded-lg"
      >
        Add To Cart
      </button>
    </motion.div>
  );
};

export default ProductCard;
