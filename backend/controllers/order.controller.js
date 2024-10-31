import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import ApiFeature from "../utils/ApiFeature.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import AppError from "../utils/AppError.js";

export const createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const {
    username,
    street,
    phone,
    city,
    district,
    ward,
    items,
    paymentMethod = "Thanh toán tiền mặt",
    totalPrice,
  } = req.body;

  if (
    !username ||
    !street ||
    !phone ||
    !city ||
    !district ||
    !ward ||
    !items ||
    !paymentMethod ||
    !totalPrice
  ) {
    return next(new AppError("Vui lòng điền đầy đủ thông tin đơn hàng", 400));
  }

  await Order.create({
    user: userId,
    shippingAddress: {
      username,
      street,
      phone,
      city,
      district,
      ward,
    },
    items: items,
    paymentMethod: paymentMethod,
    totalPrice: totalPrice,
  });

  // Cập nhật số lượng sản phẩm trong kho
  for (const item of items) {
    const productId = item.product;
    const size = item.size;
    const quantityToSubtract = item.quantity;

    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new AppError(`Sản phẩm với ID ${productId} không tồn tại`, 404)
      );
    }

    const sizeEntry = product.sizes.find((s) => s.size === size);
    if (!sizeEntry) {
      return next(
        new AppError(
          `Size ${size} của sản phẩm ${product.name} đã hết hàng`,
          400
        )
      );
    }

    if (sizeEntry.quantity < quantityToSubtract) {
      return next(
        new AppError(
          `Không đủ số lượng sản phẩm ${product.name} kích cỡ ${size}`,
          400
        )
      );
    }

    sizeEntry.quantity -= quantityToSubtract;
    await product.save();
  }

  // Xóa sản phẩm trong giỏ hàng
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = [];

    await cart.save(); // Lưu giỏ hàng đã cập nhật
  }

  res.status(200).json({ message: "Đơn hàng đã được tạo thành công" });
});

export const getMyOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const features = new ApiFeature(
    Order.find({ user: userId }).populate({
      path: "items.product",
      select: "_id  category name price images reviews",
    }),
    req.query
  )
    .filter()
    .sort()
    .selectFields()
    .paginate();

  // Lấy ra các sản phẩm theo query
  const orders = await features.query;

  // Tính tổng số sản phẩm dựa trên bộ lọc đã áp dụng
  const filteredOrdersCount = await Order.countDocuments(
    features.query.getFilter()
  );

  // Tính tổng số trang dựa trên số sản phẩm đã lọc
  const limit = +req.query.limit || 10; // Số lượng sản phẩm mỗi trang
  const totalPages = Math.ceil(filteredOrdersCount / limit);

  // Trang hiện tại
  const currentPage = +req.query.page || 1;

  // Trả về kết quả
  res.status(200).json({
    status: "success",
    results: orders.length,
    totalPages, // Tổng số trang
    currentPage, // Trang hiện tại
    orders,
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const features = new ApiFeature(
    Order.find().populate({
      path: "items.product",
      select: "_id images category name price",
    }),
    req.query
  )
    .filter()
    .sort()
    .selectFields()
    .paginate();

  // Lấy ra các sản phẩm theo query
  const orders = await features.query;

  // Tính tổng số sản phẩm dựa trên bộ lọc đã áp dụng
  const filteredOrdersCount = await Order.countDocuments(
    features.query.getFilter()
  );

  // Tính tổng số trang dựa trên số sản phẩm đã lọc
  const limit = +req.query.limit || 10;

  const totalPages = Math.ceil(filteredOrdersCount / limit);

  const currentPage = +req.query.page || 1;

  res.status(200).json({
    status: "success",
    results: orders.length,
    totalPages,
    currentPage,
    orders,
  });
});

export const cancelOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;
  let query = {};

  if (req.user.role === "user") {
    query = { _id: orderId, user: req.user.id, orderStatus: "Đang xử lí" };
  } else if (req.user.role === "admin") {
    query = { _id: orderId, orderStatus: "Đang xử lí" };
  }

  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("Người dùng không tồn tại", 400));

  const order = await Order.findOneAndUpdate(
    query,
    { orderStatus: "Đã hủy đơn" },
    { new: true }
  );
  if (!order) return next(new AppError("Không tồn tại đơn hàng này", 400));

  // Xử lý hoàn lại số lượng của từng sản phẩm theo size
  for (let item of order.items) {
    const productId = item.product;
    const size = item.size;
    const quantityToRestore = item.quantity;

    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new AppError(`Sản phẩm với ID ${productId} không tồn tại`, 404)
      );
    }

    const sizeEntry = product.sizes.find((s) => s.size === size);
    if (!sizeEntry) {
      return next(
        new AppError(
          `Size ${size} không tồn tại cho sản phẩm ${productId}`,
          404
        )
      );
    }

    sizeEntry.quantity += quantityToRestore;
    await product.save();
  }

  // Phản hồi thành công
  res.status(200).json({ message: "Hủy đơn hàng thành công" });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const validateStatuses = [
    "Đang xử lí",
    "Đang vận chuyển",
    "Đã giao hàng",
    "Đã hủy đơn",
  ];

  const orderId = req.params.id;
  const { orderStatus } = req.body;

  if (!validateStatuses.includes(orderStatus))
    return next(new AppError("Trạng thái đơn hàng không hợp lệ"));

  const order = await Order.findByIdAndUpdate(
    { _id: orderId },
    { orderStatus },
    { new: true }
  );

  if (!order) return next(new AppError("Không tìm thấy đơn hàng!", 404));

  if (orderStatus === "Đã giao hàng") {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { totalSold: item.quantity },
      });
    }
  }

  res.status(200).json({ message: "Cập nhật trạng thái đơn hàng thành công" });
});

export const deleteOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;

  // Tìm và xóa đơn hàng chỉ khi nó ở trạng thái "Đã hủy đơn"
  const order = await Order.findOneAndDelete({
    _id: orderId,
    orderStatus: { $in: ["Đã hủy đơn", "Đã giao hàng"] },
  });

  if (!order) {
    return next(
      new AppError(
        "Không tồn tại đơn hàng này hoặc đơn hàng đang trong quá trình xử lí vận chuyển",
        404
      )
    );
  }

  res.status(200).json({ message: "Xóa đơn hàng thành công" });
});
