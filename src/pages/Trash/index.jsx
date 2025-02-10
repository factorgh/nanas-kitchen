import { notification, Table } from "antd";
import { ArrowBigLeft, Copy, MessageSquareTextIcon } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDeletedOrders,
  updateOrderStatus,
} from "../../services/order-service";

const Trash = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getDeletedOrders();

      console.log(response.data);
      setOrders(response.data);
      setFilteredOrders(response.data);
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
  }, []);

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

  const handleUpdateOrder = async (order) => {
    await updateOrderStatus(order._id, order.status);
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
      render: (_id) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            // onClick={() => handleShowOrderDetailModal(record)}
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
        record.userDetails?.country === "GH"
          ? "Ghana"
          : record.userDetails?.country === "USA"
          ? "USA"
          : "Unknown Country",
    },
  ];

  const handleGoBack = () => {
    navigate(-1);
  };
  //   const handleDelete = async (order) => {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to undo this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#d33",
  //       cancelButtonColor: "#3085d6",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then(async (result) => {
  //       if (result.isConfirmed) {
  //         try {
  //           await deleteOrder(order._id); // Call your delete function
  //           Swal.fire("Deleted!", "Your order has been deleted.", "success");
  //         } catch (error) {
  //           console.log(error);
  //           Swal.fire("Error!", "Something went wrong.", "error");
  //         }
  //       }
  //     });
  //   };
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl mb-3">Deleted Orders</h2>
          <a
            onClick={handleGoBack}
            className="text-blue-500 flex items-center gap-1"
          >
            <ArrowBigLeft />
            <span> Go Back</span>
          </a>
        </div>
        <p className="flex items-center gap-2">
          <MessageSquareTextIcon /> This section displays all the orders that
          have been deleted. You can&apos;restore them from the Trash tab.
        </p>
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
    </div>
  );
};

export default Trash;
