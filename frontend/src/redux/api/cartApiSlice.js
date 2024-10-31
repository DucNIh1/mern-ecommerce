import { apiSlice } from "./apiSlice";
import { CART_URL } from "./contans";

const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: `${CART_URL}`,
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteFromCart: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${CART_URL}/${productId}`,
        method: "DELETE",
        body: data,
      }),
    }),
    increCartItem: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${CART_URL}/${productId}/increment`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    decreCartItem: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${CART_URL}/${productId}/decrement`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useDecreCartItemMutation,
  useIncreCartItemMutation,
  useDeleteFromCartMutation,
} = cartApiSlice;
