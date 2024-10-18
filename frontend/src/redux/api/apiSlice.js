import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    console.log("sending refresh token");
    // send refresh token to get new access token
    const refreshResult = await baseQuery(
      "/api/users/refresh",
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      // store the new token
      api.dispatch(
        setCredentials({
          token: refreshResult?.data?.accessToken,
          user: refreshResult.data.user || user,
        })
      );
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, //baseQuery: Là hàm được sử dụng để thực hiện các yêu cầu HTTP.
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});

//fetchBaseQuery: Là một helper được cung cấp bởi Redux Toolkit, giúp bạn thực hiện các yêu cầu HTTP.
//Nó đóng vai trò như một hàm nền tảng để thực hiện các yêu cầu như GET, POST, PUT, DELETE đến BASE_URL của bạn.

// createApi là một phương thức giúp tạo ra một API slice để dễ dàng quản lý các yêu cầu API.
// Các API slice này rất hữu ích trong việc quản lý các yêu cầu HTTP và lưu trữ dữ liệu trả về từ API vào Redux store.
