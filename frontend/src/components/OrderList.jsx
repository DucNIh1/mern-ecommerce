/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import moment from "moment";

import { FaChevronDown, FaRegTrashCan } from "react-icons/fa6";

import { toast } from "react-toastify";

import {
  useCancelOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} from "../redux/api/orderApiSlice";
import {
  useCreateReviewMutation,
  useUploadProductImageMutation,
} from "../redux/api/productApiSlice";

import ModalDelete from "./DeleteModal";

import upload from "../assets/frontend_assets/upload.png";

const statusStyles = {
  "Đang xử lí": "text-yellow-600",
  "Đang vận chuyển": "text-blue-600",
  "Đã giao hàng": "text-green-600",
  "Đã hủy đơn": "text-red-600",
};

const listOrderStatus = [
  "Đang xử lí",
  "Đang vận chuyển",
  "Đã giao hàng",
  "Đã hủy đơn",
];

function OrderItem({ order, refetch, mainColor, isAdmin }) {
  const [openDetails, setOpenDetails] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  //API
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleOpenModal = (productId) => {
    setCurrentProductId(productId);
    setOpenReviewModal(!openReviewModal);
  };

  // Handle update order
  const handleCancelOrder = async (orderId) => {
    try {
      const res = await cancelOrder(orderId).unwrap();
      console.log(res);
      refetch();
      toast.success("Hủy đơn hàng thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await deleteOrder(orderId).unwrap();
      toast.success("Xóa đơn hàng thành công!");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setOrderStatus(order.orderStatus);
  }, [order.orderStatus]);

  const handleUpdateOrderStatus = async (orderId, data) => {
    try {
      const res = await updateOrderStatus({ orderId, data }).unwrap();
      console.log(res);
      refetch();
      toast.success("Cập nhật trạng thái đơn hàng thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDetails = (orderId) => {
    if (openDetails === orderId) {
      setOpenDetails("");
    } else {
      setOpenDetails(orderId);
    }
  };

  return (
    <div className="mb-20">
      <div className="flex flex-col justify-between gap-2 mb-5 lg:flex-row">
        <p className="flex items-center gap-4">
          <span onClick={() => toggleDetails(order._id)}>
            <FaChevronDown
              className={`cursor-pointer hover:text-${mainColor}-800 hover:scale-125`}
            />
          </span>
          <span>
            {moment(order?.createdAt).format(
              "HH[:]mm [phút] [-] DD [tháng] MM [năm] YYYY"
            )}
          </span>
        </p>

        {isAdmin ? (
          <div className="flex gap-5 ">
            <select
              className={`p-2 border rounded-lg outline-none cursor-pointer ${statusStyles[orderStatus]}`}
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              {listOrderStatus.map((st, index) => (
                <option
                  key={index}
                  value={st}
                  className="text-black bg-transparent border-none outline-none"
                >
                  {st}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                handleUpdateOrderStatus(order?._id, { orderStatus })
              }
              className={`p-2  rounded-lg outline-none cursor-pointer bg-purple-800 text-white hover:bg-purple-900`}
            >
              Cập nhật
            </button>
          </div>
        ) : (
          <p className={statusStyles[order?.orderStatus]}>
            {order?.orderStatus}
          </p>
        )}
        <p>{order?.isPaid ? "Đã thanh toán" : "Chờ thanh toán"}</p>
        <p className={`text-${mainColor}-800 font-medium`}>
          {" "}
          {new Intl.NumberFormat("vi-VN")
            .format(order?.totalPrice)
            .replace(".", ",")}{" "}
          VND
        </p>

        <ModalDelete
          disabled={order.orderStatus !== "Đang xử lí"}
          onClick={() => handleCancelOrder(order._id)}
          btnText="Hủy đơn hàng"
          modalText="Bạn có chắc chắn muốn hủy đơn hàng này!"
        />
        {isAdmin && (
          <ModalDelete
            disabled={
              order.orderStatus === "Đang xử lí" &&
              order.orderStatus === "Đang vận chuyển"
            }
            onClick={() => handleDeleteOrder(order._id)}
            btnText=<FaRegTrashCan className="mx-auto" />
            modalText="Bạn có chắc chắn muốn xóa đơn hàng này không!"
          />
        )}
      </div>
      <div className="">
        <div className="flex gap-2 mb-2">
          <p className={`text-${mainColor}-800`}>Số điện thoại:</p>
          <p className="text-gray-600">{order?.shippingAddress?.phone}</p>
        </div>
        <div className="flex gap-2 mb-2">
          <p className={`text-${mainColor}-800`}>Người nhận:</p>
          <p className="text-gray-600">{order?.shippingAddress?.username}</p>
        </div>
        <div className="flex mb-10">
          <p className={`mr-5 text-${mainColor}-800`}>Địa chỉ nhận hàng: </p>
          <p className="text-gray-600">
            {order?.shippingAddress?.street} - {order?.shippingAddress?.ward} -{" "}
            {order?.shippingAddress?.district} - {order?.shippingAddress?.city}
          </p>
        </div>
      </div>
      {openDetails === order._id && (
        <div className="flex flex-col mb-10">
          {order?.items.map((item, index) => (
            <div
              className="flex flex-col justify-between gap-5 p-4 border-b border-gray-200 md:items-center lg:flex-row"
              key={index}
            >
              <div className="flex items-start lg:items-center">
                <img
                  src={`http://localhost:8080${item?.product?.images[0]}`}
                  className="object-cover w-20 h-20 mr-4"
                />
                <div className="flex flex-col flex-1 gap-2 md:gap-10 md:flex-row">
                  <p className="block text-gray-600 lg:min-w-[400px] md:max-w-[180px] lg:max-w-max">
                    Tên: {item.product.name}
                  </p>

                  <p className="text-gray-600">
                    Giá:{" "}
                    <span className={`text-${mainColor}-800`}>
                      {" "}
                      {new Intl.NumberFormat("vi-VN", {
                        minimumFractionDigits: 0,
                      })
                        .format(item.price)
                        .replace(".", ",")}{" "}
                      VND
                    </span>
                  </p>
                  <p className="block text-gray-600">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="block text-gray-600">
                    Size: {item.size.toUpperCase()}
                  </p>
                </div>
              </div>
              {!isAdmin && order.orderStatus === "Đã giao hàng" && (
                <>
                  <ReviewProduct
                    isReviewed={
                      item?.product?.reviews?.length > 0 &&
                      item?.product?.reviews.some(
                        (r) =>
                          r.user.toString() === order?.user.toString() &&
                          r.order.toString() === order._id.toString()
                      )
                    }
                    openModal={openReviewModal}
                    setOpenModal={() => handleOpenModal(item.product._id)}
                    productId={currentProductId}
                    orderId={order._id}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const OrderList = ({ orders = [], refetch, isAdmin, mainColor }) => {
  return (
    <div>
      {orders.map((order, index) => (
        <OrderItem
          key={index}
          order={order}
          refetch={refetch}
          isAdmin={isAdmin}
          mainColor={mainColor}
        />
      ))}
    </div>
  );
};

const ReviewProduct = ({
  openModal,
  setOpenModal,
  productId,
  orderId,
  isReviewed,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([null, null, null]);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createReview] = useCreateReviewMutation();

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0]; // Lấy file được chọn
    if (file) {
      const formData = new FormData();
      formData.append("images", file); // Ghi file vào FormData

      try {
        const response = await uploadProductImage(formData).unwrap();
        toast.success("Upload ảnh thành công");
        const newImages = [...images];
        newImages[index] = response.images[0]; // Lưu ảnh đã upload vào vị trí tương ứng
        setImages(newImages);
      } catch (error) {
        console.error("Lỗi upload ảnh", error);
      }
    }
  };

  const submitHandler = async () => {
    const filteredImages = images.filter((image) => image !== null);
    try {
      await createReview({
        productId,
        orderId,
        rating,
        comment,
        images: filteredImages,
      }).unwrap();
      toast.success("Đánh giá thành công");
      setComment("");
      setImages([null, null, null]);
      setRating(0);
      setOpenModal(false);
    } catch (error) {
      toast.error(error?.data.message || "Lỗi khi đánh giá sản phẩm");
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpenModal(true);
        }}
        disabled={isReviewed}
        className="px-4 py-2 text-white bg-red-900 rounded-md hover:bg-red-950 disabled:bg-gray-500"
      >
        {isReviewed ? "Bạn đã đánh giá " : "Đánh giá sản phẩm"}
      </button>
      <div
        className={`${
          openModal ? "block" : "hidden"
        }   fixed inset-0 z-50 justify-center items-center w-full  bg-black bg-opacity-35`}
      >
        <div className="relative bg-white rounded-lg shadow  top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[80%] md:max-w-[70%]  lg:max-w-[30%]">
          <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 ">
            <h3 className="text-lg font-semibold text-gray-900 ">
              Đánh giá sản phẩm
            </h3>
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-full hover:bg-red-400 hover:text-white ms-auto "
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <div className="flex flex-col items-start gap-5 ">
              {/* Star */}
              <div className="flex items-center cursor-pointer">
                {[...Array(5)].map((_, index) => {
                  const starClass =
                    index < rating ? "text-yellow-300" : "text-gray-300 ";

                  return (
                    <svg
                      key={index}
                      className={`w-4 h-4 ms-1 ${starClass}`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                      onClick={() => setRating(index + 1)}
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  );
                })}
              </div>

              {/* Comment */}
              <div className="w-full ">
                <label
                  htmlFor="comment"
                  className="block mb-2 text-sm text-gray-600 "
                >
                  Đánh giá
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  id="comment"
                  className=" focus:border-red-800 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5  outline-none"
                  placeholder="..."
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-600">
                  Hình ảnh sản phẩm
                </label>
                <div className="flex gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <label className="relative flex items-center justify-center w-20 h-20 mx-auto overflow-hidden border-2 border-gray-300 cursor-pointer hover:bg-gray-100">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                          className="hidden"
                        />
                        <img src={upload} alt="" className="w-full h-full" />
                        {image && (
                          <img
                            src={`http://localhost:8080${image}`}
                            alt=""
                            className="absolute inset-0"
                          />
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={submitHandler}
                className="w-full max-w-[200px] mx-auto text-white  bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Bình luận
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default OrderList;
