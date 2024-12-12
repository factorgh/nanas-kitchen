/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const ProductCard = ({ product, handleAddToCart }) => {
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
      <div className="flex justify-end w-full">
        <div className="w-12 h-12 bg-[#FFE2C7] flex items-center justify-center rounded-3xl text-end">
          Sale!
        </div>
      </div>
      <img src={product.image} alt={product.title} />
      {/* Title */}
      <h3 className="text-2xl font-bold">{product.title}</h3>
      {/* Price */}
      <p>
        <span className="line-through mr-2 text-lg">{product.discount}</span>
        <span className="text-lg"> $ {product.price}</span>
      </p>
      {/* Button */}

      <button
        onClick={() => handleAddToCart(product)}
        className="bg-[#AF1313] text-white p-4 mt-3 w-48"
      >
        Add To Cart
      </button>
    </motion.div>
  );
};

export default ProductCard;
