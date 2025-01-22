import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import { CountryProvider } from "./context/country-context.jsx";
import "./index.css";
import store from "./store/store.js";

registerSW({ immediate: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <CountryProvider>
        <App />
      </CountryProvider>
    </Provider>
  </StrictMode>
);
