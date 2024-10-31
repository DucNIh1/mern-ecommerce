import { apiSlice } from "./apiSlice";
import { USER_URL } from "./contans";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (query) => ({
        url: `${USER_URL}`,
        params: query,
      }),
      providesTags: ["User"],
    }),
    getMyWishList: builder.query({
      query: () => ({
        url: `${USER_URL}/wish-list`,
      }),
      providesTags: ["WishList"],
    }),
    addToWishList: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/add-to-wishlist`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WishList"],
    }),
    deleteFromWishList: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/delete-from-wishlist`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["WishList"],
    }),
    updateUserById: builder.mutation({
      query: ({ userId, data }) => ({
        url: `${USER_URL}/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUserById: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMyWishListQuery,
  useAddToWishListMutation,
  useDeleteFromWishListMutation,
  useGetAllUserQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = userApiSlice;
