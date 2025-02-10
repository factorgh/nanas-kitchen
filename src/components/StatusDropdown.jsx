/* eslint-disable react/prop-types */
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message, Tag } from "antd";
import { useState } from "react";
import { updateOrderStatus } from "../services/order-service";

const StatusDropdown = ({ initialStatus, orderId, activeTab }) => {
  const [status, setStatus] = useState(initialStatus);

  // Define color mapping for each status
  const statusColors = {
    delivered: "blue",
    completed: "green",
    cancelled: "error",
    processing: "gold",
    awaiting_payment: "orange",
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await updateOrderStatus(orderId, newStatus);
    message.success("Order Status updated successfully");
  };

  const handleDrop = (e) => {
    e.preventDefault();
  };

  // Define menu options based on activeTab
  let menuItems = [];
  if (activeTab === "awaiting_payment") {
    menuItems.push(
      <Menu.Item
        key="completed"
        onClick={() => handleStatusChange("completed")}
      >
        Completed
      </Menu.Item>
    );
  } else if (activeTab === "completed") {
    menuItems.push(
      <Menu.Item
        key="delivered"
        onClick={() => handleStatusChange("delivered")}
      >
        Delivered
      </Menu.Item>
    );
  }

  // If it's "delivered", menuItems remains empty (no dropdown)
  const menu = menuItems.length > 0 ? <Menu>{menuItems}</Menu> : null;

  return (
    <Dropdown overlay={menu} trigger={["click"]} disabled={!menu}>
      <a className="ant-dropdown-link" onClick={(e) => handleDrop(e)}>
        <Tag color={statusColors[status] || "default"}>
          {status.charAt(0).toUpperCase() + status.slice(1)} <DownOutlined />
        </Tag>
      </a>
    </Dropdown>
  );
};

export default StatusDropdown;
