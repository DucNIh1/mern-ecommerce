import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "./contans";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getProducts: builder.query({
      query: (query) => ({
        url: `${PRODUCT_URL}`,
        params: query,
      }),
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
      }),
      providesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: ({ productId, ...rest }) => ({
        url: `${PRODUCT_URL}/${productId}/reviews`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["Product"],
    }),
    getRelatedProducts: builder.query({
      query: (query) => ({
        url: `${PRODUCT_URL}/related-products`,
        params: query,
      }),
      providesTags: ["Product"],
    }),
    absoluteDeleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}/force`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUploadProductImageMutation,
  useGetRelatedProductsQuery,
  useAbsoluteDeleteProductMutation,
} = productApiSlice;
