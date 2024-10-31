import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
} from "../nodemail/mail.js";
import crypto from "crypto";

const generateToken = (res, user) => {
  const accessToken = jwt.sign({ user: user }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ user: user }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "30d",
  });

  res.cookie("jwt", refreshToken, {
    maxAge: 60 * 60 * 1000 * 30, // 30days
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return accessToken;
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

  // Tạo ra mã gồm 6 số để xác minh email
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // tạo mới user
  const user = await User.create({
    email,
    password,
    username,
    verificationToken: verificationToken,
    verificationTokenExpiresAt: Date.now() + 3600 * 24, // 24h
  });

  // Gửi token qua mail để xác minh tài khoản
  await sendVerificationEmail(email, verificationToken);
  // user.password = undefined;
  // const accessToken = generateToken(res, user);
  res.status(200).json({ message: "Vui lòng xác minh email" });
});

export const verificationEmail = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: {
      $gt: Date.now(),
    },
  }).select("-password");

  if (!user)
    return next(new AppError("Mã xác minh không hợp lệ hoặc đã hết hạn", 400));

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;

  // Lưu thay đổi vào cơ sở dữ liệu
  await user.save();

  const accessToken = generateToken(res, user);

  res.status(200).json({
    message: "Xác minh tài khoản thành công",
    accessToken,
    user,
  });
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

  if (!user.isVerified) {
    // Nếu signup rồi nhưng chưa xác minh thì khi đăng nhập gửi 1 mã xác minh mới
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 3600 * 24;

    await user.save();
    await sendVerificationEmail(email, verificationToken);
    return res
      .status(200)
      .json({ message: "Mã xác minh đã được gửi qua email!" });
  }

  const accessToken = generateToken(res, user);
  user.password = undefined;

  res.status(200).json({ message: "Đăng nhập thành công", accessToken, user });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const { username, email, password } = req.body;

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

  user.password = password || user.password;

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

export const refresh = (req, res) => {
  console.log("refresh");
  const cookies = req.cookies.jwt;

  if (!cookies) {
    return res
      .status(401)
      .json({ message: "Token không khả dụng hoặc không tồn tại" });
  }

  const refreshToken = cookies;

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_KEY,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token không hợp lệ" });
      }
      try {
        const foundUser = await User.findById(decoded.user._id);

        if (!foundUser) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        // Xóa password khỏi object người dùng trước khi tạo access token mới
        foundUser.password = undefined;

        const accessToken = jwt.sign(
          {
            user: foundUser,
          },
          process.env.JWT_KEY,
          { expiresIn: "1d" }
        );

        return res.json({ accessToken, user: foundUser });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email, isActive: true });

  if (!user)
    return next(new AppError("Email không tồn tại hoặc đã bị khóa!", 400));

  // Tao reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000;

  user.resetPasswordExpiresAt = resetTokenExpiresAt;
  user.resetPasswordToken = resetToken;
  await user.save();

  await sendPasswordResetEmail(
    email,
    `http://localhost:5173/reset-password/${resetToken}`
  );
  res.status(200).json({ message: "Kiểm tra email của bạn" });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const token = req.params.token;

  console.log(password, token);
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return next(
      new AppError("Token không hợp lệ hoặc không tồn tại tài khoản này", 401)
    );

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  await sendResetSuccessEmail(user.email);
  res.status(200).json({ message: "Khôi phục mật khẩu thành công" });
});

export const checkAuth = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId).select("-password");

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
