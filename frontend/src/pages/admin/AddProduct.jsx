import { useState } from "react";

import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";

import { GrLinkPrevious } from "react-icons/gr";

import { useNavigate } from "react-router-dom";

import upload from "../../assets/frontend_assets/upload.png";

const sizesList = [
  { size: "s", quantity: 30 },
  { size: "m", quantity: 30 },
  { size: "l", quantity: 30 },
  { size: "xl", quantity: 30 },
];

const AddProductForm = () => {
  const [images, setImages] = useState([null, null, null, null, null]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState(sizesList);
  const [target, setTarget] = useState("Nam");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const { data } = useGetCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await uploadProductImage(formData).unwrap();
        toast.success("Upload ảnh thành công");
        const newImages = [...images];
        newImages[index] = response.images[0]; // Lưu ảnh đã upload vào vị trí tương ứng
        setImages(newImages);
      } catch (error) {
        toast.error("lỗi upload ảnh");

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
        images: images.filter((img) => img !== null),
        target,
        category,
      };

      await createProduct(productData).unwrap();
      toast.success("Thêm sản phẩm thành công");
      navigate("/admin/list-products");
    } catch (error) {
      toast.error(error?.data?.message || "Lỗi khi thêm sản phẩm");
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative p-20 mx-auto bg-white rounded-lg text-slate-600">
      <div
        className="absolute flex items-center gap-4 top-5 left-5 group-hover:text-purple-800"
        onClick={() => navigate("/admin/list-products")}
      >
        <GrLinkPrevious className="text-purple-500 cursor-pointer size-8 group" />
        <p className="text-lg font-semibold text-purple-500 group">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-400"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-400"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-400 "
          ></textarea>
        </div>

        <div className="flex items-center justify-between gap-5">
          {/* Product Price */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">Giá</label>
            <input
              type="number"
              placeholder="25"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-400"
            />
          </div>
          {/* Target */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">Đối tượng</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-400"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Trẻ em">Trẻ em</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          {/* Product Sizes */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">Kích thước</label>
            <div className="flex gap-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-2">{size.size.toUpperCase()}</span>
                  <input
                    type="number"
                    min={0}
                    value={size.quantity}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                    className="w-16 px-2 border border-gray-300 rounded-lg outline-none focus:border-purple-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Images */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">
            Hình ảnh sản phẩm
          </label>
          <div className="flex gap-4">
            {images.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <label className="relative flex items-center justify-center mx-auto overflow-hidden border-2 border-gray-300 cursor-pointer w-28 h-28 hover:bg-gray-100">
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

        <button
          type="submit"
          className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
