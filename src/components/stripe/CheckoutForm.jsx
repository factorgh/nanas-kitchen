import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm({ totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: import.meta.env.VITE_FRONTEND_URL,
      },
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="max-w-2xl w-full mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6"
    >
      <div className="flex items-center justify-between ">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Complete Your Payment
        </h2>
        <h2 className="text-xl font-bold">${totalAmount}</h2>
      </div>

      <PaymentElement id="payment-element" className="mb-4" />

      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className={`w-full py-3 px-4 rounded-lg text-white text-center text-sm font-medium transition-all duration-200 ${
          isProcessing || !stripe || !elements
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-blue-700"
        }`}
      >
        <span id="button-text">
          {isProcessing ? "Processing..." : "Pay now"}
        </span>
      </button>

      {message && (
        <div
          id="payment-message"
          className="mt-2 text-sm text-center text-red-500"
        >
          {message}
        </div>
      )}
    </form>
  );
}
