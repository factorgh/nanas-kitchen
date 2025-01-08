import { message } from "antd";
import axios from "axios";

export const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
export const API_URL = import.meta.env.VITE_API_URL;
export const handlePayStackPayment = async (
  setLoading,
  cartItems,
  userDetails,
  totalPrice,
  handleRedirect
) => {
  console.log(cartItems, userDetails, totalPrice);
  try {
    setLoading(true);

    // Make a POST request to the backend to initialize the payment
    const data = await axios.post(`${API_URL}/paystack/pay`, {
      cartItems,
      userDetails,
      totalPrice,
    });

    console.log(data, "From backend");
    console.log(data.data.orderId);
    const paystack = window.PaystackPop.setup({
      key: PUBLIC_KEY,
      email: userDetails.email,
      amount: totalPrice * 100,
      currency: "GHS",
      reference: `NanasKitchen-${data.data.orderId}`,
      metadata: {
        customerName: userDetails.name,
        customerPhone: userDetails.phone,
        // cartItems: cartItems.map((item) => ({
        //   name: item.name,
        //   quantity: item.quantity,
        // })),
        customNote: "Order from Nana's Kitchen",
      },
      callback: (response) => {
        if (response.status === "success") {
          // Handle successful payment
          console.log("Payment successful:", response);
          handleRedirect();

          // Call the asynchronous function outside of the callback to verify the payment
          handlePaymentVerification(response.reference, data.data.orderId);
        } else {
          alert("Payment was not successful");
        }
      },
      onClose: () => {
        alert("Payment cancelled");
      },
    });

    paystack.openIframe();
  } catch (error) {
    console.error(error);
    setLoading(false);
    alert("Payment initialization failed");
  } finally {
    setLoading(false); // Ensure loading state is reset after process
  }
};

// Function to handle payment verification asynchronously
const handlePaymentVerification = async (
  reference,
  orderId
  // handleRedirect
) => {
  try {
    const response = await axios.post(`${API_URL}/paystack/verify`, {
      reference,
      orderId,
    });
    console.log(response);
    // Handle the verification response
    if (response.data.data.status === "success") {
      message.success("Payment verification successful!");
      // handleRedirect();
    } else {
      message.error("Payment verification failed.");
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    message.error("Payment verification failed due to an error.");
  }
};
