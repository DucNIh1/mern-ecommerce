import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../redux/api/productApiSlice";
import { FaChevronLeft, FaChevronRight, FaRegTrashCan } from "react-icons/fa6";
import { useGetCategoriesQuery } from "../redux/api/categoryApiSlice";
import { FaPlus } from "react-icons/fa6";
import { LuPenLine } from "react-icons/lu";

const Layout = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [productId, setProductId] = useState("");
  const limit = 4; // Số lượng sản phẩm mỗi trang

  const [updateProduct] = useUpdateProductMutation();
  const { data: categoryData } = useGetCategoriesQuery();
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
    updateProduct({ id, data: { isActive: isActive === "true" } });
  }

  function handlePageClick(event) {
    console.log(event.selected + 1);
    setPage(event.selected + 1);
  }
  return (
    <>
      {/* Header  */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-purple-600">Shodai</div>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-3xl outline-none px-4 py-2 text-slate-700 mr-4 w-96 bg-[#f5f6fa]"
        />

        <div className="flex items-center">
          <button className="p-2 mr-4 bg-gray-200 rounded-lg">
            <i className="fas fa-bell"></i>
          </button>
          <div className="flex items-center">
            <img
              src="https://placehold.co/40x40?text=User"
              alt="User Avatar"
              className="w-10 h-10 mr-2 rounded-full"
            />
            <span className="font-medium">Estiaq Noor</span>
          </div>
        </div>
      </header>
      {/* Content */}
      <div className="flex">
        {/* Navigation */}
        <aside className="w-64 h-screen p-4 bg-white">
          <nav>
            <ul>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-tachometer-alt"></i> Dashboard
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-box"></i> Orders
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-users"></i> Customers
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-envelope"></i> Messages
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-purple-600">
                  <i className="mr-2 fas fa-box-open"></i> Products
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-plug"></i> Integrations
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-chart-line"></i> Analytics
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-file-invoice"></i> Invoice
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-percent"></i> Discount
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-cog"></i> Settings
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-shield-alt"></i> Security
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="flex items-center text-gray-600">
                  <i className="mr-2 fas fa-question-circle"></i> Help
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6 bg-[#f5f6fa]"></main>
      </div>
    </>
  );
};

export default Layout;
