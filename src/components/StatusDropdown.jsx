/* eslint-disable react/prop-types */
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message, Tag } from "antd";
import { useState } from "react";
import { updateOrderStatus } from "../services/order-service";

const StatusDropdown = ({ initialStatus, orderId }) => {
  const [status, setStatus] = useState(initialStatus);

  // Define color mapping for each status
  const statusColors = {
    delivered: "blue",
    completed: "green",

    cancelled: "error",
    processing: "gold",
    // Add more status-color mappings as needed
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await updateOrderStatus(orderId, newStatus);
    message.success("Order Status updated successfully");
  };

  const handleDrop = (e) => {
    e.preventDefault();
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="delivered"
        onClick={() => handleStatusChange("delivered")}
      >
        Delivered
      </Menu.Item>
      <Menu.Item
        key="completed"
        onClick={() => handleStatusChange("completed")}
      >
        Completed
      </Menu.Item>

      <Menu.Item
        key="processing"
        onClick={() => handleStatusChange("awaitng_payment")}
      >
        Awaitng Payment
      </Menu.Item>
      {/* Add more status options here */}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <a className="ant-dropdown-link" onClick={(e) => handleDrop(e)}>
        <Tag color={statusColors[status] || "default"}>
          {status.charAt(0).toUpperCase() + status.slice(1)} <DownOutlined />
        </Tag>
      </a>
    </Dropdown>
  );
};

export default StatusDropdown;
