import { Avatar, Button, Divider, List, Rate } from "antd";
import { useState } from "react";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    rating: 4,
    comment: "Great product! Quality is amazing, and delivery was fast.",
    avatar: "https://i.pravatar.cc/300?img=1",
    date: "Jan 15, 2025",
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 5,
    comment: "Exceeded my expectations. Highly recommend!",
    avatar: "https://i.pravatar.cc/300?img=2",
    date: "Jan 12, 2025",
  },
  // Add more reviews as needed
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(
    "https://via.placeholder.com/500"
  );

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Section */}
        <div>
          <img
            src={selectedImage}
            alt="Product"
            className="w-full h-auto rounded-lg border"
          />
          <div className="flex space-x-2 mt-4">
            {[
              "https://via.placeholder.com/500",
              "https://via.placeholder.com/500/111",
              "https://via.placeholder.com/500/222",
            ].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`w-16 h-16 rounded-lg cursor-pointer border ${
                  selectedImage === img ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Product Name
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Short product description here. Highlight the unique selling points
            of the product.
          </p>

          {/* Price and Ratings */}
          <div className="flex items-center space-x-4">
            <p className="text-2xl font-semibold text-blue-600">$49.99</p>
            <Rate
              allowHalf
              defaultValue={4.5}
              disabled
              className="text-yellow-500"
            />
            <span className="text-sm text-gray-600">(234 reviews)</span>
          </div>

          {/* Add to Cart */}
          <Button type="primary" size="large" className="mt-6 w-full">
            Add to Cart
          </Button>

          <Divider />

          <h3 className="text-xl font-bold text-gray-800 mt-6">
            Product Details
          </h3>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>High-quality materials</li>
            <li>Available in multiple sizes</li>
            <li>Durable and long-lasting</li>
          </ul>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h2>
        <List
          itemLayout="horizontal"
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <Rate
                      disabled
                      defaultValue={item.rating}
                      className="text-yellow-500"
                    />
                  </div>
                }
                description={
                  <>
                    <p className="text-gray-600">{item.comment}</p>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
