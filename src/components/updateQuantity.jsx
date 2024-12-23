/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseItemQuantity,
  increaseItemQuantity,
} from "../store/slices/cartSlice";
import {
  decreaseItemQuantityDollar,
  increaseItemQuantityDollar,
} from "../store/slices/dollarSlice";

const UpdateQuantity = ({ id }) => {
  const dispatch = useDispatch();
  const quantity = useSelector((state) => {
    const item = state.cart.cart.find((product) => product.id === id);
    return item ? item.quantity : 0;
  });

  console.log(id, "id item");
  const handleIncrement = () => {
    dispatch(increaseItemQuantity(id));
    dispatch(increaseItemQuantityDollar(id));
  };
  const handleDecrement = () => {
    dispatch(decreaseItemQuantity(id));
    dispatch(decreaseItemQuantityDollar(id));
  };
  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={handleIncrement}
        className="px-2.5 py-3 md:px-3.5 md:py-2 text-xs md:text-sm bg-red-500 text-white rounded-2xl"
      >
        +
      </button>
      <span> {quantity}</span>
      <button
        onClick={handleDecrement}
        className="px-2.5 py-3 md:px-3.5 md:py-2 text-xs md:text-sm bg-red-500 text-white rounded-2xl"
      >
        -
      </button>
    </div>
  );
};

export default UpdateQuantity;
