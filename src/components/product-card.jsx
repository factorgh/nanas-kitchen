/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CountryContext } from "../context/country-context";
import { formatCurrency } from "../utils/currency-formatter";

const ProductCard = ({ product, handleAddToCart }) => {
  const { userCountry } = useContext(CountryContext);
  const navigate = useNavigate();

  const formattedPrice = (price, currency, locale) =>
    formatCurrency(price, currency, locale);

  function extractBracketContents(input) {
    const matches = input.match(/\((.*?)\)/); // Match content inside parentheses
    return matches ? matches[1] : null; // Return the content if a match is found, or null
  }

  let color;

  if (extractBracketContents(product.title) === "Hot") {
    color = "bg-red-500";
  } else if (extractBracketContents(product.title) === "Extra Hot") {
    color = "bg-red-700";
  } else if (extractBracketContents(product.title) === "Mild") {
    color = "bg-yellow-400";
  } else {
    color = "bg-green-500";
  }

  // 16 oz Black Shitor (Extra Hot)
  // 16 oz Black Shitor (Mild)
  // 16 oz Black Shitor (Hot)

  const handleGoToDetail = () => {
    // Navigate to product detail page
    navigate(`/product-detail/${product._id}`, { state: { product } });
  };

  const buttonClass = `${color} text-white p-4 mt-3 w-48 rounded-lg`;

  if (product.title)
    return (
      <motion.div
        animate={{
          scale: [0.4, 1],
        }}
        transition={{
          ease: "circInOut",
          duration: 0.5,
        }}
        className="flex flex-col items-center relative "
      >
        {/* Image */}

        <div className="w-12 h-12 bg-[#FFE2C7] flex items-center justify-center rounded-3xl text-end absolute left-7">
          Sale!
        </div>

        <img
          onClick={handleGoToDetail}
          className="w-52  cursor-pointer object-cover"
          src={product.image}
          alt={product.title}
        />
        {/* Title */}
        <h3 className="text-xl font-bold">{product.title}</h3>
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
          className={`${buttonClass}`}
        >
          Add To Cart
        </button>
      </motion.div>
    );
};

export default ProductCard;
