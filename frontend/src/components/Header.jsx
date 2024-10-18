import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/frontend_assets/logo.png";
import { CiSearch } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { IoBagHandleOutline } from "react-icons/io5";
import { BiMenuAltRight } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/api/authApiSlice.js";
import { toast } from "react-toastify";
import { logout } from "../redux/features/authSlice.js";
const Header = () => {
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
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
    e.preventDefault();
  };
  const { user } = useSelector((state) => state.auth);

  return (
    <div className=" flex items-center font-medium py-5 justify-between mx-auto ">
      <img src={logo} alt="" className="leading-6 w-36" />
      <ul className="hidden lg:flex text-sm gap-5 leading-5 text-[#374151] uppercase items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "text-pink-500" : "")}
          >
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/collections"
            className={({ isActive }) => (isActive ? "text-pink-500" : "")}
          >
            Bộ sưu tập
          </NavLink>
        </li>

        <li>
          <NavLink
            to="about"
            className={({ isActive }) => (isActive ? "text-pink-500" : "")}
          >
            Thông tin
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/list-products"
            className={({ isActive }) => (isActive ? "text-pink-500" : "")}
          >
            Liên hệ
          </NavLink>
        </li>
        {user && user?.role === "admin" && (
          <li className="border rounded-xl px-5 py-1">
            <NavLink
              to={"/admin"}
              className={({ isActive }) => (isActive ? "text-pink-500" : "")}
            >
              Admin Panel
            </NavLink>
          </li>
        )}
      </ul>
      <div className="flex items-center gap-6 leading-6 ">
        <CiSearch className="text-2xl cursor-pointer hover:scale-125 duration-150 ease-linear" />
        <div className="relative  group">
          <IoPersonOutline className="text-2xl cursor-pointer hover:scale-125 duration-150 ease-linear" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded">
              {user ? (
                <>
                  <Link
                    className="block hover:bg-slate-200  rounded-lg p-2"
                    to={"login"}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Link>
                  <Link
                    className="block hover:bg-slate-200  rounded-lg p-2"
                    to="orders"
                  >
                    Đơn hàng
                  </Link>
                </>
              ) : (
                <Link
                  className="block hover:bg-slate-200  rounded-lg p-2"
                  to={"login"}
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          <IoBagHandleOutline className="text-2xl cursor-pointer hover:scale-125 duration-150 ease-linear" />
          <span className="absolute bottom-[-5px] right-[-5px] w-4 h-4 text-[8px] rounded-full bg-black text-white text-center leading-4">
            5
          </span>
        </div>
        <BiMenuAltRight className="text-2xl cursor-pointer hover:scale-125 duration-150 ease-linear lg:hidden" />
      </div>
    </div>
  );
};

export default Header;
