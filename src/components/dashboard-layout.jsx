import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { messaging } from "../../firebaseConfig";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Get current route location
  const navigate = useNavigate(); //
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  const handleTrash = () => {
    navigate("/admin/trash");
  };

  useEffect(() => {
    // Request notification permission
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");

          // Get the Firebase Cloud Messaging token
          const token = await messaging.getToken({
            vapidKey:
              "BJZ8NevO2bxF5ZcUh3mu1dYcNSu60QBxaku6eLx3TZxZE14yFw9WoXUbhOLNLe0tGypUW6ynHNRz0UkaUmdIw7c",
          });
          console.log("FCM Token:", token);
          // Save the token to your server or local storage for sending notifications later
        }
      } catch (error) {
        console.error("Error getting notification permission:", error);
      }
    };

    requestNotificationPermission();
  }, []);
  // Determine the selected menu key based on the current pathname
  const menuKeyMap = {
    "/admin/dashboard": "1",
    "/admin/orders": "2",
    "/admin/reviews": "3",
  };

  const selectedKey = menuKeyMap[location.pathname] || "1";
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
          {collapsed ? "Admin" : "Admin"}
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
          <Menu.Item key="3" icon={<MessageSquareText size={20} />}>
            <Link to="/admin/reviews">Reviews</Link>
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
          {/* <div className="flex items-center">
            <button
              onClick={handleTrash}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Trash <DeleteOutlined />
            </button>
          </div> */}
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
