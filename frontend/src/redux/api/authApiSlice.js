import { apiSlice } from "./apiSlice";
import { USER_URL } from "./contans";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verify-email`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: `${USER_URL}/refresh`,
        method: "GET",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `${USER_URL}/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${USER_URL}/reset-password/${token}`,
        method: "POST",
        body: { password },
      }),
    }),

    updateMe: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/update-me`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateMeMutation,
} = authApiSlice;
