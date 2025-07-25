import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Drawer, message, Row, Table } from "antd";
import { DollarSign, Wallet } from "lucide-react"; // Specific icons from Lucide React
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { getAllOrders } from "../../services/order-service";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  updateProductById,
} from "../../services/product-service";
import { formatCurrency } from "../../utils/currency-formatter";
import ProductForm from "./productForm";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const form = useForm();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Orders summary
  const ghanaOrders = orders
    ?.filter((order) => order.userDetails.country === "GH")
    .filter((order) => order.status === "completed").length;
  const usdOrders = orders
    .filter((order) => order.userDetails.country === "US")
    .filter((order) => order.status === "completed").length;

  // Handle new orders and delivered orders
  const newOrders = orders?.filter(
    (order) => order.status === "completed"
  ).length;
  const deliveredOrders = orders?.filter(
    (order) => order.status === "delivered"
  ).length;

  const handleBeforeUpload = (file) => {
    const url = URL.createObjectURL(file);
    setImagePreview(url); // Generate preview URL
    return false; // Prevent auto-upload
  };

  // Handle Push Notificatioms

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const data = await getAllProducts();
        console.log(data);
        setProductData(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (selected) {
      console.log("Selected Item", selected);
      const {
        title,
        dollarPrice,
        cediPrice,
        dollarDiscount,
        cediDiscount,
        length,
        width,
        height,
        weight,
        country,
        image,
      } = selected;
      form.reset({
        title,
        dollarPrice,
        cediPrice,
        dollarDiscount,
        cediDiscount,
        length,
        width,
        height,
        weight,
        country,
        assetImage: image, // or selected.assetImage if that's the correct field
      });
      setImagePreview(image || null);
    } else {
      form.reset();
      setImagePreview(null);
    }
  }, [selected, form]);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const data = await getAllOrders();
        console.log(data);
        setOrders(data.data); // Update the state with the fetched data
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  // Upload Image Function
  // const onFinish = async (values) => {
  //   console.log(values)
  //   setLoading(true);
  //   const formData = new FormData();

  //   formData.append("title", values.title);
  //   formData.append("dollarPrice", values.dollarPrice);
  //   formData.append("cediPrice", values.cediPrice);
  //   formData.append("dollarDiscount", values.dollarDiscount);
  //   formData.append("cediDiscount", values.cediDiscount);
  //   formData.append("length", values.length);
  //   formData.append("width", values.width);
  //   formData.append("height", values.height);
  //   formData.append("weight", values.weight);
  //   formData.append("country", values.country);
  //   formData.append("assetImage", values.image)

  //   try {
  //     if (selected) {
  //       await updateProductById(selected._id, formData);
  //       message.success("Product updated successfully!");
  //     } else {
  //       await createProduct(formData);
  //       message.success("Product created successfully!");
  //     }

  //     await getData();
  //     form.resetFields();
  //     setImagePreview(null);
  //     handleDrawerClose();
  //   } catch (err) {
  //     message.error("Error saving product.");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProducts();
        setProductData(res);
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch products");
      }
    };
    fetchData();
  }, []);

  const getData = async () => {
    try {
      const res = await getAllProducts();
      setProductData(res);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch orders");
    }
  };

  const handleEdit = (record) => {
    setSelected(record);
    setImagePreview(record.image);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelected(null);
    setImagePreview(null); // Clear image preview
  };

  const handleDelete = (record) => {
    // Display confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the product "${record.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteProduct(record._id);
        await getData();
        // Assume deleteProduct is your function to delete the product
        Swal.fire("Deleted!", "The product has been deleted.", "success"); // Success alert
      }
    });
  };

  // Your deleteProduct function example
  const deleteProduct = async (id) => {
    try {
      // Call your API to delete the product using the ID
      await deleteProductById(id);

      // Update UI or state to reflect deletion
      message.success("Product deleted successfully!");
      // Optionally fetch the updated list of products
    } catch (error) {
      message.error("An error occurred while deleting the product.");
      console.error("Error:", error);
    }
  };

  const productColumns = [
    {
      title: "Image",
      dataIndex: "imageIndex",
      key: "image",
      render: (text, record) => (
        <img
          src={record.image || "/path/to/default-image.jpg"}
          alt={record.name}
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    { title: "Name", dataIndex: "title", key: "title" },
    {
      title: "Dollar Price",
      dataIndex: "dollarPrice",
      key: "dollarPrice",
      render: (value) => formatCurrency(value, "USD", "en-US"),
    },

    {
      title: "Cedi Price",
      dataIndex: "cediPrice",
      key: "cediPrice",
      render: (value) => formatCurrency(value, "GHS", "en-GH"),
    },

    { title: "Length", dataIndex: "length", key: "length" },
    { title: "Width", dataIndex: "width", key: "width" },
    { title: "Height", dataIndex: "height", key: "height" },
    { title: "Weight", dataIndex: "weight", key: "weight" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span className="flex gap-5">
          <EditOutlined
            className="text-blue-500"
            type="link"
            onClick={() => handleEdit(record)}
          />

          <DeleteOutlined
            className="text-red-800"
            type="link"
            danger
            onClick={() => handleDelete(record)}
          />
        </span>
      ),
    },
  ];

  // const processingOrders = orders.filter(
  //   (record) => record.status === "processing"
  // );
  // const completedOrders = orders.filter(
  //   (record) => record.status === "completed"
  // );
  return (
    <div className="p-6 flex flex-col gap-3">
      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            className="shadow-md"
            style={{ borderLeft: "5px solid #1890ff" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-semibold">USA Orders</h2>
                <p className="text-gray-500 text-3xl">{usdOrders}</p>
              </div>
              <DollarSign className="text-[#1890ff]" />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            className="shadow-md"
            style={{ borderLeft: "5px solid #52c41a" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-semibold">Ghana Orders</h2>
                <p className="text-gray-500 text-3xl">{ghanaOrders}</p>
              </div>
              <span className="text-green-500 text-3xl">₵</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={8}>
          <Card
            className="shadow-md"
            style={{ borderLeft: "5px solid #ff0000" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-semibold">Total Orders</h2>
                <p className="text-gray-500 text-3xl">
                  {ghanaOrders + usdOrders}
                </p>
              </div>
              <Wallet className="text-[#ff0000]" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* New Oders sections */}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card className="shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-semibold">New Orders</h2>
                <p className="text-gray-500 text-3xl">{newOrders}</p>
              </div>
              <ShoppingCartOutlined
                style={{ fontSize: "32px", color: "#1890ff" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-semibold">Delivered Orders</h2>
                <p className="text-gray-500 text-3xl">{deliveredOrders}</p>
              </div>
              <CheckCircleOutlined
                style={{ fontSize: "32px", color: "#52c41a" }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Drawer Button */}
      <div className="flex justify-end">
        <Button
          type="primary"
          className="mb-4 w-36"
          onClick={() => setDrawerVisible(true)}
        >
          Add Product
        </Button>
      </div>

      {/* Product Table */}
      <div style={{ overflowX: "auto" }}>
        <Table
          loading={loading}
          dataSource={productData}
          columns={productColumns}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Drawer */}
      <Drawer
        title={selected ? "Edit Product" : "Add New Product"}
        placement="right"
        onClose={() => {
          setDrawerVisible(false);
          form.reset();
        }}
        open={drawerVisible}
        width={window.innerWidth < 768 ? "100%" : 600}
      >
        <ProductForm
          selected={selected}
          loading={loading}
          onSubmit={async (values) => {
            setLoading(true);
            const formData = new FormData();

            for (const key in values) {
              formData.append(key, values[key]);
            }

            try {
              if (selected) {
                await updateProductById(selected._id, formData);
                message.success("Product updated successfully!");
              } else {
                await createProduct(formData);
                message.success("Product created successfully!");
              }
              await getData();
              handleDrawerClose();
            } catch (err) {
              message.error("Error saving product.");
            } finally {
              setLoading(false);
            }
          }}
        />
      </Drawer>
    </div>
  );
};

export default Dashboard;
