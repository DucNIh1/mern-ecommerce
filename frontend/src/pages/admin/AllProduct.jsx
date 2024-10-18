import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../redux/api/productApiSlice";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [productId, setProductId] = useState("");
  const limit = 4; // Số lượng sản phẩm mỗi trang

  const [updateProduct] = useUpdateProductMutation();
  const { data, error, isLoading } = useGetProductsQuery({
    page,
    limit,
  });
  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>{error?.data?.message || "Something was wrong"}</p>;
  }

  const totalPages = data?.totalPages;

  function handleChangeActive(id, isActive) {
    const data = { isActive: !isActive };
    updateProduct({ id, data });
  }

  return (
    <div className="container px-4 mx-auto">
      <table className="min-w-full bg-white border border-gray-200 text-start">
        <thead>
          <tr className="text-gray-600">
            <th className="px-4 py-2 border-b text-start">Hình ảnh</th>
            <th className="px-4 py-2 border-b text-start">Tên sản phẩm</th>
            <th className="px-4 py-2 border-b text-start">Danh mục</th>
            <th className="px-4 py-2 border-b text-start">Giá</th>
            <th className="px-4 py-2 border-b text-start">Trạng thái</th>
            <th className="px-4 py-2 border-b text-start">Cập nhật</th>
            <th className="px-4 py-2 border-b text-start">
              Cập nhật trạng thái
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.products.map((product, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">
                <img
                  src={`http://localhost:8080${product.image}`}
                  alt={product.name}
                  className="object-cover w-16 h-16"
                />
              </td>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.category.name}</td>
              <td className="px-4 py-2">
                {product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
              <td
                className={`py-2 px-4   ${
                  product?.isActive ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {product?.isActive ? "Đang sử dụng" : "Tạm xóa"}
              </td>

              <td
                className="px-4 py-2 cursor-pointer "
                onClick={() => navigate(`/admin/update-product/${product._id}`)}
              >
                <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                  Cập nhật
                </button>
              </td>
              <td className="px-4 py-2 cursor-pointer">
                <button
                  onClick={() =>
                    handleChangeActive(product._id, product.isActive)
                  }
                  className={`bg-gradient-to-r ${
                    product.isActive
                      ? "from-red-500 via-red-600 to-red-700 focus:ring-red-300"
                      : "from-green-500 via-green-600 to-green-700 focus:ring-green-300"
                  } font-medium rounded-lg text-sm px-5 py-2.5 text-white hover:bg-gradient-to-br focus:ring-4 focus:outline-none min-w-24`}
                >
                  {product.isActive ? "Xóa" : "Khôi phục"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div>
          <nav
            aria-label="Pagination"
            className="inline-flex -space-x-px rounded-md shadow-sm isolate"
          >
            {/* Previous button */}
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft aria-hidden="true" className="w-5 h-5" />
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold  ${
                  page === index + 1
                    ? "text-white bg-pink-600"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                } focus:z-20 focus:outline-offset-0`}
              >
                {index + 1}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <FaChevronRight aria-hidden="true" className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
