import { createSlice } from "@reduxjs/toolkit";

// Initialize cart from localStorage or fall back to an empty array
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cartItems");
  return storedCart ? JSON.parse(storedCart) : [];
};

const initialState = {
  cart: getInitialCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(
        (product) => product.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.cart.push({
          ...action.payload,
          quantity: 1,
          totalPrice: action.payload.price,
        });
      }
      // Save the updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (product) => product.id !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    decreaseItemQuantity: (state, action) => {
      const item = state.cart.find((product) => product.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
          item.totalPrice = item.quantity * item.price;
        } else {
          state.cart = state.cart.filter(
            (product) => product.id !== action.payload
          );
        }
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    increaseItemQuantity: (state, action) => {
      const item = state.cart.find((product) => product.id === action.payload);
      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.price;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    clearCart: (state) => {
      state.cart = [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseItemQuantity,
  increaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
