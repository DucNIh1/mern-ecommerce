import { useState } from "react";

import { CiFilter, CiSearch } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight, FaRegTrashCan } from "react-icons/fa6";

import {
  useDeleteUserByIdMutation,
  useGetAllUserQuery,
  useUpdateUserByIdMutation,
} from "../../redux/api/userApiSlice";

import ModalDelete from "../../components/DeleteModal";

import moment from "moment";

import { toast } from "react-toastify";

const AllAccounts = () => {
  // For filter
  const [byActive, setByActive] = useState(null);
  const [byEmail, setByEmail] = useState(null);
  const [tempEmail, setTempEmail] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 4;

  // For update
  const [updateUser] = useUpdateUserByIdMutation();
  const [deleteUser] = useDeleteUserByIdMutation();

  const { data } = useGetAllUserQuery({
    page,
    limit,
    ...(byActive ? { isActive: byActive } : {}),
    ...(sortBy ? { sort: sortBy } : {}),
    ...(byEmail ? { email: byEmail } : {}),
  });

  const totalPages = data?.totalPages;
  const handleChangeUserActive = async (userId, isActive) => {
    try {
      const res = await updateUser({
        userId,
        data: { isActive: isActive },
      }).unwrap();
      toast.success(res?.message || "Cập nhật thành công!");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await deleteUser(userId).unwrap();
      toast.success(res?.message || "Xóa người dùng");
    } catch (error) {
      toast.error(error?.data?.message || "Lỗi khi xóa người dùng");
      console.log(error);
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* filter */}
      <div className="flex flex-col mb-10 lg:flex-row lg:items-center lg:gap-10">
        <div className="relative flex items-center">
          <CiSearch className="absolute left-1 text-slate-400" />
          <input
            type="text"
            value={tempEmail}
            placeholder="Tên sản phẩm..."
            className="p-2 pl-6 mr-4 border rounded-lg outline-none focus:border-purple-500 min-w-[300px]"
            onChange={(e) => setTempEmail(e.target.value)}
          />

          <button
            className="gap-2 text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            onClick={() => setByEmail(tempEmail)}
          >
            <CiFilter className="size-5" />
            <span>Lọc</span>
          </button>
        </div>
        <div className="flex flex-row gap-3 p-2">
          <span className="py-2 font-semibold text-purple-600">
            Trạng thái{" "}
          </span>

          <select
            className="p-2 border rounded-lg outline-none cursor-pointer"
            onChange={(e) => setByActive(e.target.value)}
          >
            <option value={""}>Tất cả</option>

            <option value={true} className="border-none outline-none ">
              Active
            </option>
            <option value={false} className="border-none outline-none ">
              InActive
            </option>
          </select>
        </div>

        <div className="flex flex-row gap-3 py-2">
          <span className="py-2 font-semibold text-purple-600">
            Sắp xếp theo
          </span>

          <select
            className="p-2 border rounded-lg outline-none lg:w-[200px] cursor-pointer"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value={""}>Mặc định</option>
            <option value={"-createdAt"}>Mới nhất</option>
            <option value={"createdAt"}>Cũ nhất</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-5 ">
        {data?.users.map((user, index) => (
          <div className="flex justify-between " key={index}>
            <p className="min-w-[300px]">{user.email}</p>
            <p className="min-w-[100px]">{user.username}</p>
            <p className="min-w-[100px]">{user.role}</p>

            <p>
              {moment(user.createdAt).format(
                "HH[:]mm [phút] [-] DD [tháng] MM [năm] YYYY"
              )}
            </p>
            <select
              className={`p-2 border rounded-lg outline-none ${
                user.isActive ? "text-green-500" : "text-yellow-500"
              }`}
              value={user.isActive}
              onChange={(e) => handleChangeUserActive(user._id, e.target.value)}
            >
              <option value={true}>Active</option>
              <option value={false}>InActive</option>
            </select>

            <ModalDelete
              onClick={() => handleDeleteUser(user._id)}
              btnText=<FaRegTrashCan className="mx-auto" />
              modalText="Bạn có chắc chắn muốn xóa sản tài khoản này không!"
            />
          </div>
        ))}

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
    </div>
  );
};

export default AllAccounts;
