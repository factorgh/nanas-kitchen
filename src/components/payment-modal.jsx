/* eslint-disable react/prop-types */
import { Card, Drawer } from "antd";
import { useContext } from "react";
import { CountryContext } from "../context/country-context";
import { createCheckoutSession } from "../services/order-service";

const PaymentModal = ({
  openPayment,
  setOpenPayment,
  userDetails,
  cartItems,
}) => {
  const { userCountry } = useContext(CountryContext);
  console.log(userCountry);
  console.log(cartItems);

  const handleStripeCheckout = async () => {
    const data = await createCheckoutSession(cartItems, userDetails);
    // Open url in in new window
    window.location.href = data.url;
    setOpenPayment(false);
  };
  return (
    <Drawer
      open={openPayment}
      onClose={() => setOpenPayment(false)}
      title="Choose Payment"
      centered
      footer={null}
      width={400}
    >
      <div className="flex flex-col gap-10">
        {userCountry === "USA" ? (
          <Card
            onClick={handleStripeCheckout}
            className="border border-blue-700 shadow-lg cursor-pointer"
          >
            Pay with Stripe
          </Card>
        ) : (
          <Card className="border border-slate-700 shadow-lg cursor-pointer ">
            Pay with Paystack
          </Card>
        )}
      </div>
    </Drawer>
  );
};

export default PaymentModal;
