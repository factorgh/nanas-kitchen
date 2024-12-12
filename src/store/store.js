import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice.js";

const store = configureStore({
  reducer: {
    // Define your reducers here
    cart: cartReducer,
  },
});

export default store;
