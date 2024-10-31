import express from "express";
// import formidableMiddleware from "express-formidable";
import {
  addProductReview,
  createProduct,
  deleteProductById,
  getAllProduct,
  getProductById,
  updateProduct,
  getRelatedProducts,
  absoluteDelete,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/checkAuth.js";
import { authorizeRoles } from "../middlewares/checkRole.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorizeRoles("admin"), createProduct)
  .get(getAllProduct);
router.get("/related-products", getRelatedProducts);
router.post("/:id/reviews", protect, addProductReview);
router
  .route("/:id")
  .put(protect, authorizeRoles("admin"), updateProduct)
  .get(getProductById)
  .delete(protect, authorizeRoles("admin"), deleteProductById);

router.delete("/:id/force", protect, authorizeRoles("admin"), absoluteDelete);
export default router;
