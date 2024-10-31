import { useEffect, useState } from "react";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Paganation from "../../components/Paganation";
import OrderList from "../../components/OrderList";

const MyOrders = () => {
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, refetch } = useGetMyOrdersQuery({
    limit,
    page,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);
  const totalPages = data?.totalPages;

  return (
    <div className="p-6 mx-auto my-20 mt-8 bg-white border border-red-500 ">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">MY ORDERS</h1>

      {data?.orders && data?.orders.length > 0 ? (
        <>
          <OrderList orders={data?.orders} refetch={refetch} />

          {/* Pagination */}
          <Paganation totalPages={totalPages} page={page} setPage={setPage} />
        </>
      ) : (
        <p>Bạn chưa đặt đơn hàng nào!</p>
      )}
    </div>
  );
};

export default MyOrders;
