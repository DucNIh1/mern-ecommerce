import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "./contans";

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (query) => ({
        url: `${CATEGORY_URL}`,
        params: query,
      }),
      providesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (CatId) => ({
        url: `${CATEGORY_URL}/${CatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
} = categoryApiSlice;
