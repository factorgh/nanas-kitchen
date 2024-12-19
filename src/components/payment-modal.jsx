// /* eslint-disable react/prop-types */
// import { Card, Drawer, message, Spin } from "antd";
// import { useContext, useState } from "react";
// import { CountryContext } from "../context/country-context";
// import { createCheckoutSession } from "../services/order-service";

// const PaymentModal = ({
//   openPayment,
//   setOpenPayment,
//   userDetails,
//   cartItems,
//   totalPrice,
// }) => {

//   console.log(userDetails);
//   console.log(totalPrice);

//   return (
//     <Drawer
//       open={openPayment}
//       onClose={() => setOpenPayment(false)}
//       title="Choose Payment"
//       centered
//       footer={null}
//       width={400}
//     >
//       <div className="flex flex-col gap-10">
//         {userCountry === "USA" ? (
//           <Spin spinning={loading}>
//             <Card
//               onClick={!loading ? handleStripeCheckout : null} // Disable click while loading
//               className={`border border-blue-700 shadow-lg cursor-pointer ${
//                 loading ? "opacity-50 pointer-events-none" : ""
//               }`}
//             >
//               Pay with Stripe
//             </Card>
//           </Spin>
//         ) : (
//           <Card className="border border-slate-700 shadow-lg cursor-pointer ">
//             Pay with Paystack
//           </Card>
//         )}
//       </div>
//     </Drawer>
//   );
// };

// export default PaymentModal;
