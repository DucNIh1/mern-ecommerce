import { apiSlice } from "./apiSlice";
import { ORDER_URL, PAYMENT_URL } from "./contans";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrderWithZaloPay: builder.mutation({
      query: (data) => ({
        url: `${PAYMENT_URL}/create-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    createOrderNormal: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    getMyOrders: builder.query({
      query: (query) => ({
        url: `${ORDER_URL}/my-orders`,
        params: query,
      }),
      providesTags: ["Order"],
    }),

    getAllOrders: builder.query({
      query: (query) => ({
        url: `${ORDER_URL}`,
        params: query,
      }),
      providesTags: ["Order"],
    }),

    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, data }) => ({
        url: `${ORDER_URL}/${orderId}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderWithZaloPayMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useCreateOrderNormalMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApiSlice;
