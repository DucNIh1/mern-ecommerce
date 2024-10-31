import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useGetAllOrdersQuery } from "../../redux/api/orderApiSlice";
import OrderList from "../../components/OrderList";

const orderStatus = [
  "Đang xử lí",
  "Đang vận chuyển",
  "Đã giao hàng",
  "Đã hủy đơn",
];

const AllOrders = () => {
  const [isPaid, setIsPaid] = useState(null);
  const [byOrderStatus, setByOrderStatus] = useState(null);
  const [byPaymentMethod, setByPaymentMethod] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 2;

  const { data, refetch } = useGetAllOrdersQuery({
    limit,
    page,
    ...(isPaid ? { isPaid } : {}),
    ...(byOrderStatus ? { orderStatus: byOrderStatus } : {}),

    ...(byPaymentMethod ? { paymentMethod: byPaymentMethod } : {}),

    ...(sortBy ? { sort: sortBy } : {}),
  });
  const totalPages = data?.totalPages;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4"></div>

      {/* filter */}
      <div className="flex justify-between mb-10 flex-col lg:flex-row">
        <div className="p-2 flex flex-col gap-3">
          <span className="py-2">Trạng thái đơn hàng</span>

          <select
            className="p-2 border rounded-lg outline-none cursor-pointer"
            onChange={(e) => setByOrderStatus(e.target.value)}
          >
            <option value={""}>Tất cả</option>

            {orderStatus.map((st, index) => (
              <option
                key={index}
                value={st}
                className="border-none outline-none "
              >
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="p-2 flex flex-col gap-3">
          <span className="py-2 ">Trạng thái thanh toán</span>

          <select
            className="p-2 border rounded-lg outline-none cursor-pointer"
            onChange={(e) => setIsPaid(e.target.value)}
          >
            <option value={""}>Tất cả</option>
            <option value={"true"}>Đã thanh toán</option>
            <option value={"false"}>Chưa thanh toán</option>
          </select>
        </div>

        <div className="py-2 flex flex-col gap-3">
          <span className="py-2">Phương thức thanh toán</span>

          <select
            className="p-2 border rounded-lg outline-none lg:w-[200px] cursor-pointer"
            onChange={(e) => setByPaymentMethod(e.target.value)}
          >
            <option value={""}>Tất cả</option>
            <option value={"Thanh toán tiền mặt"}>Tiền mặt</option>
            <option value={"ZaloPay"}>Zalo Pay</option>
          </select>
        </div>

        <div className="py-2 flex flex-col gap-3">
          <span className="py-2">Sắp xếp theo</span>

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

      {data?.orders.length > 0 ? (
        <>
          <OrderList
            orders={data?.orders}
            refetch={refetch}
            mainColor={"purple"}
            isAdmin={true}
          />
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
        </>
      ) : (
        <p className="text-center text-">Chưa có đơn hàng nào</p>
      )}
    </div>
  );
};

export default AllOrders;
