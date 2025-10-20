import axios from "axios";

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API URL
});

// Function to create a checkout session
export const createCheckoutSession = async (
  cartItems,
  userDetails,
  totalPrice
) => {
  console.log(cartItems, userDetails, totalPrice);
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

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/");
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Rethrow the error to handle it outside
  }
};

// Get only completed and delivered orders
export const getCompletedDeliveredOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/completed-delivered");
    return response.data;
  } catch (error) {
    console.error("Error fetching completed and delivered orders:", error);
    throw error;
  }
};

// Get all carriesCodes
export const getCarriersCode = async () => {
  try {
    const response = await axiosInstance.get("/orders/shipstation/carriers", {
      params: {
        carrierCode: "stamps_com",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching carriers:", error);
    throw error;
  }
};

export const getRates = () => {};

export const updateOrderStatus = async (orderId, orderData) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}`, {
      status: orderData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteOrder = (orderId) => {
  try {
    return axiosInstance.delete(`/orders/${orderId}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getDeletedOrders = () => {
  try {
    return axiosInstance.get(`/orders/trash`);
  } catch (error) {
    console.error("Error fetching deleted orders:", error);
    throw error;
  }
};

export const massDelete = () => {
  try {
    return axiosInstance.delete(`/orders/mass-delete`);
  } catch (error) {
    console.error("Error mass deleting orders:", error);
    throw error;
  }
};
