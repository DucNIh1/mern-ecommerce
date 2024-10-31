import Product from "../models/product.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import ApiFeature from "../utils/ApiFeature.js";
import fs from "fs";
import path from "path";
import Order from "../models/order.model.js";

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, images, category, description, price, sizes, target } =
    req.body;

  if (
    !name ||
    !images ||
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
    images,
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

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Sản phẩm không tồn tại", 404));
  }

  const {
    name,
    price,
    sizes,
    description,
    images, // Đây là danh sách các ảnh mới
    target,
    category,
    isActive,
  } = req.body;

  // Cập nhật thông tin vào sản phẩm
  if (name) product.name = name;
  if (price) product.price = price;
  if (description) product.description = description;
  if (target) product.target = target;
  if (category) product.category = category;
  if (typeof isActive === "boolean") product.isActive = isActive;

  // Xóa ảnh cũ nếu có ảnh mới được cung cấp
  if (images && Array.isArray(images)) {
    const projectRoot = path.resolve();
    const oldImages = product.images || [];

    // Xóa ảnh cũ không còn được sử dụng
    oldImages.forEach((oldImage) => {
      if (!images.includes(oldImage)) {
        const imagePath = path.join(projectRoot, oldImage);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Lỗi khi xóa ảnh: ${err}`);
          }
        });
      }
    });

    // Cập nhật danh sách ảnh
    product.images = images;
  }

  // Cập nhật số lượng cho size nếu có
  if (sizes && Array.isArray(sizes)) {
    sizes.forEach((newSize) => {
      const existingSizeIndex = product.sizes.findIndex(
        (s) => s.size === newSize.size
      );

      if (existingSizeIndex !== -1) {
        // Nếu size đã tồn tại, cập nhật quantity
        product.sizes[existingSizeIndex].quantity = newSize.quantity;
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
  const features = new ApiFeature(
    Product.find().populate("category"),
    req.query
  )
    .filter()
    .sort()
    .selectFields()
    .paginate();

  // Lấy ra các sản phẩm theo query
  const products = await features.query;
  console.log(products.length);
  // Tính tổng số sản phẩm dựa trên bộ lọc đã áp dụng
  const filteredProductCount = await Product.countDocuments(
    features.query.getFilter()
  );

  // Tính tổng số trang dựa trên số sản phẩm đã lọc
  const limit = +req.query.limit || 10; // Số lượng sản phẩm mỗi trang
  const totalPages = Math.ceil(filteredProductCount / limit);

  // Trang hiện tại
  const currentPage = +req.query.page || 1;

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

  const product = await Product.findById(id).populate("category");
  if (!product)
    return next(new AppError("Không tìm thấy sản phẩm có này", 404));

  res
    .status(200)
    .json({ message: "Lấy thông tin chi tiết 1 sản phẩm thành công", product });
});

// soft delete
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

export const addProductReview = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { rating, comment, images = [] } = req.body;
  const productId = req.params.id;

  // Tìm sản phẩm theo ID
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Không tìm thấy sản phẩm", 404));
  }

  // Tìm đơn hàng đã giao chứa sản phẩm
  const order = await Order.findOne({
    user: userId,
    items: { $elemMatch: { product: productId } },
    orderStatus: "Đã giao hàng",
  });

  if (!order) {
    return next(
      new AppError(
        "Bạn chưa mua sản phẩm này hoặc đơn hàng chưa được giao",
        400
      )
    );
  }

  // Kiểm tra xem người dùng đã đánh giá sản phẩm trong đơn hàng này chưa
  const alreadyReviewed = product.reviews.find(
    (r) =>
      r.user.toString() === userId.toString() &&
      r.order.toString() === order._id.toString()
  );

  if (alreadyReviewed) {
    return next(new AppError("Bạn đã đánh giá sản phẩm này", 400));
  }

  // Thêm đánh giá mới
  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: userId,
    order: order._id,
    images,
  };

  product.reviews.push(review);

  // Cập nhật số lượng đánh giá và rating trung bình
  product.numReviews = product.reviews.length;
  product.ratingAvg =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: "Đánh giá sản phẩm thành công" });
});

export const getRelatedProducts = catchAsync(async (req, res, next) => {
  const { productId } = req.query;
  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Sản phẩm không tồn tại", 404));
  }

  const relatedProducts = await Product.find({
    _id: { $ne: productId },
    category: product.category,
  });

  res.status(200).json({
    status: "success",
    data: {
      products: relatedProducts,
    },
  });
});

export const absoluteDelete = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  // Tìm sản phẩm theo ID
  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Không tồn tại sản phẩm", 404));

  // Xác định đường dẫn ảnh
  const projectRoot = path.resolve();
  const imagePaths = product.images;

  // Xóa sản phẩm
  await Product.findByIdAndDelete(productId);

  console.log(imagePaths);
  // Xóa từng ảnh
  imagePaths.forEach((image) => {
    const imagePath = path.join(projectRoot, image); // Tạo đường dẫn cho từng ảnh
    console.log(imagePath);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Lỗi khi xóa ảnh: ${err}`);
        // Không dừng lại nếu có lỗi xóa một ảnh
      }
    });
  });

  res.status(200).json({ message: "Xóa sản phẩm vĩnh viễn thành công" });
});
