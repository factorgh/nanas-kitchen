import { DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Modal, notification, Select, Table, Tabs } from "antd";
import { Copy } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import StatusDropdown from "../../components/StatusDropdown"; // Ensure this path is correct
import { GenerateOrderModal } from "../../components/generate-order";

import {
  deleteOrder,
  getAllOrders,
  getDeletedOrders,
  massDelete,
  updateOrderStatus,
} from "../../services/order-service";
import axios from "axios";

const { Option } = Select;
const { TabPane } = Tabs;

const Orders = () => {
  const [activeTab, setActiveTab] = useState("completed");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false); // Fixed initial state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  console.log(error);
  const handleTabChange = (key) => {
    console.log(key);
    setActiveTab(key);
    const filtered = orders.filter((order) => order.status === key);
    console.log(filtered);
    setFilteredOrders(filtered);
    setPagination((prev) => ({
      ...prev,
      total: filtered.length,
    }));
  };

  const handleShowOrderDetailModal = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  const handleModalClose = () => {
    setShowOrderDetailModal(false);
    setSelectedOrder(null);
  };

  const getDimensionsByQuantity = (quantity) => {
    if (quantity === 1) return { length: 8, width: 6, height: 4 };
    if (quantity === 2) return { length: 12, width: 9, height: 6 };
    if (quantity === 3) return { length: 12, width: 10, height: 8 };
    if (quantity === 4) return { length: 19, width: 14, height: 17 };
    if (quantity === 5) return { length: 10, width: 10, height: 10 };
    return { length: 12, width: 12, height: 12 };
  };

  const genarateLabels = async (order) => {
    // Get the first item in the order cartItEMS
    const item = order.cartItems[0];

    // Get dimensions for quantity
    const totalQuanttiy = order.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const dimensions = getDimensionsByQuantity(totalQuanttiy);

    const payload = {
      orderId: order._id,
      addressFrom: {
        name: "Nana's Shito",
        street1: "17850 W. GrandParkway",
        city: "Los Angeles",
        state: "TX",
        zip: "77406",
        country: "US",
        phone: "+18322769667",
        email: "chef@nanaskitchen.net",
      },
      addressTo: {
        name: order.userDetails.firstName + " " + order.userDetails.lastName,
        company: "",
        street1: order.userDetails.address,
        city: order.userDetails.city,
        state: order.userDetails.state,
        zip: order.userDetails.zip,
        country: "US",
        phone: order.userDetails.phone,
        email: order.userDetails.email,
        metadata: "Nana's Shito",
      },
      parcel: {
        length: "5",
        width: "5",
        height: "5",
        distanceUnit: "in",
        weight: "2",
        massUnit: "lb",
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/shippo/generate-label`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log(response?.data);
      // Open url in new tab
      window.open(response?.data.labelUrl, "_blank");
    } else {
      toast.error("Failed to generate label");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();

      console.log(response.data);
      setOrders(response.data);
      // setFilteredOrders(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.length,
      }));
    } catch (err) {
      setError("Failed to load orders. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedOrders = async () => {
    setLoading(true);
    try {
      const response = await getDeletedOrders();
      setDeletedOrders(response.data);
      // setFilteredOrders(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.length,
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
    fetchDeletedOrders();
    setActiveTab("completed");
  }, []);

  useEffect(() => {
    // Ensure filtering happens when orders are fetched or updated
    const filtered = orders.filter((order) => order.status === activeTab);
    setFilteredOrders(filtered);
  }, [activeTab, orders]);

  const handleTableChange = (pagination, filters) => {
    setPagination({ ...pagination });

    if (filters.status && filters.status.length > 0) {
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
    const filtered =
      value === "all"
        ? orders
        : orders.filter((order) => order.userDetails?.country === value);

    setFilteredOrders(filtered);
    setPagination((prev) => ({
      ...prev,
      total: filtered.length,
    }));
  };

  const handleUpdateOrder = async (order) => {
    await updateOrderStatus(order._id, order.status);
    await fetchOrders();
    notification.success({
      message: "Order Updated",
      description: "The order status has been updated successfully.",
    });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "order_id",
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
            #{_id.toString().slice(-6)}
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
        const formattedTotal =
          country === "GH" ? `₵${total.toFixed(2)}` : `$${total.toFixed(2)}`;

        return formattedTotal;
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (_, record) => {
        const location = record.userDetails?.location || "N/A";

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* {location} */}
            {record.userDetails?.country === "GH" ? (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(location);
                  notification.success({ message: "Copied to Clipboard" });
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
            ) : (
              "N/A"
            )}
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
      render: (_, record) =>
        record.userDetails?.country === "GH" ? "Ghana" : "USA",
    },

    ...(activeTab !== "trash"
      ? [
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
              <StatusDropdown
                activeTab={activeTab}
                initialStatus={record.status}
                key={record._id}
                orderId={record._id}
                onStatusChange={async (newStatus) => {
                  const updatedOrders = orders.map((order) => {
                    order._id === record._id
                      ? { ...order, status: newStatus }
                      : order;
                  });
                  await handleUpdateOrder(record);

                  setOrders(updatedOrders);
                  setFilteredOrders(updatedOrders);
                }}
              />
            ),
            filters: [
              { text: "All", value: "all" },
              { text: "Completed", value: "completed" },
              { text: "Awaiting Payment", value: "awaiting_payment" },
              { text: "Delivered", value: "delivered" },
            ],
            onFilter: (value, record) =>
              value === "all" ? true : record.status === value,
          },

          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
              <span className="flex gap-3 items-center">
                {record.status === "completed" &&
                  record.userDetails?.country !== "GH" && (
                    <PrinterOutlined
                      className="text-green-600 cursor-pointer"
                      onClick={async () => await genarateLabels(record)}
                    />
                  )}
                <DeleteOutlined
                  className="text-red-800 cursor-pointer"
                  onClick={() => handleDelete(record)}
                />
              </span>
            ),
          },
        ]
      : []),
  ];

  const handleDelete = async (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder(order._id);
          await fetchOrders();
          Swal.fire("Deleted!", "Your order has been deleted.", "success");
        } catch (error) {
          console.log(error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };
  const handleEmptyTrash = async () => {
    Swal.fire({
      title: "Are you sure you want to empty trash?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await massDelete();
          await fetchDeletedOrders();
          Swal.fire(
            "Deleted!",
            "Your order trash has been emptied.",
            "success"
          );
        } catch (error) {
          console.log(error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

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
      <Tabs defaultActiveKey="completed" onChange={handleTabChange}>
        <TabPane tab="Completed" key="completed" />
        <TabPane tab="Awaiting Payment" key="awaiting_payment" />
        <TabPane tab="Delivered" key="delivered" />
        <TabPane tab="Trash" key="trash" />
      </Tabs>
      {activeTab === "trash" && (
        <div className="flex justify-end">
          <Button
            className="bg-red-800 text-white flex items-center gap-2 mb-3"
            type="primary"
            onClick={handleEmptyTrash}
          >
            Empty Trash <DeleteOutlined />
          </Button>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={activeTab === "trash" ? deletedOrders : filteredOrders}
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        bordered
        loading={loading}
        scroll={{ x: "100%" }}
      />
      {showOrderDetailModal && selectedOrder && (
        <Modal
          title="Order Details"
          open={showOrderDetailModal}
          onCancel={handleModalClose}
          footer={null}
        >
          <GenerateOrderModal order={selectedOrder} />
        </Modal>
      )}
    </div>
  );
};

export default Orders;
