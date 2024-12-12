import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="text-center">
          <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your payment was processed
            successfully.Visit your email for a copy of your receipt
          </p>

          <div className="mt-6 space-y-4">
            <Button className="w-full" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuccessPage;
