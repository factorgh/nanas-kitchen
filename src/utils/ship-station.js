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

  console.log(
    `-------------------------${weight}------------------------${dimensions}----------------${userCountry}----------------${postalCode}----------------`
  );

  const payload = {
    carrierCode: "stamps_com",
    fromPostalCode: "77406",
    toCountry: userCountry,
    toPostalCode: postalCode,
    serviceCode: "usps_ground_advantage",
    weight: { value: weight, units: "ounces" },
    dimensions: {
      units: "inches",
      length: 12,
      width: 12,
      height: 12,
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
    // message.error("Zip code is not a valid.Please try again");
    console.error("Error fetching shipping rates:", error);
    throw error;
  }
};

export const fetchShippoRates = async (
  userData,
  userCountry,
  updatedCartItems
) => {
  try {
    console.log("Updated cart items:", updatedCartItems);
    const payload = {
      fromAddress: {
        name: "Nana's Shito",
        street1: "17850 W. GrandParkway",
        city: "Los Angeles",
        state: "TX",
        zip: "77406",
        country: "US",
        phone: "+18322769667",
        email: "chef@nanaskitchen.net",
      },
      toAddress: {
        name: userData.name,
        street1: userData.address,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
        country: userCountry,
        phone: userData.phone,
        email: userData.emai,
      },
      order: {
        cartItems: updatedCartItems,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/shippo/get-shipping-rates`,
      payload
    );

    console.log(response.data);
    const rates = response.data?.rates || [];
    const groundRate = rates[0];
    console.log(parseFloat(groundRate.amount));

    return groundRate ? parseFloat(groundRate.amount) : 0;
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return 0;
  }
};

export const calculateWeight = (cartItems) => {
  return cartItems.reduce(
    (totalWeight, item) => totalWeight + item.weight * item.quantity,
    0
  );
};

export const calculateDimensions = (cartItems) => {
  console.log(cartItems);
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
