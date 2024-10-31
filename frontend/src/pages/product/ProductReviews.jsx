/* eslint-disable react/prop-types */
import { useState } from "react";
import Ratings from "./Ratings";
import NoReview from "../../assets/frontend_assets/7d900d4dc402db5304b2.png";
import Paganation from "../../components/Paganation";

const ProductReviews = ({ product }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const totalPages = Math.ceil(product?.reviews?.length / reviewsPerPage) || 0;

  const currentReviews =
    product?.reviews?.slice(
      (currentPage - 1) * reviewsPerPage,
      currentPage * reviewsPerPage
    ) || [];

  return (
    <section className="w-full p-10 mb-20 border shadow-sm">
      <h1 className="mb-10 text-2xl font-semibold text-center text-gray-800 md:text-start">
        ĐÁNH GIÁ SẢN PHẨM
      </h1>
      {product?.reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full gap-5">
          <img src={NoReview} className="w-40" />
          <p className="text-lg">Chưa có đánh giá</p>
        </div>
      )}

      <div className="w-full">
        {currentReviews.map((review) => (
          <div
            key={review._id}
            className=" p-4 xl:ml-[2rem] sm:ml-[0rem]  mb-5  w-full border-b-2"
          >
            <div className="flex justify-between w-full mb-5">
              <p className="font-medium text-black">{review.name}</p>

              <p className="text-gray-800">
                {review.createdAt.substring(0, 10)}
              </p>
            </div>
            <Ratings value={review.rating} />

            <div className="flex gap-4 mt-3">
              {review.images.map((img, index) => (
                <img
                  src={`${import.meta.env.VITE_API_URL}${img}`}
                  key={index}
                  alt=""
                  className="object-cover w-20"
                />
              ))}
            </div>
            <p className="my-4">{review.comment}</p>
          </div>
        ))}

        {currentReviews.length > 0 && (
          <Paganation
            totalPages={totalPages}
            page={currentPage}
            setPage={setCurrentPage}
          />
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
