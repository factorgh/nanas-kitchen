import { Button, Divider, Input, message, Rate, Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewSlider from "../../components/ReviewsSlider";
import { CountryContext } from "../../context/country-context";
import { getProductById } from "../../services/product-service";
import { addReview, getProductReviews } from "../../services/review-services";
import { formatCurrency } from "../../utils/currency-formatter";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const { userCountry } = useContext(CountryContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [avgReview, setAvgReview] = useState(0);

  const navigate = useNavigate();
  const params = useParams();
  const productId = params.id;

  useEffect(() => {
    async function fetchData() {
      try {
        const productData = await getProductById(productId);
        setSelectedImage(
          productData.image || "https://via.placeholder.com/300"
        );
        setSelectedProduct(productData);
        setReviews(productData.reviews || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  useEffect(() => {
    async function getProductReviewsByProductId() {
      const productReviews = await getProductReviews(productId);
      setReviews(productReviews);
      const TotalReviewRating = productReviews?.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      console.log(TotalReviewRating);
      const AvgReview =
        reviews.length > 0 ? TotalReviewRating / reviews.length : 0;
      setAvgReview(AvgReview);
    }
    getProductReviewsByProductId();
  }, [productId, reviews.length]);

  const handleReviewSubmit = async () => {
    if (!reviewerName.trim() || !reviewComment.trim()) {
      return message.error("Please enter your name and comment.");
    }
    setSubmittingReview(true);

    const newReview = {
      name: reviewerName,
      comment: reviewComment,
      rating: reviewRating,
      productId,
    };

    try {
      await addReview(newReview);
      await getProductReviews(productId);

      message.success("Review added successfully!");
    } catch (error) {
      console.error(error);
      message.error("Error adding review");
    }
    setSubmittingReview(false);
    setReviewerName("");
    setReviewComment("");
    setReviewRating(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1
        className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2 cursor-pointer hover:text-red-500"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="text-sm text-red-500" />
        <span>Back</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={selectedImage}
            alt="Product"
            className="w-full max-w-md h-auto rounded-lg border shadow-lg transition-transform hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {selectedProduct?.title || "Product Name"}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Premium Ghanaian Shitor - Authentic Taste, Unmatched Experience
          </p>

          {/* Price and Ratings */}
          <div className="flex items-center space-x-4 mt-3">
            <p className="text-2xl font-semibold text-blue-600">
              {formatCurrency(
                userCountry === "GHANA"
                  ? selectedProduct?.cediDiscount
                  : selectedProduct?.dollarDiscount,
                userCountry === "GHANA" ? "GHS" : "USD",
                userCountry === "GHANA" ? "en-GH" : "en-US"
              )}
            </p>
            <Rate
              allowHalf
              defaultValue={avgReview}
              disabled
              className="text-yellow-500"
            />
            <span className="text-sm text-gray-600">
              ({reviews.length} reviews)
            </span>
          </div>

          <Divider />

          {/* Product Details */}
          <h3 className="text-xl font-bold text-gray-800 mt-6">
            Product Details
          </h3>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>High-quality ingredients</li>
            <li>Authentic Ghanaian taste</li>
            <li>Perfect for rice, kenkey, and more</li>
          </ul>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>

        {/* Review Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-bold text-gray-800">Leave a Review</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              placeholder="Your Name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="p-3 border-gray-300 rounded-md"
            />
            <Rate
              allowHalf
              value={reviewRating}
              onChange={setReviewRating}
              className="text-yellow-500"
            />
          </div>
          <Input.TextArea
            placeholder="Write your review..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={4}
            className="mt-4 p-3 border-gray-300 rounded-md"
          />
          <Button
            type="primary"
            className="mt-4 w-full py-2 text-lg"
            onClick={handleReviewSubmit}
          >
            {submittingReview ? "Submitting ..." : "Submit Review"}
          </Button>
        </div>

        {/* Review List */}
        <div className="mt-10">
          <ReviewSlider reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
