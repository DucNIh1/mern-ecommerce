import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

export const protect = async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    return next(
      new AppError("Bạn cần đăng nhập để thực hiện hành động này", 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new AppError("Tài khoản không tồn tại", 401));
    }

    next(); // Cho phép tiếp tục nếu token hợp lệ và người dùng tồn tại
  } catch (error) {
    return next(new AppError("Token không hợp lệ hoặc đã hết hạn", 401));
  }
};
