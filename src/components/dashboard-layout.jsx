import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Get current route location
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  // Determine the selected menu key based on the current pathname
  const selectedKey = location.pathname.includes("orders") ? "2" : "1";

  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="bg-gray-900"
      >
        <div className="h-16 text-white flex items-center justify-center text-lg font-bold">
          {collapsed ? "Logo" : "Admin"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]} // Dynamically set the selected key
          className="bg-gray-900"
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/orders">Orders</Link>
          </Menu.Item>

          <Menu.Item key="4" icon={<LogoutOutlined />}>
            <Link onClick={handleLogout} to="/">
              Logout
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-white shadow-md px-4 flex justify-between items-center">
          <div className="text-lg font-semibold">
            Welcome to Nana&apos;s Kitchen Dashboard
          </div>
        </Header>

        {/* Content Area */}
        <Content className="bg-gray-100 p-6 overflow-auto">
          {<Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
