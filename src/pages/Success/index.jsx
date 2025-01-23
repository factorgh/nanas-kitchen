import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Rate } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const SuccessPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    console.log(values);
    setSubmitting(true);
    try {
      // Simulate sending feedback to the backend

      message.success("Thank you for your feedback!");
      navigate("/");

      form.resetFields();
    } catch (error) {
      console.log(error);
      message.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg mx-5">
        <div className="text-center">
          <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your payment was processed
            successfully. Visit your email for a copy of your receipt.
          </p>

          <div className="mt-6 space-y-4">
            <Button className="w-full" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>

          {/* Feedback Form */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Rate Your Experience
            </h2>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="rating"
                label="How was your experience?"
                rules={[
                  { required: true, message: "Please rate your experience!" },
                ]}
              >
                <Rate />
              </Form.Item>
              <Form.Item name="feedback" label="Additional Comments">
                <TextArea
                  rows={3}
                  placeholder="Tell us more about your experience..."
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  block
                >
                  Submit Feedback
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuccessPage;
