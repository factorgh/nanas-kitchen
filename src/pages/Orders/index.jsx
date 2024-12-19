import { Table, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/order-service";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => `#${_id.toString().slice(-6)}`,
    },
    {
      title: "Customer",
      dataIndex: "customer", // Assumes `customer` is the field in your data representing the customer object
      key: "customer", // Unique key for React rendering
      render: (_, record) =>
        `${record.userDetails.firstName} ${record.userDetails.lastName}`,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (total) => `$${total.toFixed(2)}`,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_, record) => moment(record.orderDate).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Completed"
            ? "green"
            : status === "Processing"
            ? "gold"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Orders</h1>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default Orders;
