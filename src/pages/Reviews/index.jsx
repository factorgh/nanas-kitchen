import { Card, message, Rate, Spin } from "antd";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";
import {
  getAllReviews,
  updateProductReviewById,
} from "../../services/review-services";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProductReviews() {
      setLoading(true);
      const productReviews = await getAllReviews();
      setReviews(productReviews);
      setLoading(false);
    }
    getProductReviews();
  }, []);

  // Fetch reviews (Mocked API Call)

  // Handle Edit Click (Open Modal)
  // const handleEditClick = (review) => {
  //   setSelectedReview(review);
  //   setReviewId(review._id);
  //   setStatus(review.status);
  //   setModalVisible(true);
  // };

  const handleUpdateStatus = async (reviewId, status) => {
    // Send request to api
    await updateProductReviewById(reviewId, status);

    setReviews((prevReviews) =>
      prevReviews.map((r) => (r._id === reviewId ? { ...r, status } : r))
    );

    message.success("Review status updated successfully");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {reviews.map((review) => (
          <Card key={review._id} className="shadow-md rounded-lg">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {review.name}
                </h3>
                <Rate
                  disabled
                  value={review.rating}
                  className="text-yellow-500"
                />
                <p className="text-gray-600 mt-2">{review.comment}</p>
                <p
                  className={`mt-2 text-sm font-semibold 
                  ${
                    review.status === "Approved"
                      ? "text-green-600"
                      : review.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {review.status}
                </p>
              </div>

              <div className="cursor-pointer flex justify-start gap-3">
                {" "}
                <span
                  onClick={() => handleUpdateStatus(review._id, "approved")}
                  className="p-2 border rounded-md h-5 flex items-center"
                >
                  {" "}
                  <FaCheck className="text-emerald-500" size={15} />
                </span>
                <span
                  onClick={() => handleUpdateStatus(review._id, "rejected")}
                  className="p-2 border rounded-md h-5 flex items-center"
                >
                  {" "}
                  <MdOutlineClose
                    className="text-red-500 font-bold"
                    size={15}
                  />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Review Status Modal */}
      {/* <Modal
        title="Edit Review Status"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdateStatus}
      >
        <Select
          value={status}
          onChange={setStatus}
          className="w-full"
          options={[
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
      </Modal> */}
    </div>
  );
}
