import { useEffect, useState } from "react";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useParams } from "react-router-dom";

const sizesList = [
  { size: "s", quantity: 0 },
  { size: "m", quantity: 0 },
  { size: "l", quantity: 0 },
  { size: "xl", quantity: 0 },
];

const UpdateProduct = () => {
  const [image, setImage] = useState(null); // Chỉ lưu một ảnh duy nhất
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState(sizesList);
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("");
  const [imgName, setImgName] = useState("");
  const { data } = useGetCategoriesQuery();

  const { id } = useParams();

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
    setImage(productData?.product?.image);
    setName(productData?.product?.name);
    setCategory(productData?.product?.category?._id);
    setPrice(productData?.product?.price);
    setDescription(productData?.product?.description);
    setTarget(productData?.product?.target);
  }, [productData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Lấy file đầu tiên (chỉ một ảnh)
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const img = await uploadProductImage(formData).unwrap();
        toast.success("Upload ảnh thành công");
        setImage(img?.image);
        setImgName(img.originalname);
      } catch (error) {
        console.error("Lỗi upload ảnh", error);
      }
    }
  };

  const handleSizeChange = (size, quantity, index) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...size, quantity: parseInt(quantity) };
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
        image, // Sử dụng tên ảnh đã upload
        target,
        category,
      };
      console.log(productData);
      const res = await updateProduct({ id, data: productData }).unwrap();
      console.log(res);
      toast.success("Cập nhật phẩm thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật sản phẩm");
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-xl p-5">
      <form onSubmit={handleSubmit}>
        {/* Upload Image */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Tải ảnh lên</label>
          <label className="relative flex items-center justify-center p-4 border-2 border-gray-300 cursor-pointer w-28 h-28 hover:bg-gray-100">
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*" // Chỉ cho phép chọn file ảnh
            />
            <span className="text-gray-500">Upload</span>
            {image && (
              <img
                src={`http://localhost:8080${image}`}
                alt=""
                className="absolute inset-0"
              />
            )}
          </label>
          {imgName && <p className="mt-2 text-gray-700">Image: {imgName}</p>}
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Tên sản phẩm</label>
          <input
            type="text"
            placeholder="Type here"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">
            Mô tả sản phẩm
          </label>
          <textarea
            placeholder="Write content here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          ></textarea>
        </div>

        {/* Product Category */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">
            Danh mục sản phẩm
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Chọn danh mục sản phẩm</option>
            {data?.categories.map((cat, index) => (
              <option key={index} value={cat?._id}>
                {cat?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Giá</label>
          <input
            type="number"
            placeholder="25"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Product Sizes */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Kích thước</label>
          <div className="flex gap-2">
            {sizes?.map((size, index) => (
              <div key={size?._id} className="flex items-center">
                <input
                  type="number"
                  min={0}
                  placeholder={size.size.toUpperCase()}
                  value={size?.quantity}
                  onChange={(e) =>
                    handleSizeChange(size, e.target.value, index)
                  }
                  className="w-16 px-2 py-1 mr-2 border border-gray-300 rounded"
                />
                <span>{size.size.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">
            Đối tượng nhắm đến
          </label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Trẻ em">Trẻ em</option>
          </select>
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
