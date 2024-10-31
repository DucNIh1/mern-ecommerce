import multer from "multer";
import path from "path";
import express from "express";

const router = express.Router();

// khởi tạo nơi lưu trữ trên server
const storage = multer.diskStorage({
  // điểm lưu trữ thư mục uploads
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  // Khởi tạo tên file riêng biệt tránh trùng lặp
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

// Điều kiện file có thể upload lên server
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Kiểm tra regex hợp lệ không
  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh"), false);
  }
};

// Khởi tao middleware
const upload = multer({ storage, fileFilter });
const uploadMultipleImages = upload.array("images", 5);

// router.post(
//   "/",
//   uploadSingleImage,
//   catchAsync(async (req, res, next) => {
//     console.log(req.file);
//     res.status(200).send({
//       message: "Image uploaded successfully",
//       image: `${req.file.path}`,
//     });
//   })
// );

router.post("/", (req, res) => {
  uploadMultipleImages(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => `/${file.path}`);
      res.status(200).send({
        message: "Tải ảnh lên thành công",
        images: imagePaths, // Trả về danh sách đường dẫn ảnh đã upload
      });
    } else {
      res.status(400).send({ message: "Bạn chưa cung cấp hình ảnh" });
    }
  });
});

export default router;
