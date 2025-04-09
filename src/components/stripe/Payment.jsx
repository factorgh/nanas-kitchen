import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { axiosInstance } from "../../services/order-service";

function Payment({ totalAmount }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  console.log(clientSecret);
  console.log(stripePromise);

  useEffect(() => {
    const getConfig = async () => {
      try {
        const response = await axiosInstance.get("/orders/config");
        const { publishableKey } = response.data;
        setStripePromise(loadStripe(publishableKey));
      } catch (error) {
        console.error("Error fetching Stripe config:", error);
      }
    };

    getConfig();
  }, []);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axiosInstance.post(
          "/orders/create-payment-intent",
          {}
        );
        const { clientSecret } = response.data;
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, []);

  return (
    <>
      <div className="mt-10">
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm totalAmount={totalAmount} />
          </Elements>
        )}
      </div>
    </>
  );
}

export default Payment;
