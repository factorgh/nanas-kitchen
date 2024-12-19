import axios from "axios";
import { Buffer } from "buffer";

export const API_KEY = import.meta.env.VITE_ENV_SHIP_STATION_API_KEY;
export const API_SECRET = import.meta.env.VITE_ENV_SHIP_STATION_SECRET_KEY;

export const fetchShippingRate = async (
  weight,
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Fetch shipping rates from ShipStation
   * @param {number} weight Package weight in ounces
   * @param {{length: number, width: number, height: number}} dimensions Package dimensions in inches
   * @param {string} userCountry User country code (e.g. "USA")
   * @param {string} postalCode User postal code (e.g. "12345")
   * @returns {Promise<number>} The lowest shipping rate or 0 if there is an error
   */
  /******  72e9f1b8-dcf8-407b-aa76-a832c5bca0ed  *******/ dimensions,
  userCountry,
  postalCode
) => {
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

  const payload = {
    carrierCode: "stamps_com",
    fromPostalCode: "77406",
    toCountry: userCountry,
    toPostalCode: postalCode,
    serviceCode: "usps_ground_advantage",
    weight: { value: weight, units: "ounces" },
    dimensions: {
      units: "inches",
      length: dimensions.length,
      width: dimensions.width,
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
