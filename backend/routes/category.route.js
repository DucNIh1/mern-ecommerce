import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").post(createCategory).get(getAllCategories);
router.route("/:id").delete(deleteCategory).put(updateCategory);
export default router;
