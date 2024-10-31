import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { BiCategoryAlt } from "react-icons/bi";
import { IoCartOutline } from "react-icons/io5";
import { IoReturnDownBackSharp } from "react-icons/io5";

import { useLogoutMutation } from "../redux/api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";
import { toast, ToastContainer } from "react-toastify";

const AdminLayout = () => {
  const [logoutMutation] = useLogoutMutation();

  const { user } = useSelector((state) => state.auth);

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

      {/* Header  */}
      <header className="flex items-center justify-between p-4 px-10">
        <div className="flex items-center ">
          <p>
            Xin chào{" "}
            <span className="text-lg font-semibold text-purple-500">
              {user.username}
            </span>
          </p>
        </div>
        <button className="absolute hidden px-4 py-1 text-white bg-purple-500 rounded-lg top-full group-hover:block">
          Logout
        </button>
        <button
          className="text-white bg-purple-500 gap-2 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      {/* Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Navigation */}
        <aside className="p-4 bg-white lg:w-64 lg:h-screen">
          <nav>
            <ul className="flex flex-row flex-wrap w-full gap-5 lg:flex-col lg:gap-0">
              <NavLink
                to={"/admin/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 mb-4 ${
                    isActive ? "text-purple-800 bg-purple-100" : "text-gray-800"
                  }  pl-4  py-2 rounded-lg font-semibold hover:bg-purple-50 hover:text-purple-800 transition-all duration-100 ease-in-out`
                }
              >
                <IoHomeOutline className="font-semibold size-5" />
                <span>Home</span>
              </NavLink>
              <NavLink
                to={"/admin/list-products"}
                className={({ isActive }) =>
                  `flex items-center gap-3 mb-4 ${
                    isActive ? "text-purple-800 bg-purple-100" : "text-gray-800"
                  }  pl-4  py-2 rounded-lg font-semibold hover:bg-purple-50 hover:text-purple-800 transition-all duration-100 ease-in-out`
                }
              >
                <BsBoxSeam className="font-semibold size-5" />
                <span>Sản phẩm</span>
              </NavLink>
              <NavLink
                to={"/admin/list-accounts"}
                className={({ isActive }) =>
                  `flex items-center gap-3 mb-4 ${
                    isActive ? "text-purple-800 bg-purple-100" : "text-gray-800"
                  }  pl-4  py-2 rounded-lg font-semibold hover:bg-purple-50 hover:text-purple-800 transition-all duration-100 ease-in-out`
                }
              >
                <MdOutlineSupervisorAccount className="font-semibold size-5" />
                <span>Tài khoản</span>
              </NavLink>
              <NavLink
                to={"/admin/list-categories"}
                className={({ isActive }) =>
                  `flex items-center gap-3 mb-4 ${
                    isActive ? "text-purple-800 bg-purple-100" : "text-gray-800"
                  }  pl-4  py-2 rounded-lg font-semibold hover:bg-purple-50 hover:text-purple-800 transition-all duration-100 ease-in-out`
                }
              >
                <BiCategoryAlt className="font-semibold size-5" />
                <span>Danh mục </span>
              </NavLink>
              <NavLink
                to={"/admin/list-orders"}
                className={({ isActive }) =>
                  `flex items-center gap-3 mb-4 ${
                    isActive ? "text-purple-800 bg-purple-100" : "text-gray-800"
                  }  pl-4  py-2 rounded-lg font-semibold hover:bg-purple-50 hover:text-purple-800 transition-all duration-100 ease-in-out`
                }
              >
                <IoCartOutline className="font-semibold size-5" />
                <span>Đơn hàng</span>
              </NavLink>

              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 mb-4 ${
                    isActive ? "text-purple-800 bg-purple-100" : "text-gray-800"
                  }  pl-4  py-2 rounded-lg font-semibold hover:bg-purple-50 hover:text-purple-800 transition-all duration-100 ease-in-out`
                }
              >
                <IoReturnDownBackSharp className="font-semibold size-5" />
                <span>Trang bán hàng</span>
              </NavLink>
            </ul>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6 bg-[#f5f6fa]">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
