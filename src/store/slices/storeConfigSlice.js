// storeConfigSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialDomain =
  typeof window !== "undefined" ? window.location.hostname : "";

const configMap = {
  "nanashito.com": {
    domain: "nanashito.com",
    storeName: "Nana's Shito",
    storeId: "shito-001",
    branding: {
      logoUrl: "/logos/shito.png",
      themeColor: "#ff6600",
    },
  },
  "nanaskitchen.net": {
    domain: "nanaskitchen.net",
    storeName: "Nana's Kitchen",
    storeId: "kitchen-002",
    branding: {
      logoUrl: "/logos/kitchen.png",
      themeColor: "#00cc99",
    },
  },
};

const defaultConfig = configMap[initialDomain] || {
  domain: initialDomain,
  storeName: "Nana Shito",
  storeId: "default-000",
};

const storeConfigSlice = createSlice({
  name: "storeConfig",
  initialState: defaultConfig,
  reducers: {
    setStoreConfig: (state, action) => action.payload,
  },
});

export const { setStoreConfig } = storeConfigSlice.actions;
export default storeConfigSlice.reducer;
