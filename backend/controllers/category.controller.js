import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Category from "../models/category.model.js";

export const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name)
    return next(new AppError("Vui lòng nhập tên danh mục sản phẩm", 400));

  const category = await Category.create({ name });

  res
    .status(200)
    .json({ message: "Tạo danh mục sản phẩm thành công", category });
});

export const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    message: "Lấy danh sách danh mục sản phẩm thành công",
    categories,
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!category) {
    return next(new AppError("Danh mục không tồn tại", 404));
  }

  res
    .status(200)
    .json({ message: "Danh mục đã được xóa thành công", category });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const { name, isActive } = req.body;

  const category = await Category.findById(id);

  if (!category) {
    return next(new AppError("Danh mục không tồn tại", 404));
  }

  category.name = name || category.name;
  if (typeof isActive === "boolean") {
    category.isActive = isActive;
  }

  await category.save();

  res.status(200).json({
    message: "Cập nhật danh mục thành công",
    category,
  });
});
