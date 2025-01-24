/* eslint-disable react/prop-types */
import moment from "moment";

export const GenerateOrderModal = ({ order }) => {
  const subtotal = order.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const calculatedDeliveryPrice = order.totalAmount - subtotal;
  const sliceOrderId = order._id.toString().slice(-6);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#e74c3c",
            padding: "15px 20px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "22px" }}>
            New Order: #{sliceOrderId}
          </h1>
        </div>

        {/* Order Details */}
        <div style={{ padding: "20px" }}>
          <h2 style={{ color: "#333", fontSize: "18px", marginBottom: "10px" }}>
            Order Details
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              marginBottom: "20px",
            }}
          >
            <strong>Customer:</strong>{" "}
            {`${order.userDetails?.firstName || "N/A"} ${
              order.userDetails?.lastName || ""
            }`}
            <br />
            <strong>Order Date:</strong>{" "}
            {moment(order.createdAt).format("MM/DD/YYYY")}
            <br />
            <strong>Order ID:</strong> {sliceOrderId}
          </p>

          {/* Items Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    border: "1px solid #ddd",
                  }}
                >
                  Product
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    border: "1px solid #ddd",
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "10px",
                    border: "1px solid #ddd",
                  }}
                >
                  Price (GHC)
                </th>
              </tr>
            </thead>
            <tbody>
              {order.cartItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.title}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "10px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Table */}
          <table style={{ width: "100%", fontSize: "14px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", textAlign: "right" }}>
                  Subtotal:
                </td>
                <td style={{ textAlign: "right", padding: "8px 0" }}>
                  GHC {subtotal.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", textAlign: "right" }}>
                  Delivery Fee:
                </td>
                <td style={{ textAlign: "right", padding: "8px 0" }}>
                  GHC {calculatedDeliveryPrice.toFixed(2)}
                </td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td style={{ padding: "8px 0", textAlign: "right" }}>Total:</td>
                <td style={{ textAlign: "right", padding: "8px 0" }}>
                  GHC {order.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Delivery Details */}
        <div style={{ backgroundColor: "#f9f9f9", padding: "20px" }}>
          <h3 style={{ color: "#333", marginBottom: "10px" }}>
            Delivery Details
          </h3>
          <p style={{ fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            <strong>Address:</strong> {order.userDetails?.address || "N/A"}
            <br />
            <strong>Phone:</strong> {order.userDetails?.phone || "N/A"}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f1f1f1",
            textAlign: "center",
            padding: "10px",
          }}
        >
          <p style={{ fontSize: "12px", color: "#7f8c8d", margin: 0 }}>
            &copy; {new Date().getFullYear()} Nana &apos;s Kitchen. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
