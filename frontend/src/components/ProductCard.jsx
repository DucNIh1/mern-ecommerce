/* eslint-disable react/prop-types */
import { useState } from "react";

import { HiOutlineHeart } from "react-icons/hi2";

import {
  useAddToWishListMutation,
  useGetMyWishListQuery,
} from "../redux/api/userApiSlice";

import { toast } from "react-toastify";

import { Link } from "react-router-dom";

import { useAddToCartMutation } from "../redux/api/cartApiSlice";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";

const ProductCard = ({ product }) => {
  const { user } = useSelector((state) => state.auth);

  const [cardSize, setCardSize] = useState("s");
  const [addToWishList] = useAddToWishListMutation();
  const [addToCart] = useAddToCartMutation();
  const { data: wishlistData } = useGetMyWishListQuery(user ?? skipToken);

  const handleAddToCart = async (data) => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để thực hiện tính năng này!");
      return;
    }
    try {
      await addToCart(data);
      toast.success("Thêm vào giỏ hàng thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToWishList = async (productId) => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để thực hiện tính năng này!");
      return;
    }
    try {
      await addToWishList({ productId, size: cardSize }).unwrap();
      toast.success("Thêm vào danh sách yêu thích thành công!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white">
      <div className="relative transition-all duration-100 ease-linear group">
        <img
          src={`${import.meta.env.VITE_API_URL}${product.images[0]}`}
          alt={product.name}
          className="object-cover w-full h-80"
        />
        <div className="absolute inset-0 hidden p-2 text-lg text-white transition-all duration-100 ease-linear bg-black bg-opacity-25 group-hover:block ">
          <HiOutlineHeart
            className={`absolute cursor-pointer size-6 right-2 top-2 hover:text-red-300 hover:scale-110 ${
              wishlistData?.wishlist.find(
                (item) => item.product?._id === product?._id
              )
                ? "text-red-300"
                : ""
            }`}
            onClick={() => handleAddToWishList(product?._id)}
          />
          <ul className="absolute flex gap-4 transition-all duration-100 ease-linear -translate-x-1/2 left-1/2 bottom-20">
            {product.sizes.map((size, index) => (
              <button
                key={index}
                className={` bg-black py-1 bg-opacity-80  min-w-10 uppercase ${
                  cardSize == size.size ? "bg-amber-950" : ""
                } 
                }`}
                onClick={() => setCardSize(size.size)}
              >
                {size.size}
              </button>
            ))}
          </ul>
          <button
            onClick={() =>
              handleAddToCart({
                productId: product?._id,
                size: cardSize,
                price: product?.price,
              })
            }
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black px-2 py-2 w-[80%] bg-opacity-60 hover:bg-black"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 mt-4">
        <Link
          to={`/product/${product?._id}`}
          className="text-[16px] font-semibold text-gray-600 uppercase hover:text-amber-900"
        >
          {product.name}
        </Link>
        <p className="flex items-end flex-1 text-gray-500">
          {new Intl.NumberFormat("vi-VN")
            .format(product.price)
            .replace(".", ",")}{" "}
          VND
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
