import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Admin from "./pages/admin/Admin";
import AddProduct from "./pages/admin/AddProduct";
import AllProduct from "./pages/admin/AllProduct";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import Collection from "./pages/product/Collection";
import UpdateProduct from "./pages/admin/UpdateProduct";
import Test from "./pages/admin/Test";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <Signup />,
      },
      {
        path: "collections",
        element: <Collection />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "update-product/:id",
        element: <UpdateProduct />,
      },
      {
        path: "list-products",
        element: <AllProduct />,
      },
    ],
  },
  {
    path: "/test",
    element: <Test />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
