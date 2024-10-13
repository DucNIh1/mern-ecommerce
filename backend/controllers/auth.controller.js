import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import validator from "validator";
import bcrypt from "bcryptjs";

const generateToken = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: "30d", // 30 days
  });

  res.cookie("jwt", token, {
    maxAge: 60 * 60 * 1000 * 24 * 30, //30days
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError("Vui lòng điền đầy đủ thông tin đăng kí", 400));
  }

  if (username && username.length < 3) {
    return next(new AppError("Username phải có ít nhất 3 kí tự", 400));
  }
  if (email && !validator.isEmail(email)) {
    return next(new AppError("Vui lòng nhập đúng định dạng email", 400));
  }
  if (password && password.length < 8) {
    return next(new AppError("Mật khẩu phải có ít nhất 8 kí tự", 400));
  }

  const findUser = await User.findOne({ email });

  if (findUser)
    return next(
      new AppError("Email này đã được sử dụng, vui lòng dùng email khác", 400)
    );

  const user = await User.create({ email, password, username });
  user.password = undefined;
  generateToken(res, user);
  res.status(200).json({ message: "Đăng kí tài khoản thành công", user });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Vui lòng nhập đâỳ đủ thông tin", 400));

  const user = await User.findOne({ email });

  // Kiểm tra nếu không có người dùng hoặc mật khẩu không chính xác
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Email hoặc mật khẩu không chính xác", 400));
  }

  // Kiểm tra nếu tài khoản của người dùng bị vô hiệu hóa
  if (!user.isActive) {
    return next(
      new AppError(
        "Tài khoản của bạn đã bị vô hiệu hóa, vui lòng liên hệ quản trị viên",
        403
      )
    );
  }

  generateToken(res, user);
  user.password = undefined;

  res.status(200).json({ message: "Đăng nhập thành công", user: user });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const id = req.user._id;
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

export const getMe = catchAsync(async (req, res, next) => {
  const id = req.user._id;

  const user = await User.findById(id);

  if (!user) return next(new AppError("Người dùng không tồn tại", 404));

  res
    .status(200)
    .json({ message: "Lấy thông tin người dùng thành công", user });
});

export const logout = (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Chỉ dùng cookie bảo mật trên môi trường production
    sameSite: "strict",
  });
  res.status(200).json({ message: "Đăng xuất thành công" });
};
