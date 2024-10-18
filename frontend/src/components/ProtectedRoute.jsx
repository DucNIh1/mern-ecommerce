/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.auth.user);

  // Nếu người dùng chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu vai trò người dùng không nằm trong mảng allowedRoles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // Nếu vai trò người dùng hợp lệ
  return <>{children}</>;
};

export default ProtectedRoute;
