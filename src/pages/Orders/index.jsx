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
    pageSize: 15,
    total: 0,
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      console.log(response);

      setOrders(response?.map((order) => ({ ...order, key: order._id })));
      setPagination((prev) => ({
        ...prev,
        total: response?.length,
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

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const paginatedData = orders.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

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
        dataSource={paginatedData}
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
