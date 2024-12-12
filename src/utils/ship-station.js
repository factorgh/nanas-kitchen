import axios from "axios";
import { Buffer } from "buffer";

export const fetchShippingRate = async (
  weight,
  dimensions,
  userCountry
  //   fromPostalCode
) => {
  const API_KEY = import.meta.env.VITE_ENV_SHIP_STATION_API_KEY;
  const API_SECRET = import.meta.env.VITE_ENV_SHIP_STATION_SECRET_KEY;
  console.log(API_SECRET);
  console.log(API_KEY);

  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
  console.log(auth);

  const payload = {
    carrierCode: "stamps_com", // Or dynamically set based on your configuration
    fromPostalCode: "77406", // Origin postal code
    toCountry: userCountry,
    weight: { value: weight, units: "ounces" },
    dimensions: {
      units: "inches",
      length: dimensions.length,
      width: 0,
      height: dimensions.height,
    },
    packageCode: "package",
  };

  try {
    const response = await axios.post(
      "https://ssapi.shipstation.com/shipments/getrates",
      payload,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the lowest rate or other logic
    const rates = response.data;
    return rates.length > 0 ? rates[0].shipmentCost : 0;
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    throw error;
  }
};

export const calculateWeight = (cartItems) => {
  return cartItems.reduce(
    (totalWeight, item) => totalWeight + item.weight * item.quantity,
    0
  );
};

export const calculateDimensions = (cartItems) => {
  return cartItems.reduce(
    (total, item) => {
      total.length += item.length;
      total.width += item.width;
      total.height += item.height;
      return total;
    },
    { length: 0, width: 0, height: 0 }
  );
};
