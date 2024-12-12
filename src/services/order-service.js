import axios from "axios";

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Replace with your API URL
});

// Function to create a checkout session
export const createCheckoutSession = async (
  cartItems,
  userDetails,
  totalPrice
) => {
  console.log(cartItems, userDetails);
  try {
    const response = await axiosInstance.post(
      "/orders/checkout/create-checkout-session",
      {
        cartItems,
        userDetails,
        totalPrice,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error; // Rethrow the error to handle it outside
  }
};
