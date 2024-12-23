import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  const storedCart = localStorage.getItem("dollarCartItems");
  return storedCart ? JSON.parse(storedCart) : [];
};

const initialState = {
  dollarCart: getInitialCart(),
};

const dollarSlice = createSlice({
  name: "dollarCart",
  initialState,
  reducers: {
    addToDollarCart: (state, action) => {
      const existingItem = state.dollarCart.find(
        (product) => product.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.dollarCart.push({
          ...action.payload,
          quantity: 1,
          totalPrice: action.payload.price,
        });
      }
    },

    removeFromDollarCart: (state, action) => {
      state.dollarCart = state.dollarCart.filter(
        (product) => product.id !== action.payload
      );
    },

    decreaseItemQuantityDollar: (state, action) => {
      const item = state.dollarCart.find(
        (product) => product.id === action.payload
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
          item.totalPrice = item.quantity * item.price;
        } else {
          state.dollarCart = state.dollarCart.filter(
            (product) => product.id !== action.payload
          );
        }
      } else {
        console.error(
          "Item not found in dollarCart for decrease:",
          action.payload
        );
      }
    },

    increaseItemQuantityDollar: (state, action) => {
      console.log(state.dollarCart, "Current dollarCart items");
      console.log(action.payload, "Action payload");

      const item = state.dollarCart.find(
        (product) => product.id === action.payload
      );
      console.log(item, "Item in slice");
      if (item) {
        item.quantity++;
        item.totalPrice = item.quantity * item.price;
      } else {
        console.error(
          "Item not found in dollarCart for increase:",
          action.payload
        );
      }
    },

    clearDollarCart: (state) => {
      state.dollarCart = [];
    },
  },
});

export const {
  addToDollarCart,
  removeFromDollarCart,
  decreaseItemQuantityDollar,
  increaseItemQuantityDollar,
  clearDollarCart,
} = dollarSlice.actions;

export default dollarSlice.reducer;
