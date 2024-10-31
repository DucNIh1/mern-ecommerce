import { useState } from "react";

import { CiFilter, CiSearch } from "react-icons/ci";
import { LuPenLine } from "react-icons/lu";

import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaRegTrashCan,
} from "react-icons/fa6";

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";

import ModalDelete from "../../components/DeleteModal";

const Categories = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // for filter
  const [name, setName] = useState(null);
  const [tempName, setTempName] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 4;

  //for update category
  const [catId, setCatId] = useState(null);
  const [catName, setCatName] = useState(null);

  // API
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data, isLoading, error } = useGetCategoriesQuery({
    limit,
    page,
    ...(name ? { name } : {}),
  });

  console.log(data);
  const totalPages = data?.totalPages || 1;

  const handleFilter = () => {
    setName(tempName);
    setPage(1);
  };

  async function handleChangeActive(id, isActive) {
    try {
      updateCategory({ id, data: { isActive: isActive === "true" } });
      toast.success("Cập nhật trạng thái danh mục thành công!");
    } catch (error) {
      toast.error(error?.data?.message || "Lỗi khi update trạng thái danh mục");
      console.log(error);
    }
  }

  async function handleDeleteCategory(catId) {
    try {
      await deleteCategory(catId).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdate() {
    try {
      await updateCategory({ id: catId, data: { name: catName } });
      toast.success("Cập nhật thành công");
      setOpenUpdate(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCreateCategory(data) {
    try {
      const res = await createCategory(data).unwrap();
      console.log(res);
      toast.success("Thêm danh mục thành công");
    } catch (error) {
      toast.error(error?.data?.message || "Lỗi khi thêm danh mục");
      console.log(error);
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    return <p>{error?.data?.message || "Something was wrong"}</p>;
  }

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow ">
        <div className="flex flex-col justify-between gap-5 mb-10 md:flex-row">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative flex items-center">
              <CiSearch className="absolute left-1 text-slate-400" />
              <input
                type="text"
                placeholder="Tên sản phẩm..."
                className="p-2 pl-6 mr-4 border rounded-lg outline-none focus:border-purple-500   min-w-[300px]"
                onChange={(e) => setTempName(e.target.value)}
              />
            </div>
            <button
              className="max-w-[100px] gap-2 text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
              onClick={handleFilter}
            >
              <CiFilter className="size-5" />
              <span>Lọc</span>
            </button>
          </div>
          <ModalCreate
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleCreateCategory={handleCreateCategory}
          />
        </div>

        {/* List products */}
        {data?.categories.length > 0 ? (
          <>
            {data?.categories.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col gap-5 pt-5 border-t md:flex-row md:justify-between md:items-center"
              >
                <p className="text-gray-600 ">
                  <span className="font-medium text-purple-500">Tên:</span>{" "}
                  {cat.name}
                </p>

                <select
                  className={`h-[40px] border rounded-lg font-medium px-2 cursor-pointer ${
                    cat.isActive
                      ? "text-green-500 border-green-500"
                      : "text-yellow-500 border-yellow-500"
                  }`}
                  value={cat.isActive}
                  onChange={(e) => handleChangeActive(cat._id, e.target.value)}
                >
                  <option className="text-green-600" value={true}>
                    Active
                  </option>
                  <option className="text-yellow-500" value={false}>
                    Inactive
                  </option>
                </select>
                <div className="flex gap-4 py-2 md:justify-center">
                  <button
                    onClick={() => {
                      setCatId(cat._id);
                      setOpenUpdate(true);
                      setCatName(cat.name);
                    }}
                    className="text-white bg-purple-500 gap-2 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                  >
                    <LuPenLine />
                    <span>Cập nhật</span>
                  </button>
                  <ModalDelete
                    disabled={cat.isActive}
                    onClick={() => handleDeleteCategory(cat._id)}
                    btnText=<FaRegTrashCan className="mx-auto" />
                    modalText="Bạn có chắc chắn muốn xóa đơn hàng này không!"
                  />
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="my-10 text-xl text-center text-purple-500">
            Không tìm thấy danh mục!
          </p>
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
      {openUpdate && (
        <div className="fixed inset-0 bg-slate-950 bg-opacity-20">
          <div className="fixed p-5 top-[30%] left-1/2 bg-slate-200 min-w-[300px] flex flex-col gap-4 rounded-lg -translate-x-1/2 -translae-y-1/2">
            <h1 className="text-xl font-medium text-center text-slate-700">
              Cập nhật danh mục
            </h1>
            <input
              type="text"
              placeholder="name..."
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full py-2 pl-4 pr-2 border rounded-lg outline-none focus:border-purple-500 text-slate-600"
            />
            <div className="flex gap-4">
              <button
                className="flex-1 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-800"
                onClick={handleUpdate}
              >
                Cập nhật
              </button>
              <button
                className="flex-1 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-800"
                onClick={() => setOpenUpdate(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// eslint-disable-next-line react/prop-types
const ModalCreate = ({ openModal, setOpenModal, handleCreateCategory }) => {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (name === "") {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    handleCreateCategory({ name: name });
    setName("");
    setOpenModal(false);
  };
  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="  w-[200px]   gap-2 text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      >
        <FaPlus />
        <span>Thêm danh mục</span>
      </button>
      <div
        className={`${
          openModal ? "block" : "hidden"
        }   fixed inset-0 z-50 justify-center items-center w-full  bg-black bg-opacity-35`}
      >
        <div className="relative bg-white rounded-lg shadow  top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[80%] md:max-w-[70%]  lg:max-w-[30%]">
          <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 ">
            <h3 className="text-lg font-semibold text-gray-900 ">
              Tạo mới danh mục
            </h3>
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  id="name"
                  className="focus:border-blue-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   block w-full p-2.5  outline-none"
                  placeholder="T-shirt..."
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              <svg
                className="w-5 h-5 me-1 -ms-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Thêm mới
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
