import Product from "../models/product.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, image, category, description, price, sizes, target } = req.body;

  if (
    !name ||
    !image ||
    !category ||
    !description ||
    !price ||
    !sizes ||
    !target
  ) {
    return next(new AppError("Vui lòng nhập đầy đủ thông tin", 400));
  }

  const product = await Product.findOne({ name });

  if (product) return res.status(400).json({ message: "Sản phẩm đã tồn tại" });

  const newProduct = await Product.create({
    name,
    image,
    sizes,
    category,
    description,
    price,
    target,
  });

  res
    .status(200)
    .json({ message: "Tạo sản phẩm thành công", product: newProduct });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  // Kiểm tra xem sản phẩm có tồn tại không
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Sản phẩm không tồn tại", 404));
  }

  // Cập nhật các trường cần thiết
  const { name, price, sizes, description, image, target, category, isActive } =
    req.body;

  // Cập nhật thông tin vào sản phẩm
  if (name) product.name = name;
  if (price) product.price = price;
  if (description) product.description = description;
  if (image) product.image = image;
  if (target) product.target = target;
  if (category) product.category = category;
  if (typeof isActive === "boolean") product.isActive = isActive;

  // Cập nhật số lượng cho size nếu có
  if (sizes && Array.isArray(sizes)) {
    sizes.forEach((size) => {
      const sizeIndex = product.sizes.findIndex(
        (item) => item.size === size.size
      );
      if (sizeIndex !== -1) {
        // Cập nhật quantity nếu size đã tồn tại
        product.sizes[sizeIndex].quantity = size.quantity;
      } else {
        // Nếu size không tồn tại, thêm mới size vào danh sách
        product.sizes.push(size);
      }
    });
  }
  // Lưu lại sản phẩm đã cập nhật
  await product.save();

  // Trả về thông tin sản phẩm đã cập nhật
  res.status(200).json({
    message: "Cập nhật sản phẩm thành công",
    product: product,
  });
});

export const getAllProduct = catchAsync(async (req, res, next) => {
  const query = { isActive: true };
  if (req.user && req.user.role === "admin") {
    query = {};
  }
  const products = await Product.find(query);

  res
    .status(200)
    .json({ message: "Lấy danh sách sản phẩm thành công", products });
});

export const getProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const query = { isActive: true };
  if (req.user && req.user.role === "admin") {
    query = {};
  }

  const product = await Product.findById(id).populate("category");
  if (!product)
    return next(new AppError("Không tìm thấy sản phẩm có này", 404));

  res
    .status(200)
    .json({ message: "Lấy thông tin chi tiết 1 sản phẩm thành công", product });
});

export const deleteProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    return next(new AppError("Sản phẩm không tồn tại", 404));
  }

  res.status(200).json({ message: "Xóa sản phẩm thành công", product });
});
