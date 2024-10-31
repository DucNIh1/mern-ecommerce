import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import cartNoItem from "../../assets/frontend_assets/cartNoItem.jpg";

import { FaRegTrashCan } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CiSquareMinus, CiSquarePlus } from "react-icons/ci";

import {
  useDecreCartItemMutation,
  useDeleteFromCartMutation,
  useGetCartQuery,
  useIncreCartItemMutation,
} from "../../redux/api/cartApiSlice";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";

const Cart = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  //API
  const [increCartItem] = useIncreCartItemMutation();
  const [decreCartItem] = useDecreCartItemMutation();
  const [deleteFromCart] = useDeleteFromCartMutation();
  const { data: cartData, refetch } = useGetCartQuery(user ?? skipToken);

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages =
    Math.ceil(cartData?.cart?.items?.length / itemsPerPage) || 1;

  const currentItems = cartData?.cart?.items?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle cart item
  async function handleIncre(productId, data) {
    try {
      await increCartItem({ productId, data }).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDecre(productId, data) {
    try {
      await decreCartItem({ productId, data }).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(productId, data) {
    try {
      const res = await deleteFromCart({ productId, data }).unwrap();
      toast.success(res?.message || "Xóa thành công");
      console.log(res);
      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="my-20 bg-white ">
        <h1 className="pb-2 mb-6 text-3xl font-semibold uppercase text-amber-800">
          {cartData?.cart?.items?.length > 0 ? "Giỏ hàng" : ""}
        </h1>

        <div className="">
          {currentItems ? (
            <div>
              <div className="flex flex-col w-full gap-10 md:flex-row">
                <div className="flex flex-col gap-5 mb-10 md:w-2/3 md:order-first">
                  {currentItems.map((item, index) => (
                    <div className="flex gap-4 md:w-full " key={index}>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          item?.product?.images[0]
                        }`}
                        alt={item?.product?.name}
                        className="object-cover w-24 mr-4 rounded-lg md:w-32 lg:w-36"
                      />
                      <div className="flex flex-col flex-1 gap-5 md:flex-row">
                        <div className="flex flex-col flex-1 gap-4 ">
                          <div className="font-medium">
                            {item?.product?.name}
                          </div>
                          <div className="">
                            <span className="text-gray-500">Size: </span>
                            <span className="font-medium text-red-700 uppercase">
                              {" "}
                              {item?.size}
                            </span>
                          </div>

                          <div className="">
                            Tổng giá:{" "}
                            <span className="font-medium text-red-700">
                              {new Intl.NumberFormat("vi-VN", {
                                minimumFractionDigits: 0,
                              })
                                .format(item.price * item.quantity)
                                .replace(".", ",")}{" "}
                              VND
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="">
                            <div className="flex items-center gap-2">
                              <CiSquareMinus
                                className="text-gray-600 cursor-pointer size-8 hover:text-red-500 "
                                onClick={() =>
                                  handleDecre(item?.product?._id, {
                                    size: item?.size,
                                  })
                                }
                              />
                              <div>{item?.quantity}</div>

                              <CiSquarePlus
                                className="text-gray-600 cursor-pointer size-8 hover:text-red-500 "
                                onClick={() =>
                                  handleIncre(item?.product?._id, {
                                    size: item?.size,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="">
                            <button
                              onClick={() =>
                                handleDelete(item?.product?._id, {
                                  size: item?.size,
                                })
                              }
                              className="p-2 duration-100 ease-linear bg-white border rounded-lg hover:bg-red-400 hover:text-white"
                            >
                              <FaRegTrashCan />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Details */}
                <div className="flex-1 order-first w-full p-4 md:order-2">
                  <div className="p-6 bg-white rounded shadow">
                    <h2 className="mb-4 text-xl font-semibold">
                      Thông tin chi tiết
                    </h2>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-semibold text-gray-600">
                        Số lượng sản phẩm
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {cartData?.totalItems}
                      </span>
                    </div>

                    <div className="flex justify-between mb-4 text-lg font-semibold">
                      <span className="text-lg text-gray-600 ">Tổng tiền</span>
                      <span className="text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          minimumFractionDigits: 0,
                        })
                          .format(cartData?.cart?.totalPrice)
                          .replace(".", ",")}{" "}
                        VND
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/checkout")}
                      className="w-full text-white bg-red-900 hover:bg-red-950 focus:ring-4 focus:outline-none focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center "
                    >
                      Thanh toán
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Paganation */}
              <div className="flex items-center justify-center px-4 py-3 bg-white ">
                <div>
                  <nav
                    aria-label="Pagination"
                    className="inline-flex gap-5 rounded-md shadow-sm isolate"
                  >
                    {/* Previous button */}
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 text-gray-400 cursor-pointer rounded-l-md hover:text-red-700 hover:bg-red-300 focus:z-20 "
                    >
                      <FaChevronLeft aria-hidden="true" className="w-5 h-5" />
                    </button>

                    {/* Page numbers */}
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-[16px] font-semibold rounded-xl ${
                          page === index + 1
                            ? "text-red-700 bg-red-300"
                            : "text-gray-900  hover:text-red-700 hover:bg-red-300"
                        } focus:z-20 `}
                      >
                        {index + 1}
                      </button>
                    ))}

                    {/* Next button */}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 text-gray-400 cursor-pointer rounded-r-md hover:text-red-700 hover:bg-red-300 focus:z-20 "
                    >
                      <span className="sr-only">Next</span>
                      <FaChevronRight aria-hidden="true" className="w-5 h-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-10 mb-40 text-xl text-center ">
              <img src={cartNoItem} alt="" className="w-[40%] mx-auto mb-10" />
              <Link
                to="/collections"
                className="px-8 py-2 text-white bg-red-700 rounded-3xl hover:bg-opacity-65"
              >
                Tiếp tục mua hàng
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
