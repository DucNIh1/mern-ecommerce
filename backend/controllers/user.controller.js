import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiFeature from "../utils/ApiFeature.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findOneAndDelete({ _id: id, isActive: false });

  if (!user) {
    return next(
      new AppError(
        "Không tồn tại tài khoản hoặc tài khoản đang được sử dụng",
        404
      )
    );
  }

  res.status(200).json({ message: "Tài khoản đã được xóa thành công" });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const features = new ApiFeature(User.find().select("-password"), req.query)
    .filter()
    .sort()
    .selectFields()
    .paginate();

  // Lấy ra các sản phẩm theo query
  const users = await features.query;

  // Tính tổng số sản phẩm dựa trên bộ lọc đã áp dụng
  const filteredUserCount = await User.countDocuments(
    features.query.getFilter()
  );

  // Tính tổng số trang dựa trên số sản phẩm đã lọc
  const limit = +req.query.limit || 10; // Số lượng sản phẩm mỗi trang
  const totalPages = Math.ceil(filteredUserCount / limit);

  // Trang hiện tại
  const currentPage = +req.query.page || 1;

  // Trả về kết quả
  res.status(200).json({
    status: "success",
    results: users.length,
    totalPages, // Tổng số trang
    currentPage, // Trang hiện tại
    users,
  });
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

export const addToWishList = catchAsync(async (req, res, next) => {
  const user = req.user;

  const { productId, size = "s" } = req.body;

  // Kiểm tra sản phẩm có tồn tại trong cơ sở dữ liệu hay không
  const findProduct = await Product.findById(productId);

  if (!findProduct)
    return next(
      new AppError("Không tồn tại sản phẩm này, vui lòng thử lại", 404)
    );

  // Lấy người dùng hiện tại và populate wishlist
  const findUser = await User.findById(user._id).populate("wishlist");

  if (!findUser)
    return next(
      new AppError("Không tồn tại người dùng, vui lòng thử lại", 404)
    );

  if (findUser.wishlist.length <= 0) {
    findUser.wishlist.push({
      product: productId,
      size: size || "s", // Nếu không có size, sử dụng 'S'
    });

    await findUser.save();
    return res.status(200).json({
      message: "Thêm sản phẩm vô danh sách yêu thích thành công",
    });
  }
  // Kiểm tra nếu sản phẩm đã có trong wishlist với cùng size
  const productInWishlist = findUser.wishlist.find(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (productInWishlist) {
    return next(
      new AppError("Sản phẩm đã tồn tại trong danh sách yêu thích", 400)
    );
  }

  // Nếu chưa có, thêm sản phẩm vào wishlist
  findUser.wishlist.push({
    product: productId,
    size: size || "s", // Nếu không có size, sử dụng 'S'
  });
  await findUser.save();

  // Populate lại wishlist để trả về thông tin chi tiết của sản phẩm
  await findUser.populate("wishlist");

  res.status(200).json({
    message: "Thêm sản phẩm vô danh sách yêu thích thành công",
  });
});

export const deleteFromWishList = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { productId, size } = req.body;
  console.log(productId, size);
  // Kiểm tra sản phẩm có tồn tại trong cơ sở dữ liệu hay không
  const findProduct = await Product.findById(productId);

  if (!findProduct)
    return next(
      new AppError("Không tồn tại sản phẩm này, vui lòng thử lại", 404)
    );

  // Lấy người dùng hiện tại và populate wishlist
  const findUser = await User.findById(user._id)
    .populate("wishlist")
    .select("-password");
  console.log(findUser);
  // Tìm vị trí của sản phẩm trong wishlist
  const index = findUser.wishlist.findIndex(
    (item) => item.product.toString() === productId && item.size === size
  );

  // Kiểm tra nếu sản phẩm không có trong wishlist
  if (index === -1)
    return next(
      new AppError("Sản phẩm không tồn tại trong danh sách yêu thích", 404)
    );

  // Xóa sản phẩm khỏi wishlist
  findUser.wishlist.splice(index, 1);

  // Lưu thay đổi
  await findUser.save();

  res.status(200).json({
    message: "Xóa sản phẩm khỏi danh sách yêu thích thành công",
  });
});

export const getMyWishList = catchAsync(async (req, res, next) => {
  const user = req.user;

  const findUser = await User.findById(user._id).populate("wishlist").populate({
    path: "wishlist.product",
    select: "images name price  category",
  });

  if (!findUser) return next(new AppError("Không tìm thấy người dùng", 404));

  res.status(200).json({
    message: "Lấy thành công danh sách sản phẩm yêu thích",
    totalProducts: findUser.wishlist.length,
    wishlist: findUser.wishlist,
  });
});

// Admin
export const updateUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { username, email, isActive } = req.body;

  if (username && username.length < 3) {
    return next(new AppError("Username phải có ít nhất 3 kí tự", 400));
  }
  if (email && !validator.isEmail(email)) {
    return next(new AppError("Vui lòng nhập đúng định dạng email", 400));
  }

  const user = await User.findById(id);

  user.username = username || user.username;
  user.email = email || user.email;
  user.isActive = isActive || user.isActive;
  await user.save();

  res.status(200).json({ message: "Cập nhật thông tin thành công", user });
});
