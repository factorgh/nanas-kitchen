/* eslint-disable react/prop-types */
import { Avatar, Card, Rate } from "antd";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function ReviewSlider({ reviews }) {
  return (
    <div className="max-w-5xl mx-auto">
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet.</p>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2} // Show 2 reviews at a time
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 }, // Show 1 review on small screens
            1024: { slidesPerView: 2 }, // Show 2 reviews on large screens
          }}
          className="w-full"
        >
          {reviews.map((item, index) => (
            <SwiperSlide key={index} className="p-2 ">
              <Card
                className="shadow-lg rounded-lg border border-gray-200 p-5 transition-transform hover:scale-105"
                hoverable
              >
                <div className="flex items-start gap-4">
                  <Avatar src="https://via.placeholder.com/300" size={60} />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg text-gray-900">
                        {item.name}
                      </span>
                      <Rate
                        disabled
                        defaultValue={item.rating}
                        className="text-yellow-500"
                      />
                    </div>
                    <p className="text-gray-700 mt-2">{item.comment}</p>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
