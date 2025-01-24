import { Modal, notification, Select, Table } from "antd";
import { Copy } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import StatusDropdown from "../../components/StatusDropdown"; // Ensure this path is correct
import { GenerateOrderModal } from "../../components/generate-order";
import { getAllOrders } from "../../services/order-service";

const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleShowOrderDetailModal = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  const handleModalClose = () => {
    setShowOrderDetailModal(false);
    setSelectedOrder(null);
  };
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      const formattedOrders = response?.map((order) => ({
        ...order,
        key: order._id,
      }));
      console.log(formattedOrders);
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

  const handleTableChange = (pagination, filters) => {
    setPagination({
      ...pagination,
    });

    if (filters.status && filters.status.length > 0) {
      // Apply filtering based on the selected filter
      const filtered = filters.status.includes("all")
        ? orders
        : orders.filter((order) => filters.status.includes(order.status));
      setFilteredOrders(filtered);
      setPagination((prev) => ({
        ...prev,
        total: filtered.length,
      }));
    }
  };

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
      render: (_id, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => handleShowOrderDetailModal(record)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "#007bff",
            }}
          >
            #${_id.toString().slice(-6)}
          </button>
        </div>
      ),
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
        let formattedTotal;

        switch (country) {
          case "GH":
            formattedTotal = `₵${total.toFixed(2)}`; // Ghanaian Cedi
            break;
          case "USD":
            formattedTotal = `$${total.toFixed(2)}`; // US Dollar
            break;
          default:
            formattedTotal = `$${total.toFixed(2)}`; // Default currency
        }

        return formattedTotal;
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
      render: (_, record) =>
        moment(record.createdAt).format("YYYY-MM-DD - HH:mm:ss A"),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (_, record) => {
        if (record.userDetails?.country === "GH") {
          return "Ghana";
        } else if (record.userDetails?.country === "USA") {
          return "USA";
        }
        return "Unknown Country";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <StatusDropdown
          initialStatus={record.status}
          orderId={record._id}
          onStatusChange={(newStatus) => {
            const updatedOrders = orders.map((order) =>
              order._id === record._id ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
          }}
        />
      ),
      filters: [
        { text: "All", value: "all" },
        { text: "Completed", value: "completed" },
        { text: "Processing", value: "processing" },
        { text: "Delivered", value: "delivered" },
      ],
      onFilter: (value, record) => {
        if (value === "all") return true;
        return record.status === value;
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
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        bordered
        loading={loading}
      />
      {showOrderDetailModal && selectedOrder && (
        <Modal
          title="Order Details"
          open={showOrderDetailModal}
          onCancel={handleModalClose}
          footer={null}
        >
          {selectedOrder && <GenerateOrderModal order={selectedOrder} />}
        </Modal>
      )}
    </div>
  );
};

export default Orders;
