import { useEffect, useState } from "react";

import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import { GrLinkPrevious } from "react-icons/gr";

import { useNavigate, useParams } from "react-router-dom";
import upload from "../../assets/frontend_assets/upload.png";

const sizesList = [
  { size: "s", quantity: 0 },
  { size: "m", quantity: 0 },
  { size: "l", quantity: 0 },
  { size: "xl", quantity: 0 },
];

const UpdateProduct = () => {
  const [images, setImages] = useState([null, null, null, null, null]); // Danh sách ảnh, mỗi ô tương ứng với 1 ảnh
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState(sizesList);
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("");
  const { data } = useGetCategoriesQuery();

  const { id } = useParams();
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: productData } = useGetProductByIdQuery(id);
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (productData?.product.sizes) {
      const foundSize = sizesList.map((size) => {
        const founded = productData.product.sizes.find(
          (s) => s.size === size.size
        );
        return founded ? founded : size;
      });

      setSizes(foundSize);
    }
    setImages(productData?.product?.images);
    setName(productData?.product?.name);
    setCategory(productData?.product?.category?._id);
    setPrice(productData?.product?.price);
    setDescription(productData?.product?.description);
    setTarget(productData?.product?.target);
  }, [productData]);

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

  const handleSizeChange = (index, value) => {
    const newSizes = sizes.map((size, idx) => {
      if (idx === index) {
        return { ...size, quantity: value };
      }
      return size;
    });
    setSizes(newSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        price,
        sizes,
        description,
        images, // Sử dụng tên ảnh đã upload
        target,
        category,
      };
      const res = await updateProduct({ id, data: productData }).unwrap();
      console.log(res);
      toast.success("Cập nhật phẩm thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật sản phẩm");
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative p-20 mx-auto bg-white rounded-lg text-slate-600">
      <div
        className="absolute flex items-center gap-4 top-5 left-5 group-hover:text-blue-800"
        onClick={() => navigate("/admin/list-products")}
      >
        <GrLinkPrevious className="text-blue-500 cursor-pointer size-8 group" />
        <p className="text-lg font-semibold text-blue-500 group">
          Danh sách sản phẩm
        </p>
      </div>
      <form onSubmit={handleSubmit} className="w-[70%] mt-10 ">
        {/* Product Name */}
        <div className="flex gap-5">
          <div className="w-full mb-4">
            <label className="block mb-2 text-lg font-medium">
              Tên sản phẩm
            </label>
            <input
              type="text"
              placeholder="Eg: Áo thun cotton"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-400"
            />
          </div>

          {/* Product Category */}
          <div className="w-full">
            <label className="block mb-2 text-lg font-medium">
              Danh mục sản phẩm
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-400"
            >
              <option value="">Chọn danh mục sản phẩm</option>
              {data?.categories.map((cat, index) => (
                <option key={index} value={cat?._id}>
                  {cat?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Product Description */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium ">
            Mô tả sản phẩm
          </label>
          <textarea
            placeholder="Mô tả sản phẩm..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-400 "
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">
            Hình ảnh sản phẩm
          </label>
          <div className="flex gap-4">
            {images?.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <label className="relative flex items-center justify-center  mx-auto overflow-hidden border-2 border-gray-300 cursor-pointer w-28 h-28 hover:bg-gray-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="hidden"
                  />
                  <img src={upload} alt="" className="w-full h-full" />
                  {/* <span className="text-gray-500">Tải ảnh lên</span> */}
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

        {/* Product Sizes */}
        <div className="mb-10">
          <label className="block mb-2 text-lg font-bold text-gray-800">
            Kích thước
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {sizes.map((size, index) => (
              <div
                key={size.size}
                className="flex flex-col items-center p-2 transition-transform transform bg-gray-100 rounded-lg shadow-md hover:scale-105"
              >
                <input
                  type="number"
                  min={0}
                  placeholder={size.size}
                  value={size.quantity}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="w-[60%] text-center px-2 py-1 transition duration-200 ease-in-out border border-gray-300 rounded-md outline-none  focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <span className="mt-2 font-medium text-center text-gray-700">
                  {size.size.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-10 mb-10">
          {/* Product Price */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">Giá</label>
            <input
              type="number"
              placeholder="25"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-400"
            />
          </div>
          {/* Target */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">Đối tượng</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-400"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Trẻ em">Trẻ em</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
