import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
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
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (product) => product.id !== action.payload
      );
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
      } else {
        console.error("Item not found in cart for decrease:", action.payload);
      }
    },
    increaseItemQuantity: (state, action) => {
      console.log(state.cart, "Current cart items");
      console.log(action.payload, "Action payload");

      const item = state.cart.find((product) => product.id === action.payload);
      console.log(item, "Item in slices");
      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.price;
      } else {
        console.error("Item not found in cart for increase:", action.payload);
      }
    },
    clearCart: (state) => {
      state.cart = [];
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
