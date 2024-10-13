import AppError from "../utils/AppError.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Bạn không có quyền truy cập vào tài nguyên này`, 403)
      );
    }
    next();
  };
};
