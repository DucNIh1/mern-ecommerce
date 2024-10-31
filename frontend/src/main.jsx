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
import DashBoard from "./pages/admin/DashBoard";
import Categories from "./pages/admin/Categories";
import Home from "./pages/user/Home";
import ProductDetails from "./pages/product/ProductDetails";
import Cart from "./pages/product/Cart";
import Checkout from "./pages/product/Checkout";
import MyOrders from "./pages/user/MyOrders";
import AllOrders from "./pages/admin/AllOrders";
import VerifyEmail from "./pages/user/VerifyEmail";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import UpdateMe from "./pages/user/UpdateMe";
import NotFound from "./pages/NotFound";
import About from "./pages/user/About";
import AllAccounts from "./pages/admin/AllAccounts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <Signup />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "collections",
        element: <Collection />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "Update-me",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <UpdateMe />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: <About />,
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
        index: true,
        element: <AllProduct />,
      },
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
      {
        path: "dashboard",
        element: <DashBoard />,
      },
      {
        path: "list-categories",
        element: <Categories />,
      },

      {
        path: "list-orders",
        element: <AllOrders />,
      },
      {
        path: "list-accounts",
        element: <AllAccounts />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
