import { axiosInstance } from "./order-service";

export const addReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post("/reviews", reviewData);
    if (response.status === 201 || response.status === 200) {
      // Assuming successful creation would return a 201 or 200 status
      return response.data;
    } else {
      // Handle unexpected HTTP status codes
      console.error(`Unexpected response: ${response.status}`);
      throw new Error("Failed to create product.");
    }
  } catch (error) {
    // Handle different error cases (network, API, etc.)
    if (error.response) {
      // If the server responded with a status other than 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while creating the product."
      );
    } else if (error.request) {
      // If no response was received
      console.error("No response received from the server:", error.request);
      throw new Error("No response received from the server.");
    } else {
      // Anything else (setup or unexpected error)
      console.error("Error setting up the request:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

// Get all products
export const getAllReviews = async () => {
  try {
    const response = await axiosInstance.get("/reviews");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Get product by ID
export const getProductReviews = async (productId) => {
  try {
    const response = await axiosInstance.get(`/reviews/${productId}/review`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Update product by ID
export const updateProductReviewById = async (reviewId, reviewData) => {
  console.log(reviewId);
  console.log(reviewData);
  try {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, {
      status: reviewData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product by ID
export const deleteProductById = async (reviewId) => {
  try {
    await axiosInstance.delete(`/products/${reviewId}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
