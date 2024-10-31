import { Link, Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseSharp } from "react-icons/io5";
import { CiTrash } from "react-icons/ci";
import { useState } from "react";
import {
  useDeleteFromWishListMutation,
  useGetMyWishListQuery,
} from "./redux/api/userApiSlice";
import { useAddToCartMutation } from "./redux/api/cartApiSlice";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query/react";
function App() {
  const { user } = useSelector((state) => state.auth);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openWishList, setOpenWishList] = useState(false); // for open wish list

  const { data: wishListData } = useGetMyWishListQuery(user ?? skipToken);

  const [deletFromWishLish] = useDeleteFromWishListMutation();
  const [addToCart] = useAddToCartMutation();

  const handleSelectProduct = (productId, size, price) => {
    const isIn = selectedProducts.some(
      (prod) => prod.productId === productId && prod.size === size
    );
    setSelectedProducts((prevSelected) => {
      if (isIn) {
        // Nếu sản phẩm đã được chọn, bỏ chọn
        return prevSelected.filter((pro) => pro.productId !== productId);
      } else {
        // Nếu chưa được chọn, thêm sản phẩm vào danh sách chọn
        return [...prevSelected, { productId, size, price }];
      }
    });
  };

  const handleDeleteFromWishList = async (productId, size) => {
    try {
      const res = await deletFromWishLish({ productId, size }).unwrap();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({ products: selectedProducts }); // Gọi hàm addToCart với các sản phẩm đã chọn
      toast.success("Thêm thành công vào giỏ hàng");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ScrollRestoration />
      <ToastContainer className="z-[999]" />
      <div className="px-5 lg:px-20 xl:px-32">
        <Header
          wishListData={wishListData}
          openWishList={openWishList}
          setOpenWishList={setOpenWishList}
        />
        <Outlet />
        <Footer />
      </div>
      {openWishList && (
        <div className="w-[80%] fixed top-0 bottom-0 right-0 z-50  md:w-[60%]  xl:w-[28%] bg-white shadow-lg flex flex-col h-100vh">
          <IoCloseSharp
            className="absolute p-2 text-gray-800 rounded-full cursor-pointer top-2 right-4 size-10 hover:bg-red-300 hover:text-white"
            onClick={() => setOpenWishList(false)}
          />

          <div
            style={{ maxHeight: "calc(100vh - 250px)" }}
            className="overflow-y-auto"
          >
            <h1 className="p-5 text-xl text-gray-800 border-b w-[80%] mx-auto font-medium">
              Danh sách yêu thích
            </h1>
            {wishListData?.wishlist?.length > 0 ? (
              wishListData?.wishlist.map((item, index) => (
                <div
                  className="flex items-start gap-2 md:gap-5 p-5 border-b md:w-[90%] mx-auto"
                  key={index}
                >
                  <div className="inline-flex items-center">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProducts.some(
                          (prod) =>
                            prod.productId === item.product._id &&
                            prod.size === item.size
                        )}
                        onChange={() =>
                          handleSelectProduct(
                            item.product._id,
                            item.size,
                            item?.product?.price
                          )
                        }
                        className="w-5 h-5 transition-all border rounded shadow appearance-none cursor-pointer peer hover:shadow-md border-slate-300 checked:bg-red-500 checked:border-red-500"
                        id="check8"
                      />
                      <span className="absolute text-white transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </label>
                  </div>

                  <img
                    src={`http://localhost:8080${item?.product?.images[0]}`}
                    alt=""
                    className="object-cover w-20 md:w-28"
                  />
                  <div className="flex flex-col items-start flex-1 gap-3 p-2">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="text-lg text-gray-800 hover:text-amber-900"
                    >
                      {item?.product?.name}
                    </Link>
                    <p className="text-gray-500">
                      Size: {item.size.toUpperCase()}
                    </p>
                    <div className="flex justify-between w-full ">
                      <p className="font-medium text-amber-700 ">
                        {new Intl.NumberFormat("vi-VN").format(
                          item?.product?.price
                        )}{" "}
                        VND
                      </p>
                      <button
                        className="text-lg font-medium text-red-500 rounded-full hover:scale-110 hover:bg-slate-100"
                        onClick={() =>
                          handleDeleteFromWishList(
                            item?.product?._id,
                            item?.size
                          )
                        }
                      >
                        <CiTrash className="text-gray-800 cursor-pointer size-5 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="text-xl text-center mt-60 ">
                Không có sản phẩm nào{" "}
              </h1>
            )}
          </div>
          <div className="flex flex-col justify-end flex-1 p-4 pb-10 bg-white shadow-lg">
            <div className="mt-4">
              <button className="w-full py-2 mb-2 text-red-900 border border-red-900 rounded hover:bg-amber-50">
                Tiếp tục mua hàng
              </button>
              <button
                className="w-full py-2 text-white bg-red-900 rounded hover:bg-opacity-45"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
