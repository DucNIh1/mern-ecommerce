import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Link as ScrollLink } from "react-scroll";

//icons
import { CiSearch } from "react-icons/ci";
import {
  IoCloseSharp,
  IoPersonOutline,
  IoBagHandleOutline,
} from "react-icons/io5";
import { BiMenuAltRight } from "react-icons/bi";
import { HiOutlineHeart } from "react-icons/hi2";
import { IoMdArrowRoundUp } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/api/authApiSlice.js";
import { useGetProductsQuery } from "../redux/api/productApiSlice.js";
import { useGetCartQuery } from "../redux/api/cartApiSlice.js";
import { logout } from "../redux/features/authSlice.js";
import { skipToken } from "@reduxjs/toolkit/query/react";

// eslint-disable-next-line react/prop-types
const SearchProduct = ({ products = [] }) => {
  return (
    <div
      className=" absolute top-full  translate-y-[5px]  w-full max-h-[300px] h-auto z-50 bg-white rounded-sm shadow-md flex flex-col  gap-2 overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {products &&
        products.length > 0 &&
        products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            className="flex gap-2 p-4 cursor-pointer"
            key={product._id}
          >
            <img
              src={`${import.meta.env.VITE_API_URL}${product.images[0]}`}
              alt=""
              className="w-12 h-12"
            />
            <p className="text-sm font-normal text-gray-600 max-w-[150px] hover:text-amber-950">
              {product.name}
            </p>
            <p className="flex-1 text-sm text-amber-600">
              {" "}
              {new Intl.NumberFormat("vi-VN").format(product.price)} VND
            </p>
          </Link>
        ))}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const Header = ({ wishListData = [], setOpenWishList }) => {
  const [isVisible, setIsVisible] = useState(false); // scroll
  const [openMenu, setOpenMenu] = useState(false);

  // State để lưu các sản phẩm được chọn
  const [name, setName] = useState(""); // for searching
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { data: cartData } = useGetCartQuery(user ?? skipToken);
  const [logoutMutation] = useLogoutMutation();
  const { data: productData } = useGetProductsQuery({
    name: name,
  });

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

  // Hàm xử lý nhấp chuột ra ngoài input search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setName("");
        setIsSearchVisible(false); // Ẩn tìm kiếm nếu nhấp ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  // xu li scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <ScrollLink
          to="top"
          smooth={true}
          duration={500}
          className="fixed top-2/3 right-5 z-[999]"
        >
          <IoMdArrowRoundUp className="cursor-pointer size-10 hover:opacity-85 z-[999]" />
        </ScrollLink>
      )}
      <div
        className="flex items-center justify-between py-5 mx-auto font-medium "
        id="top"
      >
        <img src={logo} alt="" className="leading-6 w-36" />

        {/* Navigation */}
        <ul className="hidden xl:flex text-sm gap-5 leading-5 text-[#374151] uppercase items-center">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "text-red-700 " : "")}
            >
              Trang chủ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/collections"
              className={({ isActive }) => (isActive ? "text-red-700 " : "")}
            >
              Bộ sưu tập
            </NavLink>
          </li>

          <li>
            <NavLink
              to="about"
              className={({ isActive }) => (isActive ? "text-red-700 " : "")}
            >
              Thông tin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="contact"
              className={({ isActive }) => (isActive ? "text-red-700 " : "")}
            >
              Liên hệ
            </NavLink>
          </li>
          {user && user?.role === "admin" && (
            <li className="px-5 py-1 border rounded-xl">
              <NavLink
                to={"/admin"}
                className={({ isActive }) => (isActive ? "text-red-700 " : "")}
              >
                Admin Panel
              </NavLink>
            </li>
          )}
        </ul>

        {/* Search */}
        <div className="relative hidden lg:block" ref={searchRef}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setIsSearchVisible(true);
            }}
            className=" w-[300px] py-3 px-2 outline-none bg-gray-100 rounded-3xl text-sm text-gray-800 pl-12 pr-5  focus:ring-2 focus:ring-red-300 focus:bg-white  "
          />
          {isSearchVisible && productData?.products.length > 0 && (
            <SearchProduct products={productData?.products} />
          )}
          <CiSearch className="absolute z-10 text-2xl text-gray-400 duration-150 ease-linear -translate-y-1/2 cursor-pointer hover:scale-125 top-1/2 left-2" />
        </div>

        {/* Group menu */}
        <div className="items-center gap-6 leading-6 md:flex">
          {/* menu person */}
          <div className="relative hidden group md:block">
            <IoPersonOutline className="text-2xl duration-150 ease-linear cursor-pointer hover:scale-125" />
            <div className="absolute right-0 z-50 hidden pt-4 group-hover:block dropdown-menu">
              <div className="flex flex-col gap-2 py-2 font-normal text-gray-800 bg-white rounded-md shadow-md w-52">
                {user ? (
                  <>
                    <Link
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 "
                      to={"login"}
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </Link>
                    <Link
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 "
                      to="my-orders"
                    >
                      Đơn hàng
                    </Link>
                    <Link
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 "
                      to="update-me"
                    >
                      Thông tin cá nhân
                    </Link>
                  </>
                ) : (
                  <Link
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 "
                    to={"login"}
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* wish icon */}
          <div
            className="relative hidden md:block"
            onClick={() => setOpenWishList(true)}
          >
            <HiOutlineHeart className="text-2xl text-red-500 duration-150 ease-linear cursor-pointer hover:scale-125" />
            <span className="absolute bottom-[-5px] right-[-5px] w-4 h-4 text-[8px] rounded-full bg-black text-white text-center leading-4">
              {wishListData?.wishlist?.length || 0}
            </span>
          </div>
          {/* cart icon */}
          <div className="relative hidden md:block">
            <Link to={"/cart"}>
              <IoBagHandleOutline className="text-2xl duration-150 ease-linear cursor-pointer hover:scale-125" />
              <span className="absolute bottom-[-5px] right-[-5px] w-4 h-4 text-[8px] rounded-full bg-black text-white text-center leading-4">
                {cartData?.cart?.items?.length > 0
                  ? cartData?.cart?.items?.length
                  : 0}
              </span>
            </Link>
          </div>

          {/* menu  icon*/}
          <BiMenuAltRight
            onClick={() => setOpenMenu(true)}
            className="text-2xl duration-150 ease-linear cursor-pointer hover:scale-125 xl:hidden"
          />
        </div>
      </div>

      {/* Reponsive menu */}
      {openMenu && (
        <div className="fixed bg-black top-0 bottom-0 right-0 md:w-[50%] w-[80%] bg-opacity-80 z-50">
          <IoCloseSharp
            className="absolute p-2 text-white rounded-full cursor-pointer top-2 right-4 size-10 hover:bg-red-300 hover:text-white"
            onClick={() => setOpenMenu(false)}
          />

          <ul className="flex flex-col gap-3 p-5 mt-20 text-white md:text-center md:gap-5 ">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "text-red-700 " : "")}
              >
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/collections"
                className={({ isActive }) => (isActive ? "text-red-700" : "")}
              >
                Bộ sưu tập
              </NavLink>
            </li>

            <li>
              <NavLink
                to="about"
                className={({ isActive }) => (isActive ? "text-red-700" : "")}
              >
                Thông tin
              </NavLink>
            </li>
            <li>
              <NavLink
                to="contact"
                className={({ isActive }) => (isActive ? "text-red-700" : "")}
              >
                Liên hệ
              </NavLink>
            </li>
            {user && user?.role === "admin" && (
              <li className="">
                <NavLink
                  to={"/admin"}
                  className={({ isActive }) => (isActive ? "text-red-700" : "")}
                >
                  Admin Panel
                </NavLink>
              </li>
            )}

            {!user && (
              <li>
                <Link to={"login"}>Đăng nhập</Link>
              </li>
            )}
            {user && (
              <>
                <li>
                  <Link to="my-orders">Đơn hàng</Link>
                </li>
                <li>
                  <Link to="Update-me">Thông tin cá nhân</Link>
                </li>
                <li>
                  <Link to={"login"} onClick={handleLogout}>
                    Đăng xuất
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* wish icon */}
          <div
            className="flex items-center gap-2 p-5 md:hidden"
            onClick={() => setOpenWishList(true)}
          >
            <HiOutlineHeart className="text-lg text-red-500 duration-150 ease-linear cursor-pointer hover:scale-125" />
            <p className="text-red-300">Danh sách sản phẩm yêu thích</p>
          </div>

          <div className="flex items-center gap-2 p-5 md:hidden">
            <IoBagHandleOutline className="text-lg text-red-500 duration-150 ease-linear cursor-pointer hover:scale-125" />
            <Link to="/cart" className="text-red-300">
              Giỏ hàng
            </Link>

            <span className="absolute bottom-[-5px] right-[-5px] w-4 h-4 text-[8px] rounded-full bg-black text-white text-center leading-4">
              5
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
