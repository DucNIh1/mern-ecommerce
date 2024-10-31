import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Category from "../models/category.model.js";
import ApiFeature from "../utils/ApiFeature.js";

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
  const features = new ApiFeature(Category.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .paginate();

  // Lấy ra các sản phẩm theo query
  const categories = await features.query;

  // Tính tổng số sản phẩm dựa trên bộ lọc đã áp dụng
  const filteredCategoriesCount = await Category.countDocuments(
    features.query.getFilter()
  );

  // Tính tổng số trang dựa trên số sản phẩm đã lọc
  const limit = +req.query.limit || 10;
  const totalPages = Math.ceil(filteredCategoriesCount / limit);

  const currentPage = +req.query.page || 1;

  res.status(200).json({
    status: "success",
    results: categories.length,
    totalPages,
    currentPage,
    categories,
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const category = await Category.findById(id);

  if (!category) {
    return next(new AppError("Danh mục không tồn tại", 404));
  }

  if (category.isActive === true)
    return next(new AppError("Danh mục đang được sử dụng, không thể xóa", 400));

  const result = await Category.findByIdAndDelete(id);

  res
    .status(200)
    .json({ message: `Danh mục ${result.name} đã được xóa thành công` });
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
