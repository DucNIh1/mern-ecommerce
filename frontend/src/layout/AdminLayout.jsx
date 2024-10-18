/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/frontend_assets/logo.png";
import { AiOutlineProduct } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { CiViewList } from "react-icons/ci";
import {
  FaCheckSquare,
  FaRegSquare,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useLogoutMutation } from "../redux/api/authApiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/authSlice";
import { toast, ToastContainer } from "react-toastify";

const AdminLayout = ({ children }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [logoutMutation] = useLogoutMutation();
  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await logoutMutation();
      dispatch(logout());
      navigate("login");
      toast.success(res?.message || "Đăng xuất thành công");
    } catch (error) {
      toast.error(
        error?.data?.message || "Đăng xuất thất bại, vui lòng thử lại"
      );

      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />

      <div>
        <div className="w-full px-[4%] flex items-center justify-between leading-6 py-4 border-b border-gray-200">
          <img src={logo} alt="" className="leading-6 w-36" />

          <button
            onClick={handleLogout}
            className="px-6 py-2 font-medium text-white transition duration-300 ease-in-out bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Đăng xuất
          </button>
        </div>
        <div className="flex leading-6">
          {/* Menu */}
          <div className="w-[20%] min-h-screen border-r-2 border-gray-300 bg-gray-100 pl-10 pt-5">
            <ul className="p-4 space-y-3">
              {/* Danh mục Add Items */}
              <li>
                <button
                  onClick={() => toggleSubmenu(1)}
                  className="flex items-center justify-start w-full p-3 text-left transition duration-300 ease-in-out border border-gray-300 rounded-lg"
                >
                  <AiOutlineProduct className="mr-2 " />
                  <span className="text-lg">Quản lí sản phẩm</span>
                  {openSubmenu === 1 ? (
                    <FaChevronUp className="ml-auto text-gray-500" />
                  ) : (
                    <FaChevronDown className="ml-auto text-gray-500" />
                  )}
                </button>
                {openSubmenu === 1 && (
                  <ul className="pl-6 space-y-2">
                    <li>
                      <NavLink
                        to="add-product"
                        className={({ isActive }) =>
                          `flex items-center p-2 hover:bg-gray-200 ${
                            isActive ? "bg-blue-100 text-blue-600" : ""
                          }`
                        }
                      >
                        <CiCirclePlus className="mr-2 text-gray-500" />
                        <span>Thêm sản phẩm</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="list-products"
                        className={({ isActive }) =>
                          `flex items-center p-2 hover:bg-gray-200 ${
                            isActive ? "bg-blue-100 text-blue-600" : ""
                          }`
                        }
                      >
                        <CiViewList className="mr-2 text-gray-500" />
                        <span>Danh sách sản phẩm</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Danh mục List Items (có submenu) */}
              <li>
                <button
                  onClick={() => toggleSubmenu(2)}
                  className="flex items-center justify-start w-full p-3 text-left transition duration-300 ease-in-out border border-gray-300 rounded-lg"
                >
                  <IoBagHandleOutline className="mr-2 " />
                  <span className="text-lg">Quản lí đơn hàng</span>
                  {openSubmenu === 2 ? (
                    <FaChevronUp className="ml-auto text-gray-500" />
                  ) : (
                    <FaChevronDown className="ml-auto text-gray-500" />
                  )}
                </button>
                {openSubmenu === 2 && (
                  <ul className="pl-6 space-y-2">
                    <li>
                      <NavLink
                        to="/submenu1"
                        className={({ isActive }) =>
                          `flex items-center p-2 hover:bg-gray-200 ${
                            isActive ? "bg-blue-100 text-blue-600" : ""
                          }`
                        }
                      >
                        <FaRegSquare className="mr-2 text-gray-500" />
                        <span>Submenu 1</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/submenu2"
                        className={({ isActive }) =>
                          `flex items-center p-2 hover:bg-gray-200 ${
                            isActive ? "bg-blue-100 text-blue-600" : ""
                          }`
                        }
                      >
                        <FaRegSquare className="mr-2 text-gray-500" />
                        <span>Submenu 2</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Orders (có checkbox) */}
              <li>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `flex items-center p-2 hover:bg-gray-200 ${
                      isActive ? "bg-blue-100 text-blue-600" : ""
                    }`
                  }
                >
                  <FaCheckSquare className="mr-2 text-gray-500" />
                  <span className="text-lg">Quản lí người dùng</span>
                </NavLink>
              </li>
            </ul>
          </div>
          {/* Content */}
          <div className="w-[70%] mx-auto p-5">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
