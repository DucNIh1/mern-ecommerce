import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    // Nếu không có thông tin người dùng, chuyển hướng đến trang đăng nhập
    toast.warning("Please Login to access this page");
    return <Navigate to="/login" />;
  }

  return children; // Nếu đã xác thực, render children
};

export default ProtectedRoute;
