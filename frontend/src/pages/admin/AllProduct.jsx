/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import { toast } from "react-toastify";

import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaRegTrashCan,
} from "react-icons/fa6";
import { CiSearch, CiFilter } from "react-icons/ci";
import { LuPenLine } from "react-icons/lu";

import {
  useAbsoluteDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../redux/api/productApiSlice";

import { Link, useNavigate } from "react-router-dom";

import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";

import ModalDelete from "../../components/DeleteModal";

const ProductList = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(null);
  const [status, setStatus] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [category, setCategory] = useState(null);
  const [target, setTarget] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 4;

  // State tạm thời cho các giá trị filter
  const [tempName, setTempName] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);
  const [tempMinPrice, setTempMinPrice] = useState(null);
  const [tempMaxPrice, setTempMaxPrice] = useState(null);
  const [tempCategory, setTempCategory] = useState(null);
  const [tempTarget, setTemTarget] = useState(null);

  // API product
  const [absoluteDeleteProduct] = useAbsoluteDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: categoryData } = useGetCategoriesQuery();
  const { data, error, isLoading } = useGetProductsQuery({
    page,
    limit,
    ...(name ? { name } : {}),
    ...(status ? { isActive: status } : {}),
    ...(minPrice ? { "price[gt]": minPrice } : {}),
    ...(maxPrice ? { "price[lt]": maxPrice } : {}),
    ...(category ? { category } : {}),
    ...(target ? { target } : {}),
  });

  const totalPages = data?.totalPages;

  const handleFilter = () => {
    setName(tempName);
    setStatus(tempStatus);
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setCategory(tempCategory);
    setTarget(tempTarget);
    setPage(1);
  };

  function handleSetTempName(value) {
    setTempName(value);
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>{error?.data?.message || "Something was wrong"}</p>;
  }

  async function handleAbsoluteDeleteProduct(productId) {
    try {
      const res = await absoluteDeleteProduct(productId).unwrap();
      toast.success("Xóa sản phẩm thành công!");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleChangeActive(id, isActive) {
    try {
      await updateProduct({ id, data: { isActive: isActive === "true" } });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex items-center">
          <CiSearch className="absolute left-1 text-slate-400" />
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            className="p-2 pl-6 mr-4 border rounded-lg outline-none focus:border-purple-500 min-w-[300px]"
            onChange={(e) => handleSetTempName(e.target.value)}
          />

          <button
            className="gap-2 text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            onClick={handleFilter}
          >
            <CiFilter className="size-5" />
            <span>Lọc</span>
          </button>
        </div>

        <button
          onClick={() => navigate("/admin/add-product")}
          className="gap-2 text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          <FaPlus />
          <span>Thêm sản phẩm</span>
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Danh mục</th>
            <th className="py-2">Trạng thái</th>
            <th className="py-2">Khoảng giá</th>
            <th className="py-2">Đối tượng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">
              <select
                className="p-2 border rounded-lg outline-none"
                onChange={(e) => setTempCategory(e.target.value)}
              >
                <option value={""}>Tất cả</option>

                {categoryData?.categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="border-none outline-none "
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </td>

            <td className="py-2">
              <select
                className="p-2 border rounded-lg outline-none"
                onChange={(e) =>
                  setTempStatus(
                    e.target.value === "true"
                      ? "true"
                      : e.target.value === "false"
                      ? "false"
                      : null
                  )
                }
              >
                <option value={""}>Tất cả</option>
                <option value={"true"}>Active</option>
                <option value={"false"}>InActive</option>
              </select>
            </td>
            <td className="py-2 space-x-5">
              <input
                type="number"
                name="priceFrom"
                onChange={(e) => setTempMinPrice(e.target.value)}
                placeholder="VND"
                className="p-2 border rounded-lg outline-none bg-slate-50 max-w-32 text-slate-600"
              />

              <input
                type="number"
                onChange={(e) => setTempMaxPrice(e.target.value)}
                name="priceTo"
                placeholder="VND"
                className="p-2 border rounded-lg outline-none bg-slate-50 max-w-32 text-slate-600"
              />
            </td>
            <td className="py-2">
              <select
                className="p-2 border rounded-lg outline-none"
                onChange={(e) => setTemTarget(e.target.value)}
              >
                <option value={""}>Tất cả</option>
                <option value={"Nam"}>Nam</option>
                <option value={"Nữ"}>Nữ</option>
                <option value={"Trẻ em"}>Trẻ em</option>
                <option value={"Unisex"}>Unisex</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      {/* List products */}
      {data?.products.length > 0 ? (
        <>
          <table className="w-full mt-4">
            <thead className="text-start">
              <tr className="text-gray-500 ">
                <th className="py-2 text-start">Hình ảnh</th>
                <th className="py-2 text-start">Tên sản phẩm</th>
                <th className="py-2 text-start">Danh mục</th>
                <th className="py-2 text-start">Giá</th>
                <th className="py-2 text-start">Trạng thái</th>
                <th className="py-2 text-start">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-start">
              {data?.products.map((product, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${
                        product.images[0]
                      }`}
                      alt={product.name}
                      className="w-10 h-10 mr-4 rounded-lg"
                    />
                  </td>
                  <td className="flex items-center py-2">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        {product.target}
                      </div>
                    </div>
                  </td>
                  <td className="py-2">{product.category.name}</td>

                  <td className="py-2">
                    {new Intl.NumberFormat("vi-VN").format(product.price)} VND
                  </td>
                  <td className="py-2">
                    <select
                      className={`border rounded-lg font-medium p-2 cursor-pointer ${
                        product.isActive
                          ? "text-green-500 border-green-500"
                          : "text-yellow-500 border-yellow-500"
                      }`}
                      value={product.isActive}
                      onChange={(e) =>
                        handleChangeActive(product._id, e.target.value)
                      }
                    >
                      <option className="text-green-600" value={true}>
                        Active
                      </option>
                      <option className="text-yellow-500" value={false}>
                        Inactive
                      </option>
                    </select>
                  </td>
                  <td className="flex gap-4 py-2">
                    <Link
                      to={`/admin/update-product/${product._id}`}
                      className="text-white bg-purple-500 gap-2 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                    >
                      <LuPenLine />
                      <span>Cập nhật</span>
                    </Link>

                    <ModalDelete
                      onClick={() => handleAbsoluteDeleteProduct(product._id)}
                      btnText=<FaRegTrashCan className="mx-auto" />
                      modalText="Bạn có chắc chắn muốn xóa sản phẩm này không!"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="my-10 text-xl text-center">Không có sản phẩm nào</p>
      )}

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
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md hover:text-purple-700 hover:bg-purple-300 focus:z-20 "
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft aria-hidden="true" className="w-5 h-5" />
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-[16px] font-semibold rounded-xl ${
                  page === index + 1
                    ? "text-purple-700 bg-purple-300"
                    : "text-gray-900  hover:text-purple-700 hover:bg-purple-300"
                } focus:z-20 `}
              >
                {index + 1}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md hover:text-purple-700 hover:bg-purple-300 focus:z-20 "
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
