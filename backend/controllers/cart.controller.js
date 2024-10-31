import Product from "../models/product.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Cart from "../models/cart.model.js";

export const getCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name price images",
  });

  // Kiểm tra nếu giỏ hàng không tồn tại
  if (!cart || cart.items.length === 0) {
    return res
      .status(200)
      .json({ message: "Giỏ hàng của bạn đang trống", cart: [] });
  }
  const totalItems = cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  res
    .status(200)
    .json({ message: "Lấy thông tin giỏ hàng thành công", cart, totalItems });
});

export const addToCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Kiểm tra xem đầu vào là một mảng hay chỉ một sản phẩm duy nhất
  const products = Array.isArray(req.body.products)
    ? req.body.products
    : [req.body];

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    await Cart.create({
      user: userId,
      items: products.map((product) => ({
        product: product.productId,
        quantity: product.quantity || 1,
        size: product.size || "s",
        price: product.price,
      })),
    });
    return res.status(200).json({ message: "Thêm vào giỏ hàng thành công" });
  }

  // Duyệt qua từng sản phẩm trong mảng
  for (const { productId, size = "s", quantity = 1, price } of products) {
    const product = await Product.findById(productId);

    if (!product) return next(new AppError("Sản phẩm không tồn tại", 404));

    // Tìm xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const findItemIndex = cart.items.findIndex(
      (item) => item.product.toString() == productId && item.size === size
    );

    // Nếu đã có trong giỏ hàng, tăng quantity
    if (findItemIndex !== -1) {
      cart.items[findItemIndex].quantity += quantity;
    } else {
      // Nếu chưa có, thêm mới vào giỏ hàng
      cart.items.push({ product: productId, quantity, size, price });
    }
  }

  await cart.save();

  res.status(200).json({ message: "Thêm vào giỏ hàng thành công" });
});

export const increQt = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;

  const { size } = req.body;

  const product = await Product.findById(productId);

  if (!product) return next(new AppError("Không tìm thấy sản phẩm", 404));

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new AppError("Giỏ hàng không tồn tại", 404));

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (itemIndex !== -1) {
    // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
    cart.items[itemIndex].quantity += 1; // Tăng số lượng
  } else {
    return next(new AppError("Không tồn tại sản phẩm trong giỏ hàng", 404));
  }
  await cart.save();

  res.status(200).json({ message: "Tăng số lượng sản phẩm thành công" });
});

export const decreQt = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;

  const { size } = req.body;

  const product = await Product.findById(productId);

  if (!product) return next(new AppError("Không tìm thấy sản phẩm", 404));

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new AppError("Giỏ hàng không tồn tại", 404));

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (itemIndex !== -1) {
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }
  }
  await cart.save();

  res.status(200).json({ message: "Giảm số lượng sản phẩm thành công" });
});

export const deleteFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;

  const { size } = req.body;
  const product = await Product.findById(productId);

  if (!product) return next(new AppError("Không tìm thấy sản phẩm", 404));

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new AppError("Giỏ hàng không tồn tại", 404));

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (itemIndex !== -1) {
    cart.items.splice(itemIndex, 1);
    await cart.save();

    return res
      .status(200)
      .json({ message: "Xóa thành công sản phẩm khỏi giỏ hàng" });
  } else {
    return res
      .status(404)
      .json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
  }
});
