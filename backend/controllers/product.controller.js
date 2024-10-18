import Product from "../models/product.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import ApiFeature from "../utils/ApiFeature.js";

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

  // Hàm sắp xếp dựa trên thứ tự size mong muốn
  const sizeOrder = ["s", "m", "l", "xl"];

  sizes.sort((a, b) => {
    return (
      sizeOrder.indexOf(a.size.toLowerCase()) -
      sizeOrder.indexOf(b.size.toLowerCase())
    );
  });

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
    sizes.forEach((newSize) => {
      const existingSizeIndex = product.sizes.findIndex(
        (s) => s.size === newSize.size
      );

      if (newSize.quantity === 0) {
        // Nếu quantity = 0 thì xóa size
        if (existingSizeIndex !== -1) {
          product.sizes.splice(existingSizeIndex, 1);
        }
      } else {
        if (existingSizeIndex !== -1) {
          // Nếu size đã tồn tại, cập nhật quantity
          product.sizes[existingSizeIndex].quantity = newSize.quantity;
        } else {
          // Nếu size chưa tồn tại, thêm mới
          product.sizes.push({
            size: newSize.size,
            quantity: newSize.quantity,
          });
        }
      }
    });
  }

  // Hàm sắp xếp dựa trên thứ tự size mong muốn
  const sizeOrder = ["s", "m", "l", "xl"];

  product.sizes.sort((a, b) => {
    return (
      sizeOrder.indexOf(a.size.toLowerCase()) -
      sizeOrder.indexOf(b.size.toLowerCase())
    );
  });

  // Lưu lại sản phẩm đã cập nhật
  await product.save();

  // Trả về thông tin sản phẩm đã cập nhật
  res.status(200).json({
    message: "Cập nhật sản phẩm thành công",
    product: product,
  });
});

export const getAllProduct = catchAsync(async (req, res, next) => {
  let filter = { isActive: true };

  if (req.user && req.user.role === "admin") {
    filter = {};
  }

  const totalProducts = await Product.countDocuments();

  const features = new ApiFeature(
    Product.find(filter).populate("category"),
    req.query
  )
    .filter()
    .sort()
    .selectFields()
    .paginate();

  // Lấy ra các sản phẩm theo query
  const products = await features.query;
  if (products.length <= 0) {
    res.status(404).json({ message: "Không có sản phẩm nào" });
  }
  // Tính tổng số trang
  const limit = +req.query.limit || 10; // Số lượng sản phẩm mỗi trang
  const totalPages = Math.ceil(totalProducts / limit);

  // Trang hiện tại
  const currentPage = +req.query.page || 1;

  if (currentPage > totalPages) {
    return next(new AppError("Trang page này không tồn tại", 404));
  }
  // Trả về kết quả
  res.status(200).json({
    status: "success",
    results: products.length,
    totalPages, // Tổng số trang
    currentPage, // Trang hiện tại
    products,
  });
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
