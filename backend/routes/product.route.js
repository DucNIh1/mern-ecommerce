import express from "express";
// import formidableMiddleware from "express-formidable";
import {
  createProduct,
  deleteProductById,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.route("/").post(createProduct).get(getAllProduct);

router
  .route("/:id")
  .put(updateProduct)
  .get(getProductById)
  .delete(deleteProductById);
export default router;
