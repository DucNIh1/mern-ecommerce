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
const uploadSingleImage = upload.single("image");

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
  uploadSingleImage(req, res, (err) => {
    console.log(req.file);
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Tải ảnh lên thành công",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "Bạn chưa cung cấp hình ảnh" });
    }
  });
});

export default router;
