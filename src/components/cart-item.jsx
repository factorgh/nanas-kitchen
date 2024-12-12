import { DeleteOutlined } from "@ant-design/icons";
import UpdateQuantity from "./updateQuantity";

/* eslint-disable react/prop-types */
const CartItem = ({ product, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md shadow-sm w-full">
      {/* Product Title */}
      <p className="font-semibold text-md text-gray-700 truncate w-1/3">
        <span className="font-medium">{product.quantity}</span> x{" "}
        {product.title}
      </p>

      {/* Quantity and Price */}
      <div className="text-right flex  gap-5">
        <p className="text-sm text-gray-600">
          <span className="font-medium">${product.price}</span>
        </p>
      </div>
      <UpdateQuantity id={product.id} />
      {/* Delete Icon */}
      <DeleteOutlined
        className="cursor-pointer text-red-500 text-xl hover:text-red-700 transition"
        onClick={() => onDelete(product.id)}
        title="Remove Item"
      />
    </div>
  );
};

export default CartItem;
