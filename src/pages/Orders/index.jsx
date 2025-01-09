import { notification, Select, Table, Tag } from "antd";
import { Copy } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/order-service";

const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("all");

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
      setFilteredOrders(formattedOrders); // Initialize filtered orders
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

  const handleCountryChange = (value) => {
    setSelectedCountry(value);

    if (value === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) => order.userDetails?.country === value
      );
      setFilteredOrders(filtered);
    }

    // Update pagination
    setPagination((prev) => ({
      ...prev,
      total:
        value === "all"
          ? orders.length
          : orders.filter((order) => order.userDetails?.country === value)
              .length,
    }));
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
      render: (total, record) => {
        const country = record.userDetails?.country;
        return country === "GH"
          ? `₵${total.toFixed(2)}`
          : `$${total.toFixed(2)}`;
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (_, record) => {
        const location = record.userDetails?.location;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(location || "");
                notification.success({
                  message: "Copied to Clipboard",
                });
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              title="Copy Location"
            >
              <Copy size={16} color="#007bff" />
            </button>
          </div>
        );
      },
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
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Orders</h1>
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          style={{ width: 200 }}
        >
          <Option value="all">All Countries</Option>
          <Option value="GH">Ghana</Option>
          <Option value="US">United States</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        bordered
        loading={loading}
      />
    </div>
  );
};

export default Orders;
