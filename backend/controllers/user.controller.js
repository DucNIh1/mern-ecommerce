import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";

export const deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    return next(
      new AppError("Không tồn tại tài khoản này, vui lòng thử lại", 404)
    );
  }

  res.status(200).json({ message: "Tài khoản đã được xóa thành công" });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res
    .status(200)
    .json({ message: "Lấy danh sách người dùng thành công", users });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    return next(
      new AppError("Không tồn tại tài khoản này, vui lòng thử lại", 404)
    );
  }

  res
    .status(200)
    .json({ message: "Lấy thông tin người dùng thành công", user });
});

// Admin
export const updateUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { username, email, password, confirmPassword } = req.body;

  if (username && username.length < 3) {
    return next(new AppError("Username phải có ít nhất 3 kí tự", 400));
  }
  if (email && !validator.isEmail(email)) {
    return next(new AppError("Vui lòng nhập đúng định dạng email", 400));
  }
  if (password && password.length < 8) {
    return next(new AppError("Mật khẩu phải có ít nhất 8 kí tự", 400));
  }

  const user = await User.findById(id);

  user.username = username || user.username;
  user.email = email || user.email;

  if (password) {
    if (confirmPassword === password) {
      user.password = password || user.password;
    } else {
      return next(
        new AppError("Mật khẩu xác thực không chính xác, vui lòng thử lại", 400)
      );
    }
  }

  await user.save();

  res.status(200).json({ message: "Cập nhật thông tin thành công", user });
});
