import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
  Upload,
} from "antd";
import { CheckCircle, Hourglass } from "lucide-react"; // Specific icons from Lucide React
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

const Dashboard = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const formRef = useRef();
  const [imagePreview, setImagePreview] = useState(null);

  const handleBeforeUpload = (file) => {
    const url = URL.createObjectURL(file);
    setImagePreview(url); // Generate preview URL
    return false; // Prevent auto-upload
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const data = await getAllProducts();
        console.log(data);
        setProductData(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Failed to fetch products:", error);
        message.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (selected) {
      formRef.current.setFieldsValue(selected);
    }
  }, [selected]);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const data = await getAllOrders();
        console.log(data);
        setOrders(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Failed to fetch products:", error);
        message.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  // Upload Image Function
  const onFinish = async (values) => {
    setLoading(true); // Set loading to true when form submission starts
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("dollarPrice", values.dollarPrice);
    formData.append("cediPrice", values.cediPrice);
    formData.append("dollarDiscount", values.dollarDiscount);

    formData.append("length", values.length);
    formData.append("width", values.width);
    formData.append("height", values.height);
    formData.append("weight", values.weight);
    formData.append("country", values.country);
    formData.append("cediDiscount", values.cediDiscount);

    // Check if the file is appended properly
    const assetImageFile = values.assetImage?.file?.originFileObj;
    if (assetImageFile) {
      formData.append("assetImage", assetImageFile);
    } else {
      console.error("No asset image file available");
    }

    // Log FormData content for debugging
    formData.forEach((value, key) => {
      console.log(key, value); // This will show each item in the FormData
    });

    try {
      if (selected) {
        await updateProductById(selected._id, formData);
        await getData();
      } else {
        await createProduct(formData);
        await getData();
        message.success("Product created successfully!");
      }

      form.resetFields();
      setDrawerVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

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
    setDrawerVisible(true);
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

  const processingOrders = orders.filter(
    (record) => record.status === "processing"
  );
  const completedOrders = orders.filter(
    (record) => record.status === "completed"
  );
  return (
    <div className="p-6 flex flex-col gap-3">
      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card
            className="shadow-md"
            style={{ borderLeft: "5px solid #1890ff" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-semibold">Processing Orders</h2>
                <p className="text-gray-500 text-3xl">
                  {processingOrders?.length}
                </p>
              </div>
              <Hourglass className="text-blue-500 w-8 h-8" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            className="shadow-md"
            style={{ borderLeft: "5px solid #52c41a" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-md font-semibold">Completed Orders</h2>
                <p className="text-gray-500 text-3xl">
                  {completedOrders?.length}
                </p>
              </div>
              <CheckCircle className="text-green-500 w-8 h-8" />
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
          form.resetFields();
        }}
        open={drawerVisible}
        width={window.innerWidth < 768 ? "100%" : 400}
      >
        <Form ref={formRef} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="title"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            label="Dollar Price"
            name="dollarPrice"
            rules={[{ required: true, message: "Please enter dollar price" }]}
          >
            <Input type="number" placeholder="Enter dollar price" />
          </Form.Item>
          <Form.Item
            label="Cedi Price"
            name="cediPrice"
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <Input type="number" placeholder="Enter product price" />
          </Form.Item>
          <Form.Item
            label="Dollar Discount Price"
            name="dollarDiscount"
            rules={[
              { required: true, message: "Please enter dollar discount" },
            ]}
          >
            <Input type="number" placeholder="Enter product dollar discount" />
          </Form.Item>
          <Form.Item
            label="Cedi Discount Price"
            name="cediDiscount"
            rules={[{ required: true, message: "Please enter cedi discount" }]}
          >
            <Input type="number" placeholder="Enter product cedi discount" />
          </Form.Item>
          <Form.Item
            label="Length"
            name="length"
            rules={[
              { required: true, message: "Please enter product lenghth" },
            ]}
          >
            <Input type="number" placeholder="Enter product length" />
          </Form.Item>
          <Form.Item
            label="Width"
            name="width"
            rules={[{ required: true, message: "Please enter product width" }]}
          >
            <Input type="number" placeholder="Enter product width" />
          </Form.Item>
          <Form.Item
            label="Height"
            name="height"
            rules={[{ required: true, message: "Please enter product height" }]}
          >
            <Input type="number" placeholder="Enter product height" />
          </Form.Item>
          <Form.Item
            label="Weight"
            name="weight"
            rules={[{ required: true, message: "Please enter product weight" }]}
          >
            <Input type="number" placeholder="Enter product weight" />
          </Form.Item>
          <Form.Item label="Country" name="country">
            <Select>
              <Select.Option value="USA">USA</Select.Option>
              <Select.Option value="Ghana">Ghana</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="assetImage"
            label="Asset Image"
            rules={[
              { required: true, message: "Please upload an asset image" },
            ]}
          >
            <Upload
              name="file"
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage =
                  file.type === "image/png" || file.type === "image/jpeg";
                if (!isImage) {
                  message.error("You can only upload PNG or JPEG images!");
                  return false; // stop the upload
                }
                handleBeforeUpload(file);
                const isSmallEnough = file.size / 1024 / 1024 < 2; // 2MB
                if (!isSmallEnough) {
                  message.error("Image must be smaller than 2MB!");
                  return false; // stop the upload
                }
                return true;
              }}
              onChange={({ fileList }) => {
                form.setFieldsValue({ assetImage: fileList[0] });
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Asset Image</Button>
            </Upload>
            {imagePreview && (
              <div style={{ marginTop: 16 }}>
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </div>
            )}
          </Form.Item>

          {/* Submit Button with Loading Indicator */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading} // Show the loading spinner when form is submitting
          >
            {loading ? "Submitting..." : "Submit"} {/* Dynamic button text */}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default Dashboard;
