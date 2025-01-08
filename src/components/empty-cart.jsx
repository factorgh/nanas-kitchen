import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import EmptyCartItem from "../empty-cart.json";

const EmptyCart = () => {
  const history = useNavigate();

  const handleGoShopping = () => {
    // Redirect user to shopping page (or wherever necessary)
    history("/");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-5">
        <Lottie
          animationData={EmptyCartItem}
          speed={0.3}
          className="w-64 h-64"
        />
      </div>
      <p className="text-lg text-gray-600 mb-5">Your cart is currently empty</p>
      <button
        className="px-6 py-2 text-lg bg-red-600 text-white rounded-md"
        onClick={handleGoShopping}
      >
        Order again
      </button>
    </div>
  );
};

export default EmptyCart;
