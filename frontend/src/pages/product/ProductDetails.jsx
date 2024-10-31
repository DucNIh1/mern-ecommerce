import { useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "../../redux/api/productApiSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import { TfiClose } from "react-icons/tfi";
import ProductCard from "../../components/ProductCard";
import ProductReviews from "./ProductReviews";
import { useSelector } from "react-redux";

const settings = {
  dots: true,
  infinite: false,
  slidesToShow: 4,
  autoplay: true,
  speed: 2000,
  autoplaySpeed: 3000,
  cssEase: "linear",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const ProductDetails = () => {
  const { user } = useSelector((state) => state.auth);

  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [proSize, setProSize] = useState(null);

  //API
  const { data, refetch } = useGetProductByIdQuery(id);
  const [addToCart] = useAddToCartMutation();
  const { data: relatedProduct } = useGetRelatedProductsQuery({
    productId: id,
  });

  async function handleAddToCart(data) {
    if (!user) {
      toast.info("Vui lòng đăng nhập để thực hiện tính năng này!");
      return;
    }
    if (qty > proSize.quantity) {
      toast.warning("Số lượng sản phẩm bạn chọn lớn hơn số lượng hiện có");
      return;
    }

    try {
      await addToCart(data).unwrap();
      toast.success("Thêm thành công sản phầm vào giỏ hàng");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <div className="my-20">
      <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
        {/* image */}
        <div className="md:w-[40%] md:ml-20">
          <ImageList images={data?.product?.images} />
        </div>

        {/* infor */}
        <div className="flex flex-col gap-4 md:w-1/2 md:pl-12 ">
          {/* Name */}
          <h1 className="text-xl font-bold md:text-2xl">
            {data?.product.name}
          </h1>
          <div className="flex items-center gap-10 mt-2">
            <div className="flex">
              {/* Rating */}
              <Ratings value={data?.product?.ratingAvg} />
              {/* Reviews */}
              <span className="ml-2 text-gray-600">
                ({data?.product.numReviews})
              </span>
            </div>
            <div className="">
              <span>Đã bán:</span>
              <span className="ml-2 text-gray-600">
                ({data?.product.totalSold})
              </span>
            </div>
          </div>
          {/* Price */}
          <div className="mt-4 text-3xl font-bold">
            {new Intl.NumberFormat("vi-VN").format(data?.product.price)} VND
          </div>
          {/* Des */}
          <p className="max-w-lg mt-4 font-normal text-gray-500">
            {data?.product.description}
          </p>
          <span className="font-medium">Chọn số lượng</span>
          <div className="flex items-center gap-4">
            <button
              className="p-2 text-white bg-black hover:bg-opacity-70"
              onClick={() => {
                if (qty == 1) return;
                else {
                  return setQty((pre) => pre - 1);
                }
              }}
            >
              <FaMinus />
            </button>
            <span>{qty}</span>
            <button
              className="p-2 text-white bg-black hover:bg-opacity-70"
              onClick={() => setQty((pre) => pre + 1)}
            >
              <FaPlus />
            </button>
          </div>
          <div className="mt-4">
            <span className="font-medium">Chọn kích thước</span>
            <div className="flex gap-2 mt-2">
              {data?.product?.sizes.map((s, index) => (
                <div className="flex flex-col items-center gap-5" key={index}>
                  <button
                    disabled={s.quantity == 0}
                    className={`uppercase border-2 border-gray-200 px-4 py-2 min-w-[50px] min-h-[45px]  font-semibold disabled:cursor-not-allowed  ${
                      proSize?.size == s.size ? "border-red-900" : ""
                    }`}
                    onClick={() =>
                      setProSize({ size: s.size, quantity: s.quantity })
                    }
                  >
                    {s.quantity == 0 ? (
                      <TfiClose className="text-red-500 size-5" />
                    ) : (
                      s.size
                    )}
                  </button>

                  <span className="border-2 border-gray-200 px-4 py-2 min-w-[50px]">
                    {s.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            className="bg-black text-white px-6 py-3 mt-4 max-w-[300px] hover:bg-opacity-80 "
            onClick={() =>
              handleAddToCart({
                productId: data?.product?._id,
                size: proSize?.size,
                quantity: qty,
                price: data?.product?.price,
              })
            }
          >
            THÊM VÀO GIỎ HÀNG
          </button>
          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>Sản phẩm chính hãng 100%.</p>
            <p>Thanh toán khi nhận hàng.</p>
            <p>Chính sách đổi trả dễ dàng trong vòng 7 ngày.</p>
          </div>
        </div>
      </div>

      <div className="p-5 mt-40 ">
        <ProductReviews product={data?.product} />
      </div>
      <div className="mt-8">
        {relatedProduct?.data?.products?.length > 0 && (
          <>
            <h2 className="mb-5 text-2xl text-center text-amber-900 ">
              Sản phẩm liên quan
            </h2>
            <div className="slider-container">
              <Slider {...settings}>
                {relatedProduct?.data?.products.map((pro, index) => (
                  <ProductCard key={index} product={pro} />
                ))}
              </Slider>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
function ImageList({ images = [] }) {
  const [mainImg, setMainImg] = useState(0);
  return (
    <div className="p-10 border">
      <div className="flex justify-center mb-4">
        <img
          src={`${import.meta.env.VITE_API_URL}${images[mainImg]}`}
          alt="Abstract geometric landscape"
          className="object-cover w-full"
        />
      </div>
      <div className="flex gap-2">
        {images.map((img, index) => {
          if (index === mainImg) {
            return;
          }
          return (
            <img
              onClick={() => setMainImg(index)}
              key={index}
              src={`http://localhost:8080${images[index]}`}
              className="w-16 h-16 cursor-pointer hover:opacity-80"
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductDetails;
