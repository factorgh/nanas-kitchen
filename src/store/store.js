import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice.js";
import dollarReducer from "./slices/dollarSlice.js";

// import {
//   loadDollarState,
//   loadState,
//   saveDollarState,
//   saveState,
// } from "../utils/localStorage";

// const preloadedState = {
//   cart: loadState() || [],
//   dollarCart: loadDollarState() || [],
// };

const store = configureStore({
  reducer: {
    // Define your reducers here
    cart: cartReducer,
    dollarCart: dollarReducer,
  },
  // preloadedState,
});

// Save the cart state to localStorage whenever it changes
// store.subscribe(() => {
//   saveState(store.getState().cart);
//   saveDollarState(store.getState().dollarCart);
// });

export default store;
