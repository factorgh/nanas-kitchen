import { Table, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/order-service";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      const formattedOrders = response?.map((order) => ({
        ...order,
        key: order._id,
      }));
      setOrders(formattedOrders);
      setPagination((prev) => ({
        ...prev,
        total: formattedOrders.length,
      }));
    } catch (err) {
      setError("Failed to load orders. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTableChange = (pagination, filters) => {
    setPagination({
      ...pagination,
    });

    if (filters.status && filters.status.length > 0) {
      // Apply filtering based on the selected filter
      const filtered = filters.status.includes("all")
        ? orders
        : orders.filter((order) => filters.status.includes(order.status));
      setPagination((prev) => ({
        ...prev,
        total: filtered.length,
      }));
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => `#${_id.toString().slice(-6)}`,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (_, record) =>
        record.userDetails
          ? `${record.userDetails.firstName} ${record.userDetails.lastName}`
          : "Unknown Customer",
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
          status === "completed"
            ? "green"
            : status === "processing"
            ? "blue"
            : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: "All", value: "all" },
        { text: "Completed", value: "completed" },
        { text: "Processing", value: "processing" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => {
        if (value === "all") return true;
        return record.status === value;
      },
    },
  ];

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Orders</h1>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        bordered
        loading={loading}
      />
    </div>
  );
};

export default Orders;
